/**
 * add new runner's data
 * this function is assumed that the data has been validated
 * 
 * @param data: string
 *  {
 *      name: string,
 *      nameJp: ?string
 *      mail: string,
 *      password: string
 *  }
 */
function addNewRunner(data: string) {
    try {
        interface Runner {
            name: string,
            nameJp: string | null,
            mail: string,
            password: string
        }

        const jsonData: Runner = JSON.parse(data);
        const name: string = jsonData.name;
        const nameJp: string = jsonData.nameJp;
        const mail: string = jsonData.mail;
        const password: string = jsonData.password;

        const uuid: string = Utilities.getUuid();
        const passwordHashed = convertDataToSha256Hash(password, PASSWORD_STRETCHING_TIMES, name);

        const sheet = SpreadsheetApp.openById(SHEET_ID_RUNNER).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        const mailrow = header.indexOf('mail');
        if (table.some(row => row[mailrow] === mail)) {
            throw new Error(mail + ' is already registered');
        }

        const newRow = [];
        for (const label of header) {
            if (label === SHEET_RUNNER_ID_LABEL) {
                newRow.push(uuid);
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


    } catch (error) {
        Logger.log(error)
        return {
            status: "error",
            message: error.message
        }
    }
}

function addNewRunnerTest() {
    const data = `{"name":"testname","nameJp":"testnamejp","mail":"mail@example.com","password":"password"}`

    const result = addNewRunner(data);

    Logger.log(result);
}