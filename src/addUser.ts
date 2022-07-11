// 未承認ユーザーを追加する
function addUser(data: DoPostData): PostStatusResponder {
    try {
        const userinfo: UserInfo = data.userInfo;

        const id: string = userinfo.id;
        const name: string = userinfo.name;
        const nameJp: string = userinfo.nameJp;
        const mail: string = userinfo.mail;
        const password: string = userinfo.password;

        // パスワードが要件を満たさない場合、エラーを返す

        const passwordHashed: string = convertDataToSha256Hash(password, PASSWORD_STRETCHING_TIMES, id);
        const verifyToken: string = Utilities.getUuid();
        const registeredDate: string = new Date().toISOString();

        const sheet = SpreadsheetApp.openById(SHEET_ID_USER).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        const SHEET_USER_VERIFIED_LABEL_INDEX = header.indexOf(SHEET_USER_VERIFIED_LABEL)
        const SHEET_USER_ID_LABEL_INDEX = header.indexOf(SHEET_USER_ID_LABEL)
        const SHEET_USER_MAIL_LABEL_INDEX = header.indexOf(SHEET_USER_MAIL_LABEL)

        // condition flags
        const indexOfOldInfoRow = table.findIndex(row => row[SHEET_USER_MAIL_LABEL_INDEX] === mail);

        // 同一のメアド所持者がいるか確認
        // メアドが登録されていない場合は新規登録であり、ID重複は不可
        // IDはそのメアド所持者である限り更新可能
        if (indexOfOldInfoRow !== -1) {
            // 既にそのメアドで何らかの情報が登録済みである

            // 登録情報を抜き出す
            const oldInfoRow = table[indexOfOldInfoRow];

            // 要求するIDが他のアカウントで使用済みならエラー
            // 誰かにそのIDが使われているかを取得
            const indexOfTheIDUsedBySomeone = table.findIndex(row => row[SHEET_USER_ID_LABEL_INDEX] === id);
            const isTheIDUsedBySomeone = indexOfTheIDUsedBySomeone !== -1;

            // 重複するIDを自分が使っているかを取得する
            const isTheIDUsedByMe = indexOfTheIDUsedBySomeone === indexOfOldInfoRow;

            // そのIDを自分以外が使用しているならば、登録させない
            if (!isTheIDUsedByMe && isTheIDUsedBySomeone) {
                throw new Error("the ID already exists");
            }
        }
        else {
            // 新規登録
            // 単に他のIDで登録済みならアウト
            const indexOfTheIDUsedBySomeone = table.findIndex(row => row[SHEET_USER_ID_LABEL_INDEX] === id);
            if (indexOfTheIDUsedBySomeone !== -1) {
                throw new Error("the ID already exists");
            }
        }

        // 登録チェックが終わったので、登録処理をしていく
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
                // ヘッダー行に変更有りとみなされた場合
                throw new Error('unknown label: ' + label);
            }
        }

        // ヘッダー行に変更有りとみなされた場合
        if (newRow.length !== header.length) {
            throw new Error('new data\'s length is not equal to header\'s. Is header changed?');
        }

        // 情報の追加or更新
        if (indexOfOldInfoRow !== -1) {
            for (let index = 0; index < table[indexOfOldInfoRow].length; index++) {
                table[indexOfOldInfoRow][index] = newRow[index];
            }
            sheet.getDataRange().setValues([header].concat(table))
        } else {
            sheet.appendRow(newRow);
        }

        // 認証情報を送信するためのメールを作成
        const mailBody = `
        <form action="${URL_BASE}?method=verifyUser" method="post">
        <input type="hidden" name="token" value="${verifyToken}">
        <input type="submit" value="Verify">
        </form>
        `;
        MailApp.sendEmail(mail, '[Metroid Dread Leaderboard Team] Verify your account', mailBody);

        const result: PostStatusResponder = {
            status: 'success',
            message: "User data has been successfully added.",
            data: {
                userInfo: {
                    id: id,
                    name: name,
                    nameJp: nameJp,
                    mail: mail,
                    password: password
                }
            }

        }
        return result;

    } catch (error) {
        console.log(error)
        const result: PostStatusResponder = {
            status: 'error',
            message: error.message,
        }
        return result;
    }
}


function addUserExample(): void {
    const data: DoPostData = {
        userInfo: {
            id: "test123456",
            name: "test",
            nameJp: "おなまえ",
            // you may change this field of your mailaddress
            // to check if the mail verifier system works.
            mail: "mail@example.com",
            password: "12345678"
        }
    };
    const result = addUser(data);
    console.log(result);
}