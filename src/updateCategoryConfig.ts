// update config source
function updateCategoryConfig(apiUrl: string, sheetId: string): void {
    try {
        // validate
        assert(apiUrl.length > 0, 'apiUrl is empty');
        assert(sheetId.length > 0, 'sheetId is empty');

        // get game categories
        const dataGame = JSON.parse(UrlFetchApp.fetch(apiUrl).getContentText());

        // get variables
        const apiVariables = dataGame.data[0].links.find(link => link.rel === 'variables').uri;
        assert(apiVariables !== undefined, "Variables link is not found.");

        const dataVariables = JSON.parse(UrlFetchApp.fetch(apiVariables).getContentText());

        // correspondence variables
        const table: string[][] = [];

        for (let category of dataGame.data[0].categories.data) {
            const row: string[] = [];

            // Any% (9kv83mjd)
            row.push(category.name + ' (' + category.id + ')');

            const objectsCorrespondToId = dataVariables.data.filter(variable => {
                return variable.category === category.id || variable.category === null
            });

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
        const spreadsheet = SpreadsheetApp.openById(sheetId);
        const sheet = spreadsheet.getSheets()[1];

        // clear values besides the first row
        const range = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn());
        range.clearContent();

        // write values
        sheet.getRange(2, 1, table.length, table[0].length).setValues(table);

    } catch (error) {
        Logger.log(error);
    }
}

function updateSrcCategoryConfig(): void {
    updateCategoryConfig(SRC_API_GAME, SHEET_ID_CATEGORY_CONFIGULATION_SRC);
}

function updateSrcCeCategoryConfig(): void {
    updateCategoryConfig(SRC_API_GAME_CE, SHEET_ID_CATEGORY_CONFIGULATION_SRC_CE);
}