/**
 * Delete run to the database
 * 
 * @param data: IdReceiver
 *  {
 *     id: string
 *  }
 */
function deleteRun(data: IdReceiver) {
    try {
        const id = data.id;

        // firstly we search verified runs
        const sheetsId: string[] = [SHEET_ID_RECORD, SHEET_ID_UNVERIFIED_RECORD];

        for (let sheetId of sheetsId) {

            const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
            const header = sheet.getDataRange().getValues().slice(0, 1)[0];
            const table = sheet.getDataRange().getValues().slice(1);

            const colIndexOfId = header.indexOf(SHEET_RECORD_ID_LABEL);
            const row = table.find(row => row[colIndexOfId] === id);

            // when not found the row index
            if (row === undefined) {
                continue;
            }

            const rowIndex = table.indexOf(row);
            sheet.deleteRow(rowIndex + 2);

            // delete prooflinks
            const sheetProof = SpreadsheetApp.openById(SHEET_ID_PROOF_LINK).getSheets()[0];
            const headerProof = sheetProof.getDataRange().getValues().slice(0, 1)[0];
            const tableProof = sheetProof.getDataRange().getValues().slice(1);

            const colIdIndexProof = headerProof.indexOf(SHEET_PROOF_LINK_RECORD_ID_LABEL);

            const rowsProof = tableProof.filter(row => row[colIdIndexProof] === id);
            rowsProof.reverse().forEach(row => {
                const rowIndexProof = tableProof.indexOf(row);
                sheetProof.deleteRow(rowIndexProof + 2);
            });

            const resultData: RecordSender = {
                id: id,
                runnerId: row[header.indexOf(SHEET_RECORD_RUNNER_ID_LABEL)],
                realTime: row[header.indexOf(SHEET_RECORD_REAL_TIME_LABEL)],
                inGameTime: row[header.indexOf(SHEET_RECORD_IN_GAME_TIME_LABEL)],
                category: row[header.indexOf(SHEET_RECORD_CATEGORY_LABEL)],
                difficulty: row[header.indexOf(SHEET_RECORD_DIFFICULTY_LABEL)],
                version: row[header.indexOf(SHEET_RECORD_VERSION_LABEL)],
                turbo: row[header.indexOf(SHEET_RECORD_TURBO_LABEL)],
                submissionDate: row[header.indexOf(SHEET_RECORD_SUBMISSION_DATE_LABEL)],
                comment: row[header.indexOf(SHEET_RECORD_COMMENT_LABEL)],
                proofLinks: rowsProof.map(row => row[headerProof.indexOf(SHEET_PROOF_LINK_URL_LABEL)]),
                verified: sheetId === SHEET_ID_RECORD
            };


            const result: DataSender = {
                status: 'success',
                message: 'The run has been added successfully.',
                data: resultData
            }

            return result
        }

        throw new Error('the run was not found');

    } catch (error) {
        Logger.log(error)
        const result: DataSender = {
            status: 'error',
            message: error.message,
            data: null
        }
        return result;
    }
}


function deleteRunTest(): void {
    const data = `{
        "runnerId":"test",
        "realTime":1234.5,
        "inGameTime":678.9,
        "category":"test",
        "difficulty":"test",
        "version":"test",
        "turbo":true,
        "submissionDate":"test",
        "comment":"test",
        "proofLinks":["url1","url2"],
        "verified":true
    }`;
    const result = addRun(JSON.parse(data));

    const id = result.data.id;
    const data2 = `{
        "id":"${id}"
    }`;
    const result2 = deleteRun(JSON.parse(data2));

    Logger.log(result);
    Logger.log(result2);
}