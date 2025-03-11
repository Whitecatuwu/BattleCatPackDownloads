async function loadOptions() {
    let vers;
    await fetch('json/versions.json')
        .then(response => response.json())
        .then(jsonData => {
            vers = jsonData;
        })
        .catch(error => {
            console.error('讀取 JSON 失敗:', error);
        });

    const select = document.getElementById('verSelect');
    vers.forEach(option => {
        const opt = new Option(option.name, option.ver);
        select.add(opt);
    });
}
loadOptions();
