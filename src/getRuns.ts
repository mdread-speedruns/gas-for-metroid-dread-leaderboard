/**
 * get runs by a given data
 * 
 * @param data: string
 * currently not used
 * { }
 * 
 * @returns: object
 * {
 *    status: "success",
 *    data: [
 *       {
 *          id: "",
 *          runnerId: "",
 *          realTime: "",
 *          inGameTime: "",
 *          category: "",
 *          difficulty: "",
 *          version: "",
 *          turbo: "",
 *          submissionDate: "",
 *          comment: "",
 *          proofLinks: [],
 *          verified: ""
 *      }
 *   ]
 * }
 */
function getRuns(data?: string) {
    try {
        // const jsonData: RecordSender = JSON.parse(data);

        const sheetIds = [SHEET_ID_RECORD, SHEET_ID_UNVERIFIED_RECORD];

        const sheetProoflink = SpreadsheetApp.openById(SHEET_ID_PROOF_LINK).getSheets()[0];
        const headerProoflink = sheetProoflink.getDataRange().getValues().slice(0, 1)[0];
        const tableProoflink = sheetProoflink.getDataRange().getValues().slice(1);

        // get idxs of prooflink sheet
        const colIdIdxProoflink = headerProoflink.indexOf(SHEET_PROOF_LINK_RECORD_ID_LABEL);
        const colUrlIdxProoflink = headerProoflink.indexOf(SHEET_PROOF_LINK_URL_LABEL);

        const newData: Array<RecordSender> = [];

        for (const sheetId of sheetIds) {
            const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
            const header = sheet.getDataRange().getValues().slice(0, 1)[0];
            const table = sheet.getDataRange().getValues().slice(1);

            // get idxs of labels
            const colIdIdx = header.indexOf(SHEET_RECORD_ID_LABEL);
            const colRunnerIdIdx = header.indexOf(SHEET_RECORD_RUNNER_ID_LABEL);
            const colRealTimeIdx = header.indexOf(SHEET_RECORD_REAL_TIME_LABEL);
            const colInGameTimeIdx = header.indexOf(SHEET_RECORD_IN_GAME_TIME_LABEL);
            const colCategoryIdx = header.indexOf(SHEET_RECORD_CATEGORY_LABEL);
            const colDifficultyIdx = header.indexOf(SHEET_RECORD_DIFFICULTY_LABEL);
            const colVersionIdx = header.indexOf(SHEET_RECORD_VERSION_LABEL);
            const colTurboIdx = header.indexOf(SHEET_RECORD_TURBO_LABEL);
            const colSubmissionDateIdx = header.indexOf(SHEET_RECORD_SUBMISSION_DATE_LABEL);
            const colCommentIdx = header.indexOf(SHEET_RECORD_COMMENT_LABEL);

            for (const row of table) {
                const newRow: RecordSender = {
                    id: row[colIdIdx],
                    userId: row[colRunnerIdIdx],
                    realTime: row[colRealTimeIdx],
                    inGameTime: row[colInGameTimeIdx],
                    category: row[colCategoryIdx],
                    difficulty: row[colDifficultyIdx],
                    version: row[colVersionIdx],
                    turbo: row[colTurboIdx],
                    submissionDate: row[colSubmissionDateIdx],
                    comment: row[colCommentIdx],
                    proofLinks: [],
                    verified: sheetId === SHEET_ID_RECORD
                };

                newRow['proofLinks'] = [];
                for (const rowProoflink of tableProoflink) {
                    if (rowProoflink[colIdIdxProoflink] === newRow['id']) {
                        newRow['proofLinks'].push(rowProoflink[colUrlIdxProoflink]);
                    }
                }

                newData.push(newRow);
            }
        }

        return {
            status: "success",
            data: newData
        };

    } catch (error) {
        return {
            status: "error",
            message: error.message
        };
    }
}


function getRunsTest() {
    const result = getRuns();
    Logger.log(result);
}