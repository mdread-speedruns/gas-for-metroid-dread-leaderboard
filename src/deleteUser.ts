/**
 * delete runner
 * 
 * @param e: DataReceiver
 */
function deleteUser(e: DataReceiver) {
    try {
        const authinfo = authUser(e.auth);
        if (authinfo.status !== 'success') {
            throw new Error(authinfo.message);
        }

        const id = authinfo.user.id;

        const sheet = SpreadsheetApp.openById(SHEET_ID_RUNNER).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        const rowId = header.indexOf(SHEET_USER_ID_LABEL);

        const row = table.find(row => row[rowId] === id);
        if (row === undefined) {
            throw new Error(id + ' was not found');
        }

        const rowIndex = table.indexOf(row);
        sheet.deleteRow(rowIndex + 2);

        const resultData: UserSender = {
            id: row[SHEET_USER_ID_LABEL],
            name: row[SHEET_USER_NAME_LABEL],
            nameJp: row[SHEET_USER_NAME_JP_LABEL],
            mail: row[SHEET_USER_MAIL_LABEL],
            password: row[SHEET_USER_PASSWORD_LABEL],
        };

        const result: DataSender = {
            status: 'success',
            message: 'The run has been added successfully.',
            user: resultData
        }

        return result;

    } catch (error) {
        Logger.log(error)
        const result: DataSender = {
            status: 'error',
            message: error.message,
        }
        return result;
    }
}


function deleteUserExample(): void {
    const result1 = addUser(JSON.parse(`{
        "id": "testeetetete",
        "name": "test",
        "nameJp": "テスト",
        "mail": "mail@example.com",
        "password": "test"
    }`));
    const result2 = deleteUser(JSON.parse(`{
        "id": "testeetetete"
    }`));
    Logger.log(result2);
}