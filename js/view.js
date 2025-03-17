class TaskView {
    constructor(model) {
        this.model = model;
        this.selectVersion = document.getElementById('selectVersion');
        this.downloadBtn = document.getElementById('downloadSelectedVersion');
        this.loadingDiv = document.getElementById('loading');

        this.model.subscribe((data) => {
            this.loadingDiv.innerText = data;
        });
    }

    bindDownloadBtn(handle) {
        this.downloadBtn.addEventListener('click', async () => {
            this.loadingDiv.style.display = 'block';
            this.downloadBtn.disabled = true;
            await handle(this.selectVersion.value);
            this.downloadBtn.disabled = false;
        })
    }

    addSelectOption(opt) {
        selectVersion.add(opt);
    }
}
