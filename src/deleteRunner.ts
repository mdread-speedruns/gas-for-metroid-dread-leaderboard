/**
 * delete runner
 * 
 * @param id: string
 */
function deleteRunner(id: string) {
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID_RUNNER).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        const rowId = header.indexOf('id');

        const row = table.find(row => row[rowId] === id);
        if (row === undefined) {
            throw new Error(id + ' was not found');
        }

        const rowIndex = table.indexOf(row);
        sheet.deleteRow(rowIndex + 1);

        return {
            status: 'success',
            message: 'runner was deleted'
        };

    } catch (error) {
        Logger.log(error)
        return {
            status: "error",
            message: error.message
        }
    }
}


function deleteRunnerTest() {
    const id = '54229dad-21cc-4e1b-84f1-5f7f0a483827';
    const result = deleteRunner(id);
    Logger.log(result);
}