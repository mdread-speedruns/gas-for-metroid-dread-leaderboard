// update config source
function updateCategoryConfigSRC(): void {
    // get game categories
    const dataGame = JSON.parse(UrlFetchApp.fetch(SRC_API_GAME).getContentText());

    // validate response
    assert(dataGame.data[0].id === SRC_MDREAD_CATEGORY_ID, "Game id is not correct. Is SRC_MDREAD_CATEGORY_ID correct?");

    // get variables
    const SRC_API_VARIABLES = dataGame.data[0].links.find(link => link.rel === 'variables').uri;
    assert(SRC_API_VARIABLES !== undefined, "Variables link is not found.");

    const dataVariables = JSON.parse(UrlFetchApp.fetch(SRC_API_VARIABLES).getContentText());

    // correspondence variables
    const table: Array<Array<string>> = [];

    for (let category of dataGame.data[0].categories.data) {
        const row: Array<string> = [];

        // Any% (9kv83mjd)
        row.push(category.name + ' (' + category.id + ')');

        const objectsCorrespondToId = dataVariables.data.filter(variable => variable.category === category.id);

        for (let obj of objectsCorrespondToId) {
            for (let valuesId in obj.values.values) {
                // Glitch Category=Unrestricted (wle962k8=zqog43p1)
                row.push(obj.name + '=' + obj.values.values[valuesId].label + ' (' + obj.id + '=' + valuesId + ')');
            }
        }

        table.push(row);

    }

    // adjust table length to fit the sheet
    const maxLength = table.reduce((max, row) => Math.max(max, row.length), 0);
    for (let row of table) {
        while (row.length < maxLength) {
            row.push('');
        }
    }

    // update spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID_CATEGORY_CONFIGULATION_SRC);
    const sheet = spreadsheet.getSheets()[1];

    sheet.getRange(2, 1, table.length, table[0].length).setValues(table);
}