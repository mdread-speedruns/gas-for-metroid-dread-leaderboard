function deleteRecord(data: DoPostData): PostStatusResponder {
    try {
        const deleteIdentifierInfo: DeleteIdentifierInfo = data.deleteIdentifierInfo;
        const authinfo: AuthInfo = data.authInfo;

        // 適正ユーザーかどうかを確かめる
        const [isProperUser, userInfo] = authUser(authinfo);
        if (!isProperUser) {
            throw new Error("unproper infomation: is ID or Password correct?");
        }

        const id: string = deleteIdentifierInfo.identifier

        // id のアサーション
        // 当たり前だが単一のレコードに対して削除するものなので
        // メアドや個人のIDでは許されない（が、個人のIDとレコードのIDは判別不可）
        // 個人単位のレコードを丸ごと消去するメソッドはとりあえず実装しない方針
        assert(id !== undefined, "Record id is not identified.")

        // シートのIDを取得
        let sheetIds: string[] = [SHEET_ID_RECORD, SHEET_ID_UNVERIFIED_RECORD];

        for (const sheetId of sheetIds) {
            // シートの取得
            const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
            const header = sheet.getDataRange().getValues().slice(0, 1)[0];
            const table = sheet.getDataRange().getValues().slice(1);

            const SHEET_RECORD_ID_LABEL_INDEX = header.indexOf(SHEET_RECORD_ID_LABEL);
            const SHEET_RECORD_RUNNER_ID_LABEL_INDEX = header.indexOf(SHEET_RECORD_USER_ID_LABEL);
            const SHEET_RECORD_REAL_TIME_LABEL_INDEX = header.indexOf(SHEET_RECORD_REAL_TIME_LABEL);
            const SHEET_RECORD_IN_GAME_TIME_LABEL_INDEX = header.indexOf(SHEET_RECORD_IN_GAME_TIME_LABEL);
            const SHEET_RECORD_CATEGORY_LABEL_INDEX = header.indexOf(SHEET_RECORD_CATEGORY_LABEL);
            const SHEET_RECORD_DIFFICULTY_LABEL_INDEX = header.indexOf(SHEET_RECORD_DIFFICULTY_LABEL);
            const SHEET_RECORD_VERSION_LABEL_INDEX = header.indexOf(SHEET_RECORD_VERSION_LABEL);
            const SHEET_RECORD_TURBO_LABEL_INDEX = header.indexOf(SHEET_RECORD_TURBO_LABEL);
            const SHEET_RECORD_SUBMISSION_DATE_LABEL_INDEX = header.indexOf(SHEET_RECORD_SUBMISSION_DATE_LABEL);
            const SHEET_RECORD_COMMENT_LABEL_INDEX = header.indexOf(SHEET_RECORD_COMMENT_LABEL);

            // 記録が保存されている行を取得
            const rowOfRecord = table.find(row => row[SHEET_RECORD_ID_LABEL_INDEX] === id);

            // 記録が見つからなかった場合
            if (rowOfRecord !== undefined) {
                continue
            }

            // 他人の記録を削除出来てはならない
            const userId = rowOfRecord[SHEET_RECORD_RUNNER_ID_LABEL_INDEX]
            assert(userInfo.id === userId, "Unproper Info: is the record yours?")

            const rowIndex = table.indexOf(rowOfRecord);
            sheet.deleteRow(rowIndex + 2);

            // delete prooflinks
            const sheetProof = SpreadsheetApp.openById(SHEET_ID_PROOF_LINK).getSheets()[0];
            const headerProof = sheetProof.getDataRange().getValues().slice(0, 1)[0];
            const tableProof = sheetProof.getDataRange().getValues().slice(1);

            const SHEET_PROOF_LINK_RECORD_ID_LABEL_INDEX = headerProof.indexOf(SHEET_PROOF_LINK_RECORD_ID_LABEL);
            const SHEET_PROOF_LINK_URL_LABEL_INDEX = headerProof.indexOf(SHEET_PROOF_LINK_URL_LABEL);

            // 記録を削除
            const rowsOfProofLinks = tableProof.filter(row => row[SHEET_PROOF_LINK_RECORD_ID_LABEL_INDEX] === id);
            rowsOfProofLinks.reverse().forEach(row => {
                const rowIndexProof = tableProof.indexOf(row);
                sheetProof.deleteRow(rowIndexProof + 2);
            });

            const result: PostStatusResponder = {
                status: 'success',
                message: 'The run has been added successfully.',
                data: {
                    recordInfo: {
                        id: rowOfRecord[SHEET_RECORD_ID_LABEL_INDEX],
                        userId: userId,
                        realTime: rowOfRecord[SHEET_RECORD_REAL_TIME_LABEL_INDEX],
                        inGameTime: rowOfRecord[SHEET_RECORD_IN_GAME_TIME_LABEL_INDEX],
                        category: rowOfRecord[SHEET_RECORD_CATEGORY_LABEL_INDEX],
                        difficulty: rowOfRecord[SHEET_RECORD_DIFFICULTY_LABEL_INDEX],
                        version: rowOfRecord[SHEET_RECORD_VERSION_LABEL_INDEX],
                        turbo: rowOfRecord[SHEET_RECORD_TURBO_LABEL_INDEX],
                        submissionDate: rowOfRecord[SHEET_RECORD_SUBMISSION_DATE_LABEL_INDEX],
                        comment: rowOfRecord[SHEET_RECORD_COMMENT_LABEL_INDEX],
                        proofLinks: rowsOfProofLinks.map(row => row[SHEET_PROOF_LINK_URL_LABEL_INDEX]),
                        verified: sheetId === SHEET_ID_RECORD
                    }
                }
            }

            return result
        }

        throw new Error("The run has been not found.")

    } catch (error) {
        Logger.log(error)
        const result: PostStatusResponder = {
            status: 'error',
            message: error.message,
        }
        return result;
    }
}


function deleteRecordExample(): void {
    const data: DoPostData = {
        recordInfo: {
            userId: "test123456",
            realTime: 1234.5,
            inGameTime: 678.9,
            category: "test",
            difficulty: "test",
            version: "test",
            turbo: true,
            submissionDate: "test",
            comment: "test",
            proofLinks: ["url1", "url2"],
            verified: true
        }
    };
    const result = addRecord(data);

    const id = result.data.recordInfo.id;
    const data2: DoPostData = {
        authInfo: {
            identifier: "test",
            password: "12345678"
        },
        deleteIdentifierInfo: {
            identifier: id
        }
    };
    const result2 = deleteRecord(data2);

    Logger.log(result);
    Logger.log(result2);
}