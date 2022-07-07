// 条件に一致するレコードをすべて取得する
// 
function getRecords(data: DoGetParams): GetStatusResponder {
    try {
        // 検索対象を絞る
        // シートのIDを絞る
        const sheetIds: string[] = [];
        if (data.verified === true) {
            sheetIds.push(SHEET_ID_RECORD);
        } else if (data.verified === false) {
            sheetIds.push(SHEET_ID_UNVERIFIED_RECORD);
        } else {
            sheetIds.push(SHEET_ID_RECORD);
            sheetIds.push(SHEET_ID_UNVERIFIED_RECORD);
        }

        // 証拠動画の情報
        const sheetProof = SpreadsheetApp.openById(SHEET_ID_PROOF_LINK).getSheets()[0];
        const headerProof = sheetProof.getDataRange().getValues().slice(0, 1)[0];
        const tableProof = sheetProof.getDataRange().getValues().slice(1);

        // レコードを追加していく
        const recordsInfo: RecordInfo[] = [];
        for (const sheetId of sheetIds) {
            // シートを取得
            const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
            const header = sheet.getDataRange().getValues().slice(0, 1)[0];
            const table = sheet.getDataRange().getValues().slice(1);

            // ヘッダーからインデックスを取得
            const SHEET_RECORD_ID_LABEL_INDEX = header.indexOf(SHEET_RECORD_ID_LABEL);
            const SHEET_RECORD_USER_ID_LABEL_INDEX = header.indexOf(SHEET_RECORD_USER_ID_LABEL);
            const SHEET_RECORD_REAL_TIME_LABEL_INDEX = header.indexOf(SHEET_RECORD_REAL_TIME_LABEL);
            const SHEET_RECORD_IN_GAME_TIME_LABEL_INDEX = header.indexOf(SHEET_RECORD_IN_GAME_TIME_LABEL);
            const SHEET_RECORD_CATEGORY_LABEL_INDEX = header.indexOf(SHEET_RECORD_CATEGORY_LABEL);
            const SHEET_RECORD_DIFFICULTY_LABEL_INDEX = header.indexOf(SHEET_RECORD_DIFFICULTY_LABEL);
            const SHEET_RECORD_VERSION_LABEL_INDEX = header.indexOf(SHEET_RECORD_VERSION_LABEL);
            const SHEET_RECORD_TURBO_LABEL_INDEX = header.indexOf(SHEET_RECORD_TURBO_LABEL);
            const SHEET_RECORD_SUBMISSION_DATE_LABEL_INDEX = header.indexOf(SHEET_RECORD_SUBMISSION_DATE_LABEL);
            const SHEET_RECORD_COMMENT_LABEL_INDEX = header.indexOf(SHEET_RECORD_COMMENT_LABEL);

            const SHEET_PROOF_LINK_RECORD_ID_LABEL_INDEX = headerProof.indexOf(SHEET_PROOF_LINK_RECORD_ID_LABEL);
            const SHEET_PROOF_LINK_URL_LABEL_INDEX = headerProof.indexOf(SHEET_PROOF_LINK_URL_LABEL);

            // 各レコードについて処理
            for (const record of table) {
                const recordId = record[SHEET_RECORD_ID_LABEL_INDEX];

                // ビデオのURLを取得
                const rowsOfProofLinks = tableProof.filter(row => row[SHEET_PROOF_LINK_RECORD_ID_LABEL_INDEX] === recordId);
                const links: string[] = rowsOfProofLinks.map(row => row[SHEET_PROOF_LINK_URL_LABEL_INDEX])

                recordsInfo.push({
                    id: recordId,
                    userId: record[SHEET_RECORD_USER_ID_LABEL_INDEX],
                    realTime: record[SHEET_RECORD_REAL_TIME_LABEL_INDEX],
                    inGameTime: record[SHEET_RECORD_IN_GAME_TIME_LABEL_INDEX],
                    category: record[SHEET_RECORD_CATEGORY_LABEL_INDEX],
                    difficulty: record[SHEET_RECORD_DIFFICULTY_LABEL_INDEX],
                    version: record[SHEET_RECORD_VERSION_LABEL_INDEX],
                    turbo: record[SHEET_RECORD_TURBO_LABEL_INDEX],
                    submissionDate: record[SHEET_RECORD_SUBMISSION_DATE_LABEL_INDEX],
                    comment: record[SHEET_RECORD_COMMENT_LABEL_INDEX],
                    proofLinks: links,
                    verified: sheetId === SHEET_ID_RECORD
                })
            }

            const result: GetStatusResponder = {
                status: 'success',
                message: 'Runs are found successfully.',
                data: {
                    recordInfo: recordsInfo
                }
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