// 記録を追加する
// 未承認記録を想定するので、IDを指定しても破棄されるので注意
function addRecord(data: AddRecordData): PostStatusResponder {
    try {
        const recordinfo: RecordInfo = data.recordInfo;
        const authinfo: AuthInfo = data.authInfo;

        const userId: string = recordinfo.userId;
        const realTime: string = recordinfo.realTime;
        const inGameTime: string = recordinfo.inGameTime;
        const category: string = recordinfo.category;
        const difficulty: string = recordinfo.difficulty;
        const version: string = recordinfo.version;
        const turbo: boolean = recordinfo.turbo;
        const comment: string = recordinfo.comment;
        const proofLinks: string[] = recordinfo.proofLinks;

        // 適正ユーザーかどうかを確かめる
        const [isProperUser, userInfo] = authUser(authinfo);
        if (!isProperUser) {
            throw new Error("Unproper Info: is ID or Password correct?");
        }

        // 当たり前だが自分のIDで他人の記録を追加出来てはならない
        // 名義上自分のIDで他人の記録を上げているものに関しては
        // 人の手で修正しなければならない
        assert(userInfo.id === userId, "Unproper Info: is the record yours?")

        // レコードのIDを生成
        const recordID: string = Utilities.getUuid();
        // 提出日はここで決定
        const submissionDate: string = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
        // 承認済みの記録はこのメソッドから追加できない
        // 承認はモデレーターが他の手段（あるいはメソッド）を通じて行う
        const verified: boolean = false;

        // シートを取得
        const sheet = SpreadsheetApp.openById(SHEET_ID_UNVERIFIED_RECORD).getSheets()[0];
        const header = sheet.getDataRange().getValues().slice(0, 1)[0];

        // 追加するデータを生成
        const newRow = [];
        for (const label of header) {
            switch (label) {
                case SHEET_RECORD_ID_LABEL:
                    newRow.push(recordID);
                    break;
                case SHEET_RECORD_USER_ID_LABEL:
                    newRow.push(userId);
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
                default:
                    // ヘッダーと不整合を起こす場合はエラー
                    throw new Error(`Unknown label: ${label}`);
            }
        }

        // ヘッダーと不整合を起こす場合はエラー
        if (newRow.length !== header.length)
            throw new Error('new data\'s length is not equal to header\'s. Is the header changed?');

        // 証拠動画を記録
        const sheetProof = SpreadsheetApp.openById(SHEET_ID_PROOF_LINK).getSheets()[0];
        const headerProof = sheetProof.getDataRange().getValues().slice(0, 1)[0];

        const newRowProof: string[][] = [];
        for (const proofLink of proofLinks) {
            const appender: string[] = [];
            for (const label of headerProof) {
                switch (label) {
                    case SHEET_PROOF_LINK_RECORD_ID_LABEL:
                        appender.push(recordID);
                        break;
                    case SHEET_PROOF_LINK_URL_LABEL:
                        appender.push(proofLink);
                        break;
                }
            }
            newRowProof.push(appender);
        }

        if (newRowProof.length !== proofLinks.length)
            throw new Error('new data\'s length is not equal to header\'s. Is the header changed?');

        sheet.appendRow(newRow);
        for (const row of newRowProof) {
            sheetProof.appendRow(row);
        }

        const result: PostStatusResponder = {
            status: STATUS_SUCCESS,
            message: 'The run has been added successfully.',
            data: {
                recordInfo: {
                    id: recordID,
                    userId: userId,
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


function addRecordExample(): void {
    const data: AddRecordData = {
        "authInfo": {
            "identifier": "hakka.ydy.sub@gmail.com",
            "password": "471psycygs24"
        },
        "recordInfo": {
            "userId": "agdf_ydy",
            "realTime": "00:00:00",
            "inGameTime": "00:00:00",
            "category": "Any",
            "difficulty": "Normal",
            "version": "1.0.0",
            "turbo": false,
            "submissionDate": "2020-01-01",
            "comment": "my_comment",
            "proofLinks": [
                "https//example.com/my_proof_link_1",
                "https//example.com/my_proof_link_2"
            ],
            "verified": true
        }
    };
    const result = addRecord(data);
    Logger.log(result);
}