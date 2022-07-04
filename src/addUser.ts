function addUser(data): object {
    try {
        const id = data.id;
        const name = data.name;
        const nameJp = data.nameJp;
        const mail = data.mail;
        const password = data.password;

        const passwordHashed = convertDataToSha256Hash(password, PASSWORD_STRETCHING_TIMES, id);
        const verifyToken = Utilities.getUuid();
        const registeredDate = new Date().toISOString();

        const sheet = SpreadsheetApp.openById(SHEET_ID_USER).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        // condition flags
        const oldRow = table.find(row => row[header.indexOf(SHEET_USER_MAIL_LABEL)] === mail);

        // 同一のメアド所持者がいるか確認
        // メアドが登録されていない場合は新規登録であり、ID重複は不可
        // IDはそのメアド所持者である限り更新可能
        if (oldRow) {
            const oldId = oldRow[header.indexOf(SHEET_USER_ID_LABEL)];
            if (oldId !== id) {
                throw new Error('mail already exists');
            }
        }


        // 要求するIDがメアド所持者以外で使用済みならエラー


        const newRow = [];
        for (const label of header) {
            if (label === SHEET_USER_ID_LABEL) {
                newRow.push(id);
            }
            else if (label === SHEET_USER_NAME_LABEL) {
                newRow.push(name);
            }
            else if (label === SHEET_USER_NAME_JP_LABEL) {
                newRow.push(nameJp);
            }
            else if (label === SHEET_USER_MAIL_LABEL) {
                newRow.push(mail);
            }
            else if (label === SHEET_USER_PASSWORD_LABEL) {
                newRow.push(passwordHashed);
            }
            else if (label === SHEET_USER_VERIFIED_LABEL) {
                newRow.push(false);
            }
            else if (label === SHEET_USER_REGISTERED_DATE_LABEL) {
                newRow.push(registeredDate);
            }
            else if (label === SHEET_USER_VERIFY_TOKEN_LABEL) {
                newRow.push(verifyToken);
            }
            else {
                throw new Error('unknown label: ' + label);
            }

        }

        if (newRow.length !== header.length) {
            throw new Error('new data\'s length is not equal to header\'s. Is header changed?');
        }

        sheet.appendRow(newRow);

        // send email to verify the account
        const mailBody = `<p>token: ${verifyToken}</p>`;
        MailApp.sendEmail(mail, 'Verify your account', mailBody);

    } catch (error) {
        console.log(error)
        const result: statusResponder = {
            status: 'error',
            message: error.message,
        }
        return result;
    }
    return {}
}