/**
 * add new runner's data
 * this function is assumed that the data has been validated
 * 
 * Only one account exists per email address.
 * 
 * @param data: DataReceiver
 *  {
 *      id: string,
 *      name: string,
 *      nameJp: ?string
 *      mail: string,
 *      password: string
 *  }
 */
function addUser(e: DataReceiver) {
    try {
        if (!isMailaddressExist(e.auth.mail)) {
            throw new Error("You may not use the email address. Please confirm it again.");
        }

        const id: ID = e.user.id;
        const name: string = e.user.name;
        const nameJp: string = e.user.nameJp;
        const mail: Mailaddress = e.user.mail;
        const password: string = e.user.password;

        const passwordHashed = convertDataToSha256Hash(password, PASSWORD_STRETCHING_TIMES, id);

        const sheet = SpreadsheetApp.openById(SHEET_ID_RUNNER).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        const rowId = header.indexOf(SHEET_RUNNER_ID_LABEL);
        if (table.some(row => row[rowId] === id)) {
            throw new Error(id + ' was already registered');
        }

        const rowMail = header.indexOf(SHEET_RUNNER_MAIL_LABEL);
        if (table.some(row => row[rowMail] === mail)) {
            throw new Error(mail + ' is already registered');
        }

        const newRow = [];
        for (const label of header) {
            if (label === SHEET_RUNNER_ID_LABEL) {
                newRow.push(id);
            }
            if (label === SHEET_RUNNER_NAME_LABEL) {
                newRow.push(name);
            }
            if (label === SHEET_RUNNER_NAME_JP_LABEL) {
                newRow.push(nameJp);
            }
            if (label === SHEET_RUNNER_MAIL_LABEL) {
                newRow.push(mail);
            }
            if (label === SHEET_RUNNER_PASSWORD_LABEL) {
                newRow.push(passwordHashed);
            }
        }

        if (newRow.length !== header.length) {
            throw new Error('new data\'s length is not equal to header\'s. Is header changed?');
        }

        sheet.appendRow(newRow);

        const resultData: UserSender = {
            id: id,
            name: name,
            nameJp: nameJp,
            mail: mail,
            password: password
        }

        const result: DataSender = {
            status: 'success',
            message: 'runner was added',
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

function addUserExample() {
    const data = `{"name":"testname","nameJp":"testnamejp","mail":"mail@example.com","password":"password"}`

    const result = addUser(JSON.parse(data));

    Logger.log(result);
}