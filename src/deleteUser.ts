function deleteUser(data: DeleteUserData): PostStatusResponder {
    try {
        const deleteIdentifierInfo: DeleteIdentifierInfo = data.deleteIdentifierInfo;
        const authinfo: AuthInfo = data.authInfo;

        const sheet = SpreadsheetApp.openById(SHEET_ID_USER).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        // 適正ユーザーかどうかを確かめる
        const [isProperUser, userInfo] = authUser(authinfo, header, table);
        if (!isProperUser) {
            throw new Error("unproper infomation: is ID or Password correct?");
        }

        // メアドか個人のID
        // どちらかを判定して、認証情報と異なるならばエラー
        const identfier: string = deleteIdentifierInfo.identifier;
        if (MAILADDRESS_REGEX.test(identfier))
            assert(identfier === String(userInfo.mail), "Unproper Info: Is the user yours?")
        else 
            assert(identfier === String(userInfo.id), "Unproper Info: Is the user yours?")

        const id: string = String(userInfo.id)
        const password: string = authinfo.password;

        // 消去するユーザーの行を取得
        const SHEET_USER_ID_LABEL_INDEX = header.indexOf(SHEET_USER_ID_LABEL);
        const rowIndexOfId = table.findIndex(row => String(row[SHEET_USER_ID_LABEL_INDEX]) === id);
        if (rowIndexOfId === -1)
            throw new Error(id + ' was not found');

        // 消去実行
        sheet.deleteRow(rowIndexOfId + 2);

        const _result: [boolean, number] = deleteRecordsBelongsToUser(userInfo.id);
        console.log(_result);

        const SHEET_USER_NAME_LABEL_INDEX = header.indexOf(SHEET_USER_NAME_LABEL)
        const SHEET_USER_NAME_JP_LABEL_INDEX = header.indexOf(SHEET_USER_NAME_JP_LABEL)
        const SHEET_USER_MAIL_LABEL_INDEX = header.indexOf(SHEET_USER_MAIL_LABEL)

        const result: PostStatusResponder = {
            status: STATUS_SUCCESS,
            message: 'The run has been deleted successfully.',
            data: {
                userInfo: {
                    id: table[rowIndexOfId][SHEET_USER_ID_LABEL_INDEX],
                    name: table[rowIndexOfId][SHEET_USER_NAME_LABEL_INDEX],
                    nameJp: table[rowIndexOfId][SHEET_USER_NAME_JP_LABEL_INDEX],
                    mail: table[rowIndexOfId][SHEET_USER_MAIL_LABEL_INDEX],
                    password: password,
                }
            }
        }

        return result;

    } catch (error) {
        Logger.log(error)
        const result: PostStatusResponder = {
            status: STATUS_ERROR,
            message: error.message,
        }
        return result;
    }
}

function deleteRecordsBelongsToUser(userId: string): [boolean, number] {
    try {
        // シートのIDを取得
        let sheetIds: string[] = [SHEET_ID_RECORD, SHEET_ID_UNVERIFIED_RECORD];

        for (const sheetId of sheetIds) {
            // シートの取得
            const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
            const header = sheet.getDataRange().getValues().slice(0, 1)[0];
            const table = sheet.getDataRange().getValues().slice(1);

            const SHEET_RECORD_RUNNER_ID_LABEL_INDEX = header.indexOf(SHEET_RECORD_USER_ID_LABEL);

            // 記録が保存されていない複数行を取得
            const rowsOfRecord = table.filter(row => row[SHEET_RECORD_RUNNER_ID_LABEL_INDEX] !== userId);

            // 記録が見つからなかった場合
            if (rowsOfRecord.length === table.length) {
                continue;
            }

            // 空白行埋め
            for (let i = rowsOfRecord.length; i < table.length; i++) {
                rowsOfRecord.push(Array(header.length))

            }

            // 続いて記録動画の削除
            // …でも参照されないからアーカイブ的に残してあってもいいんじゃない？

            return [true, table.length - rowsOfRecord.length];
        }

        throw new Error("The run has been not found.")

    } catch (error) {
        Logger.log(error)
        return [false, 0];
    }
}


function deleteUserExample(): void {
    const data: AddUserData = {
        userInfo: {
            id: "test81345",
            name: "testman",
            nameJp: "おなまええええ",
            mail: "mamail@example.com",
            password: "12345678"
        }
    };
    const result = addUser(data);

    const data2: DeleteUserData = {
        authInfo: {
            identifier: "test81345",
            password: "12345678"
        },
        deleteIdentifierInfo: {
            identifier: "test81345"
        }
    };
    const result2 = deleteRecord(data2);

    Logger.log(result);
    Logger.log(result2);
}

