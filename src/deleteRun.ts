/**
 * Delete run to the database
 * 
 * @param data: string
 * {
 *    "id": "string"
 * }
 */
function deleteRun(data: string) {
    try {
        const json = JSON.parse(data);
        const id = json.id;

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

            return {
                status: 'success',
                message: 'the run has been deleted'
            };

        }

        throw new Error('the run was not found');

    } catch (error) {
        Logger.log(error)
        return {
            status: "error",
            message: error.message
        }
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
    const result = addRun(data);

    const id = result.data.id;
    const result2 = deleteRun(id);

    Logger.log(result);
    Logger.log(result2);
}