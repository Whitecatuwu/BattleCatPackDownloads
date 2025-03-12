class TaskView {
    constructor() {
        this.selectVersion = document.getElementById('selectVersion');
        this.downloadBtn = document.getElementById('downloadSelectedVersion');
        this.loadingDiv = document.getElementById('loading');
    }

    bindDownloadBtn(handle) {
        this.downloadBtn.addEventListener('click', async () => {
            this.loadingDiv.style.display = 'block';
            await handle(this.selectVersion.value);
            this.loadingDiv.style.display = 'none';
        })
    }

    addSelectOption(opt) {
        selectVersion.add(opt);
    }
}
