function deleteUser(data: DoPostData): PostStatusResponder {
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
        const id: string = deleteIdentifierInfo.identifier;
        if (MAILADDRESS_REGEX.test(id)) {
            assert(id === userInfo.mail, "Unproper Info: Is the user yours?")
        } else {
            assert(id === userInfo.id, "Unproper Info: Is the user yours?")
        }

        const password: string = authinfo.password;

        // 消去するユーザーの行を取得
        const SHEET_USER_ID_LABEL_INDEX = header.indexOf(SHEET_USER_ID_LABEL);
        const rowIndexOfId = table.findIndex(row => row[SHEET_USER_ID_LABEL_INDEX] === id);
        if (rowIndexOfId === -1) {
            throw new Error(id + ' was not found');
        }

        // 消去実行
        sheet.deleteRow(rowIndexOfId + 2);

        const SHEET_USER_NAME_LABEL_INDEX = header.indexOf(SHEET_USER_NAME_LABEL)
        const SHEET_USER_NAME_JP_LABEL_INDEX = header.indexOf(SHEET_USER_NAME_JP_LABEL)
        const SHEET_USER_MAIL_LABEL_INDEX = header.indexOf(SHEET_USER_MAIL_LABEL)

        const result: PostStatusResponder = {
            status: 'success',
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
            status: 'error',
            message: error.message,
        }
        return result;
    }
}


function deleteUserExample(): void {
    const data: DoPostData = {
        userInfo: {
            id: "test81345",
            name: "testman",
            nameJp: "おなまええええ",
            mail: "mamail@example.com",
            password: "12345678"
        }
    };
    const result = addUser(data);

    const data2: DoPostData = {
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