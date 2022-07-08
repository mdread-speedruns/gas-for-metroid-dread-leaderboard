function doPost(e) {
    try {
        // ポストデータを取得
        // 形式は以下の通り
        /**
         *  data = {
         *    user?: {
         *      id: string,
         *      name: string,
         *      nameJp: string,
         *      mail: string,
         *      password: string
         *    },
         *    record?: {
         *      id?: string,
         *      userID: string,
         *      realTime: number,
         *      inGameTime: number,
         *      category: string,
         *      difficulty: string,
         *      version: string,
         *      turbo: boolean,
         *      submissionDate: string,
         *      comment: string,
         *      proofLinks: string[],
         *      verified: boolean
         *    },
         *    verifyInfo?: {
         *      token: string
         *    }, ...
         *  }
         */
        const data = JSON.parse(e.postData.getDataAsString())

        // メソッド名を取得
        const methodName: string = e.parameter.method;
        const method = POST_METHODS[methodName];
        if (!method) {
            throw new Error(`Method ( method=${methodName} ) is not supported`);
        }

        const result: PostStatusResponder = method(data);
        const payload = ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);
        return payload;
    }
    catch (e) {
        const result: PostStatusResponder = {
            status: "error",
            message: "doPost Error has been occured"
        };
        const payload = ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

        return payload;
    }
}