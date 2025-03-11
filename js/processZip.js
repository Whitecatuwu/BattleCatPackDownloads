async function getSelectedVersion() {
    const ver = document.getElementById('verSelect').value;
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'block';
    await processZip(ver);
    loadingDiv.style.display = 'none';
}

async function fetchZip(url) {
    try {
        // 使用公共 CORS 代理來繞過限制
        const proxyUrl = `https://corsproxy.io/?url=${url}`;

        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`下載失敗: ${response.statusText}`);

        return await response.arrayBuffer();
    } catch (error) {
        //alert('檔案下載失敗');
        console.error(error);
    }
}

async function processZip(ver) {
    const url = `https://github.com/Whitecatuwu/TheBattleCat-Resource-Pack/archive/refs/heads/${ver}.zip`

    try {
        const zipData = await fetchZip(url);
        await processZipContent(ver, zipData);
    } catch (error) {
        //alert('處理 ZIP 文件失敗');
        console.error(error);
    }
}

async function processZipContent(ver, content) {
    const zip = new JSZip();
    const newZip = new JSZip();

    try {
        const zipData = await zip.loadAsync(content);

        // 找到頂層目錄
        const rootFolders = Object.keys(zipData.files).filter(name => !name.endsWith('/') && name.split('/').length > 1);
        const commonPrefix = rootFolders[0].split('/')[0] + '/';

        // 移除頂層目錄，重新打包
        for (const [name, file] of Object.entries(zipData.files)) {
            const newName = name.startsWith(commonPrefix) ? name.replace(commonPrefix, '') : name;
            if (!file.dir) {
                newZip.file(newName, await file.async('arraybuffer'), {
                    compression: "DEFLATE"   // 使用 DEFLATE 壓縮
                });
            }
        }
        const blob = await newZip.generateAsync({ type: 'blob' });
        downloadZip(blob, `TheBattleCat-Resource-Pack-${ver}.zip`);
    } catch (error) {
        //alert('ZIP 文件處理失敗');
        console.error(error);
    }
}

function downloadZip(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}