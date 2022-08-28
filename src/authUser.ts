// ユーザーを認証・認可するメソッド
function authUser(authinfo: AuthInfo, header?: any[], contents?: any[][]): [boolean, UserInfo] {
    const identifier: string = authinfo.identifier;
    const password: string = authinfo.password;

    if (header === undefined) {
        const table = SpreadsheetApp.openById(SHEET_ID_USER).getSheets()[0].getDataRange().getValues();

        header = table.slice(0, 1)[0];
        contents = table.slice(1);
    }

    const SHEET_USER_ID_LABEL_INDEX = header.indexOf(SHEET_USER_ID_LABEL);
    const SHEET_USER_PASSWORD_LABEL_INDEX = header.indexOf(SHEET_USER_PASSWORD_LABEL);
    const SHEET_USER_MAIL_LABEL_INDEX = header.indexOf(SHEET_USER_MAIL_LABEL);

    let infoRow = null;

    // 識別子がメールアドレスかどうかで行を取得
    if (MAILADDRESS_REGEX.test(identifier))
        infoRow = contents.find(row => String(row[SHEET_USER_MAIL_LABEL_INDEX]) === identifier);
    else
        infoRow = contents.find(row => String(row[SHEET_USER_ID_LABEL_INDEX]) === identifier);

    if (infoRow === undefined)
        return [false, null];

    const id = String(infoRow[SHEET_USER_ID_LABEL_INDEX]);
    const passwordHashed = convertDataToSha256Hash(password, PASSWORD_STRETCHING_TIMES, id);
    if (String(infoRow[SHEET_USER_PASSWORD_LABEL_INDEX]) !== passwordHashed)
        return [false, null]

    const SHEET_USER_NAME_LABEL_INDEX = header.indexOf(SHEET_USER_NAME_LABEL);
    const SHEET_USER_NAME_JP_LABEL_INDEX = header.indexOf(SHEET_USER_NAME_JP_LABEL);
    const SHEET_USER_VERIFIED_LABEL_INDEX = header.indexOf(SHEET_USER_VERIFIED_LABEL);

    // 未承認ユーザーは制限付きで認可
    const verified = infoRow[SHEET_USER_VERIFIED_LABEL_INDEX]

    const info: UserInfo = {
        id: infoRow[SHEET_USER_ID_LABEL_INDEX],
        name: infoRow[SHEET_USER_NAME_LABEL_INDEX],
        nameJp: infoRow[SHEET_USER_NAME_JP_LABEL_INDEX],
        mail: infoRow[SHEET_USER_MAIL_LABEL_INDEX],
        password: password
    }

    return [verified, info]
}


function authUserTest() {
    const json = {
        "identifier": "n24r24r1and.ydy@gmail.com",
        "password": "471psycygs24"
    }

    console.log(authUser(json));
}