/**
 * delete runner
 * 
 * @param data: string
 * {
 *    "id": "string"
 * }
 */
function deleteRunner(data: string) {
    try {
        const json = JSON.parse(data);
        const id = json.id;

        const sheet = SpreadsheetApp.openById(SHEET_ID_RUNNER).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        const rowId = header.indexOf(SHEET_RUNNER_ID_LABEL);

        const row = table.find(row => row[rowId] === id);
        if (row === undefined) {
            throw new Error(id + ' was not found');
        }

        const rowIndex = table.indexOf(row);
        sheet.deleteRow(rowIndex + 2);

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


function deleteRunnerTest(): void {
    const runner = addRunner(`{
        "name": "test",
        "nameJp": "テスト",
        "mail": "mail@example.com",
        "password": "test"
    }`);
    const id = runner.data.id;
    const result = deleteRunner(id);
    Logger.log(result);
}