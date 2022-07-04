/**
 * authentication user and password
 * 
 * @param data: AuthInfoReceiver
 *  {
 *      // assume id or mail is sent as a parameter, not both
 *      "id": ID,
 *      "mail": Mailaddress,
 *      "password": string
 *  }
 */
function authUser(data: AuthInfoReceiver): DataSender {
    try {
        const id: ID = data.id;
        const mail: Mailaddress = data.mail;
        const password: string = data.password;

        const sheet = SpreadsheetApp.openById(SHEET_ID_USER).getSheets()[0];
        // const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        const row = table.find(row => row[SHEET_USER_ID_LABEL] === id || row[SHEET_USER_MAIL_LABEL] === mail);
        if (row === undefined) {
            throw new Error(id + ' was not found');
        }

        // validate password
        const hashed = convertDataToSha256Hash(password, PASSWORD_STRETCHING_TIMES, id);
        if (hashed !== row[SHEET_USER_PASSWORD_LABEL]) {
            throw new Error('password is invalid');
        }

        const resultData: AuthInfoSender = {
            id: id,
            name: row[SHEET_USER_NAME_LABEL],
            nameJp: row[SHEET_USER_NAME_JP_LABEL],
            mail: mail,
            password: password
        };

        const result: DataSender = {
            status: 'success',
            message: 'runner was authenticated',
            auth: resultData
        };

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