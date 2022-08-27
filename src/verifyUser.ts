function verifyUser(data: VerifyUserData): PostStatusResponder {
    try {
        const verifyInfo: VerifyInfo = data.verifyInfo;
        const authInfo: AuthInfo = data.authInfo;

        const sheet = SpreadsheetApp.openById(SHEET_ID_USER).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        // 適正ユーザーかどうかを確かめる
        const [isProperUser, userInfo] = authUser(authInfo, header, table);
        if (!isProperUser && userInfo === null)
            throw new Error(`Unproper infomation: Is ID or Password correct? (userInfo: ${userInfo})`);

        if (isProperUser) 
            throw new Error("Already verified");

        const token: string = verifyInfo.token;
        const id: string = userInfo.id;
        // const password: string = userInfo.password;

        // 適正ユーザーなので承認
        // ヘッダー用インデックス
        const SHEET_USER_VERIFIED_LABEL_INDEX = header.indexOf(SHEET_USER_VERIFIED_LABEL)
        const SHEET_USER_VERIFY_TOKEN_LABEL_INDEX = header.indexOf(SHEET_USER_VERIFY_TOKEN_LABEL)
        const SHEET_USER_ID_LABEL_INDEX = header.indexOf(SHEET_USER_ID_LABEL)

        // 過去に登録した情報を探す
        const indexOfInfoRow = table.findIndex(row => row[SHEET_USER_ID_LABEL_INDEX] === id);

        // 登録情報が無ければ失効しているとみなし、再登録を促す
        if (indexOfInfoRow === -1)
            throw new Error("Your registered data was not found. Please re-register your infomation")

        // 承認用トークンが一致しているかを判定する
        const expectedToken = String(table[indexOfInfoRow][SHEET_USER_VERIFY_TOKEN_LABEL_INDEX])
        if (token !== expectedToken) 
            throw new Error(`Incorrect token (got: ${token}, expected: ${expectedToken})`)
        
        table[indexOfInfoRow][SHEET_USER_VERIFIED_LABEL_INDEX] = true
        table[indexOfInfoRow][SHEET_USER_VERIFY_TOKEN_LABEL_INDEX] = ""

        sheet.getDataRange().setValues([header].concat(table));

        const result: PostStatusResponder = {
            status: STATUS_SUCCESS,
            message: "successfully verified",
            data: {
                userInfo: userInfo
            }
        }

        return result;

    } catch (error) {
        console.log(error)
        const result: PostStatusResponder = {
            status: STATUS_ERROR,
            message: error.message,
        }
        
        return result;
    }
}
function verifyUserExample() {
    const token = ""
    const data: VerifyUserData = {
        verifyInfo: {
            token: token
        },
        authInfo: {
            identifier: "test",
            password: "12345678"
        }
    }
    console.log(verifyUser(data));
}