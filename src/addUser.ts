/**
 * add new runner's data
 * this function is assumed that the data has not been validated
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
        const id: ID = e.user.id;
        const name: string = e.user.name;
        const nameJp: string = e.user.nameJp;
        const mail: Mailaddress = e.user.mail;
        const password: string = e.user.password;

        const passwordHashed = convertDataToSha256Hash(password, PASSWORD_STRETCHING_TIMES, id);
        const verifyToken = Utilities.getUuid();
        const registeredDate = new Date().toISOString();

        const sheet = SpreadsheetApp.openById(SHEET_ID_USER).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        // for verified user, throw an error
        // for unverified user, delete it and add a new one
        // mail exists & verified -> throw an error
        // mail exists & unverified -> delete it and add a new one
        // mail does not exist -> add a new one
        const isMailExists = table.find(row => row[header.indexOf(SHEET_USER_MAIL_LABEL)] === mail);
        if (isMailExists) {
            const isVerified = isMailExists[header.indexOf(SHEET_USER_VERIFIED_LABEL)];
            if (isVerified) {
                throw new Error('mail already exists');
            }
            else {
                // delete the unverified user
                const rowIdx = table.findIndex(row => row[header.indexOf(SHEET_USER_ID_LABEL)] === id);
            }
        }


        // const rowIdx = table.findIndex(row => row[header.indexOf(SHEET_USER_ID_LABEL)] === id);
        // const isVerified = table.find(row => row[header.indexOf(SHEET_USER_VERIFIED_LABEL)] === true);
        // if (rowIdx === -1) {

        //     // add a new user
        //     const rowId = header.indexOf(SHEET_USER_ID_LABEL);
        //     if (table.some(row => row[rowId] === id)) {
        //         throw new Error(id + ' was already registered');
        //     }

        //     const rowMail = header.indexOf(SHEET_USER_MAIL_LABEL);
        //     if (table.some(row => row[rowMail] === mail)) {
        //         throw new Error(mail + ' is already registered');
        //     }


        //     const newRow = [];
        //     for (const label of header) {
        //         if (label === SHEET_USER_ID_LABEL) {
        //             newRow.push(id);
        //         }
        //         else if (label === SHEET_USER_NAME_LABEL) {
        //             newRow.push(name);
        //         }
        //         else if (label === SHEET_USER_NAME_JP_LABEL) {
        //             newRow.push(nameJp);
        //         }
        //         else if (label === SHEET_USER_MAIL_LABEL) {
        //             newRow.push(mail);
        //         }
        //         else if (label === SHEET_USER_PASSWORD_LABEL) {
        //             newRow.push(passwordHashed);
        //         }
        //         else if (label === SHEET_USER_VERIFIED_LABEL) {
        //             newRow.push(false);
        //         }
        //         else if (label === SHEET_USER_REGISTERED_DATE_LABEL) {
        //             newRow.push(registeredDate);
        //         }
        //         else if (label === SHEET_USER_VERIFY_TOKEN_LABEL) {
        //             newRow.push(verifyToken);
        //         }
        //         else {
        //             throw new Error('unknown label: ' + label);
        //         }

        //     }

        //     if (newRow.length !== header.length) {
        //         throw new Error('new data\'s length is not equal to header\'s. Is header changed?');
        //     }

        //     sheet.appendRow(newRow);


        //     // send email to verify the account
        //     const mailBody = `<p>token: ${verifyToken}</p>`;
        //     MailApp.sendEmail(mail, 'Verify your account', mailBody);

        // }

        const resultData: UserSender = {
            id: id,
            name: name,
            nameJp: nameJp,
            mail: mail,
            password: password,
            verifyToken: verifyToken,
            registeredDate: registeredDate,
            verified: false
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