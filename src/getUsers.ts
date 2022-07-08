// 条件に一致するユーザーをすべて取得する
function getUsers(data: DoGetParams): GetStatusResponder {
    try {
        // レコードを追加していく
        const usersInfo: SecureUserInfo[] = [];
        // シートを取得
        const sheet = SpreadsheetApp.openById(SHEET_ID_USER).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        // ヘッダーからインデックスを取得
        const SHEET_USER_ID_LABEL_INDEX = header.indexOf(SHEET_USER_ID_LABEL);
        const SHEET_USER_NAME_LABEL_INDEX = header.indexOf(SHEET_USER_NAME_LABEL);
        const SHEET_USER_NAME_JP_LABEL_INDEX = header.indexOf(SHEET_USER_NAME_JP_LABEL);

        // 各レコードについて処理
        for (const user of table) {
            usersInfo.push({
                id: user[SHEET_USER_ID_LABEL_INDEX],
                name: user[SHEET_USER_NAME_LABEL_INDEX],
                nameJp: user[SHEET_USER_NAME_JP_LABEL_INDEX],
            })
        }

        const result: GetStatusResponder = {
            status: 'success',
            message: 'Runs are found successfully.',
            data: {
                userInfo: usersInfo
            }
        }

    } catch (error) {
        Logger.log(error)
        const result: GetStatusResponder = {
            status: 'error',
            message: error.message,
        }
        return result;
    }

}