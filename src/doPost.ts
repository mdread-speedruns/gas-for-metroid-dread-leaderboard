/**
 * requests.post(
 *   'https://script.google.com/macros/s/abc.../exec?method=addRecord',
 *   data = {
 *     authInfo: {
 *       identifier: 'my_id',
 *       password: '12345678'
 *     },
 *     deleteIdentifierInfo: {
 *       identfier: 'my_record_id'
 *     },
 *     ...
 *   }
 * )
 */
function doPost(event) {
    let rawData = null;

    try {
        rawData = event.postData.contents;
        // ポストデータを取得
        const data = JSON.parse(rawData)

        // メソッド名を取得
        const methodName: string = event.parameter.method;
        const method = POST_METHODS[methodName];

        if (!method) 
            throw new Error(`Method ( method=${methodName} ) is not supported`);

        const result: PostStatusResponder = method(data);
        const payload = ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

        return payload;
    }
    catch (errorEvent) {
        const message = (`${errorEvent.message}: ${rawData}`) || "Unknown doPost error has been occured";
        const result: PostStatusResponder = {
            status: STATUS_ERROR,
            message: message
        };

        const payload = ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

        return payload;
    }
}