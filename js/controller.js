class TaskController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindDownloadBtn(this.downloadSelectedVer.bind(this));
        this.loadOptions();
    }

    async downloadSelectedVer(ver) {
        const blob = await this.model.getZip(ver);
        this.model.downloadZip(blob, `TheBattleCat-Resource-Pack-${ver}.zip`);
    }

    async loadOptions() {
        let vers;
        await fetch('json/versions.json')
            .then(response => response.json())
            .then(jsonData => {
                vers = jsonData;
            })
            .catch(error => {
                console.error('讀取 JSON 失敗:', error);
            });

        vers.forEach(option => {
            const opt = new Option(option.name, option.ver);
            this.view.addSelectOption(opt);
        });
    }
}

// 啟動應用程式
document.addEventListener('DOMContentLoaded', () => {
    const model = new TaskModel();
    const view = new TaskView(model);
    new TaskController(model, view);
});
