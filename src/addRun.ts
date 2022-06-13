/**
 * Add new run to the database
 * 
 * @param data: RecordReceiver
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
function addRun(data: RecordReceiver) {
    try {
        const runnerId: string = data.runnerId;
        const realTime: number = data.realTime;
        const inGameTime: number = data.inGameTime;
        const category: string = data.category;
        const difficulty: string = data.difficulty;
        const version: string = data.version;
        const turbo: boolean = data.turbo;
        const submissionDate: string = data.submissionDate;
        const comment: string = data.comment;
        const proofLinks: string[] = data.proofLinks;
        const verified: boolean = data.verified;

        const uuid: string = Utilities.getUuid();

        // add new run to the database
        const sheetId = verified ? SHEET_ID_RECORD : SHEET_ID_UNVERIFIED_RECORD;

        const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];

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

        const resultData: RecordSender = {
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
            proofLinks: proofLinks,
            verified: verified
        }

        const result: DataSender = {
            status: 'success',
            message: 'The run has been added successfully.',
            data: resultData
        }

        return result;

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


function addRunExample(): void {
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
    Logger.log(result);
}