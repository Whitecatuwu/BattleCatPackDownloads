class TaskModel {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    notify(msg) {
        this.observers.forEach((observer) => observer(msg));
    }

    async getZip(ver) {
        const url = `https://github.com/Whitecatuwu/TheBattleCat-Resource-Pack/archive/refs/heads/${ver}.zip`

        const zipData = await this.#fetchZip(url);
        if (zipData)
            return await this.#reZip(zipData);
    }

    downloadZip(blob, filename) {
        if (!blob)
            return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    async #fetchZip(url) {
        try {
            this.notify(`Fetching...`);
            // 使用公共 CORS 代理來繞過限制
            const proxyUrl = `https://corsproxy.io/?url=${url}`;
            //const proxyUrl = `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error(`下載失敗: ${response.statusText}`);
            return response.arrayBuffer();
        } catch (error) {
            this.notify(`Fetching failed`);
            console.error(error);
        }
    }

    async #reZip(content) {
        if (!content)
            return
        const zip = new JSZip();
        const newZip = new JSZip();

        try {
            const zipData = await zip.loadAsync(content);

            // 找到頂層目錄
            const rootFolders = Object.keys(zipData.files).filter(name => !name.endsWith('/') && name.split('/').length > 1);
            const commonPrefix = rootFolders[0].split('/')[0] + '/';

            // 移除頂層目錄，重新打包
            let promises = Object.entries(zipData.files).map(async ([name, file]) => {
                const newName = name.startsWith(commonPrefix) ? name.replace(commonPrefix, '') : name;
                if (!file.dir) {
                    newZip.file(newName, await file.async('arraybuffer'));
                }
            });
            await Promise.all(promises);

            const blob = await newZip.generateAsync({
                type: 'blob',
                streamFiles: true,
                compression: "DEFLATE",
                compressionOptions: { level: 6 }
            }, (metadata) => {
                this.notify(`Processing... ${metadata.percent.toFixed(2)}%`);
            });

            this.notify(`Processing completed`);
            return blob;

        } catch (error) {
            this.notify(`Processing failed`);
            console.error(error);
        }
    }
}
