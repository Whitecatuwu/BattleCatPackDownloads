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

    /*
    async getZip(ver) {
        const owner = 'Whitecatuwu';
        const repo = 'TheBattleCat-Resource-Pack';
        const url = `https://api.github.com/repos/${owner}/${repo}/zipball/${ver}`;

        const zipData = await this.#fetchZip(url);
        if (!zipData) return;

        return await this.#reZip(zipData);
    }*/

    downloadZip(ver, filename) {
        const owner = 'Whitecatuwu';
        const repo = 'TheBattleCat-Resource-Pack';
        const url = `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/${ver}`;

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(link.href);
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    /*
    async #fetchZip(url) {
        try {
            this.notify(`Fetching...`);
            const response = await fetch(url);

            // --- rate limit handling ---
            if (response.status === 403) {
                const remain = response.headers.get('x-ratelimit-remaining');
                if (remain === '0') {
                    throw new Error('GitHub API rate limit exceeded');
                }
            }

            if (!response.ok) {
                throw new Error(`下載失敗: ${response.statusText}`);
            }

            return await response.arrayBuffer();
        } catch (error) {
            this.notify(`Fetching failed`);
            console.error(error);
            return null;
        }
    }

    async #reZip(content) {
        if (!content) return null;

        try {
            const zipData = await JSZip.loadAsync(content);
            const newZip = new JSZip();

            const entries = Object.entries(zipData.files);

            // 找到頂層目錄
            const firstFile = entries.find(([, file]) => !file.dir);
            if (!firstFile) {
                throw new Error('zip 內沒有可處理的檔案');
            }
            const commonPrefix = firstFile[0].split('/')[0] + '/';

            // 移除頂層目錄，重新打包
            for (const [name, file] of entries) {
                const newName = name.startsWith(commonPrefix)
                    ? name.slice(commonPrefix.length)
                    : name;

                if (file.dir) {
                    if (newName) newZip.folder(newName);
                    continue;
                }

                const data = await file.async('arraybuffer');
                newZip.file(newName, data);
            }

            const blob = await newZip.generateAsync(
                {
                    type: 'blob',
                    streamFiles: true,
                    compression: 'DEFLATE',
                    compressionOptions: { level: 6 },
                },
                (metadata) => {
                    const p = Math.floor(metadata.percent);
                    if (p !== this.lastProgress) {
                        this.lastProgress = p;
                        this.notify(`Processing... ${metadata.percent.toFixed(2)}%`);
                    }
                }
            );

            this.notify(`Processing completed`);
            return blob;
        } catch (error) {
            this.notify(`Processing failed`);
            console.error(error);
            return null;
        }
    }*/
}
