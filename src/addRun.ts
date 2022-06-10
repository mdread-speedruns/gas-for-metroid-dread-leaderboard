/**
 * Add new run to the database
 * 
 * @param data string
 * {
 *      runnerId: string,
 *      realTime: number,
 *      inGameTime: nuber,
 *      category: string,
 *      difficulty: string,
 *      version: string
 *      turbo: boolean
 *      submissionDate: string
 *      comment: string 
 *      proofLinks: string[]    
 *      verified: boolean
 * }
 */
function addRun(data: string) {
    try {
        const jsonData: Run = JSON.parse(data);
        const runnerId: string = jsonData.runnerId;
        const realTime: number = jsonData.realTime;
        const inGameTime: number = jsonData.inGameTime;
        const category: string = jsonData.category;
        const difficulty: string = jsonData.difficulty;
        const version: string = jsonData.version;
        const turbo: boolean = jsonData.turbo;
        const submissionDate: string = jsonData.submissionDate;
        const comment: string = jsonData.comment;
        const proofLinks: string[] = jsonData.proofLinks;
        const verified: boolean = jsonData.verified;

        const uuid: string = Utilities.getUuid();

        // add new run to the database
        const sheetId = verified ? SHEET_ID_RECORD : SHEET_ID_UNVERIFIED_RECORD;

        const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];
        const table = sheet.getDataRange().getValues().slice(1);

        const newRow = [];
        for (const label of header) {
            switch (label) {
                case SHEET_RECORD_ID_LABEL:
                    newRow.push(uuid);
                    break;
                case SHEET_RECORD_RUNNER_ID_LABEL:
                    newRow.push(runnerId);
                    break;
                case SHEET_RECORD_REAL_TIME_LABEL:
                    newRow.push(realTime);
                    break;
                case SHEET_RECORD_IN_GAME_TIME_LABEL:
                    newRow.push(inGameTime);
                    break;
                case SHEET_RECORD_CATEGORY_LABEL:
                    newRow.push(category);
                    break;
                case SHEET_RECORD_DIFFICULTY_LABEL:
                    newRow.push(difficulty);
                    break;
                case SHEET_RECORD_VERSION_LABEL:
                    newRow.push(version);
                    break;
                case SHEET_RECORD_TURBO_LABEL:
                    newRow.push(turbo);
                    break;
                case SHEET_RECORD_SUBMISSION_DATE_LABEL:
                    newRow.push(submissionDate);
                    break;
                case SHEET_RECORD_COMMENT_LABEL:
                    newRow.push(comment);
                    break;
            }
        }

        if (newRow.length !== header.length) {
            throw new Error('new data\'s length is not equal to header\'s. Is the header changed?');
        }

        // add proof links to the database
        const sheetProof = SpreadsheetApp.openById(SHEET_ID_PROOF_LINK).getSheets()[0];
        const headerProof = sheetProof.getDataRange().getValues().slice(0, 1)[0];
        const tableProof = sheetProof.getDataRange().getValues().slice(1);

        const newRowProof: string[][] = [];
        for (const proofLink of proofLinks) {
            const appender: string[] = [];
            for (const label of headerProof) {
                switch (label) {
                    case SHEET_PROOF_LINK_RECORD_ID_LABEL:
                        appender.push(uuid);
                        break;
                    case SHEET_PROOF_LINK_URL_LABEL:
                        appender.push(proofLink);
                        break;
                }
            }
            newRowProof.push(appender);
        }

        if (newRowProof.length !== proofLinks.length) {
            throw new Error('new data\'s length is not equal to header\'s. Is the header changed?');
        }

        sheet.appendRow(newRow);
        for (const row of newRowProof) {
            sheetProof.appendRow(row);
        }

        return {
            status: 'success',
            message: 'the run has been registered',
            data: {
                id: uuid,
                runnerId: runnerId,
                realTime: realTime,
                inGameTime: inGameTime,
                category: category,
                difficulty: difficulty,
                version: version,
                turbo: turbo,
                submissionDate: submissionDate,
                comment: comment,
                verified: verified
            }
        };

    } catch (error) {
        Logger.log(error)
        return {
            status: "error",
            message: error.message
        }
    }
}


function addRunTest(): void {
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
    Logger.log(result);
}