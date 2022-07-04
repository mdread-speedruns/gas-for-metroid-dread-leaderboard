/**
 * verify users having tokens
 * 
 * @param e 
 * @returns 
 */
function verifyUser(e: DataReceiver) {
    try {
        const id: ID = e.user.id;
        const name: string = e.user.name;
        const nameJp: string = e.user.nameJp;
        const mail: Mailaddress = e.user.mail;
        const password: string = e.user.password;
        const verifyToken: string = e.user.verifyToken;

        const passwordHashed = convertDataToSha256Hash(password, PASSWORD_STRETCHING_TIMES, id);

        const sheet = SpreadsheetApp.openById(SHEET_ID_USER).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        // search for the user
        // if the user is not found, throw an error
        const rowId = header.indexOf(SHEET_USER_ID_LABEL);
        const recordRow = table.find(row => row[rowId] === id);
        if (recordRow === undefined) {
            throw new Error(id + ' was not found');
        }

        // if the user is found, check the password
        const rowPassword = header.indexOf(SHEET_USER_PASSWORD_LABEL);
        if (recordRow[rowPassword] !== passwordHashed) {
            throw new Error('wrong password');
        }

        // if the password is correct, check the verify token
        const rowVerifyToken = header.indexOf(SHEET_USER_VERIFY_TOKEN_LABEL);
        if (recordRow[rowVerifyToken] !== verifyToken) {
            throw new Error('wrong token');
        }

        // used verified token will be deprecated
        // set the verified token to empty
        const rowVerified = header.indexOf(SHEET_USER_VERIFIED_LABEL);
        recordRow[rowVerified] = true;
        recordRow[rowVerifyToken] = '';
        sheet.getDataRange().setValues([header, ...table]);

        // send the user data to the client
        const userData: UserSender = {
            id: id,
            name: name,
            nameJp: nameJp,
            mail: mail,
            password: password,
            registeredDate: recordRow[header.indexOf(SHEET_USER_REGISTERED_DATE_LABEL)],
            verified: true,
            verifyToken: verifyToken
        };

        const dataSender: DataSender = {
            status: 'success',
            message: 'the user was verified',
            user: userData
        };

        return dataSender;

    } catch (error) {
        const dataSender: DataSender = {
            status: 'error',
            message: error.message
        };
        return dataSender;
    }

}