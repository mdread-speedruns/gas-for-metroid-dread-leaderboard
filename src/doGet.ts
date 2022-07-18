/**
 *  requests.get(
 *    'https://script.google.com/macros/s/abc.../exec?method=getRecords'
 *  )
 */
function doGet(e) {
    try {
        // メソッド名を取得
        const methodName: string = e.parameter.method;
        const method = GET_METHODS[methodName];
        if (!method) {
            throw new Error(`Method ( method=${methodName} ) is not supported`);
        }

        const result: GetStatusResponder = method(e.parameter);
        const payload = ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);
        return payload;
    }
    catch (e) {
        const result: GetStatusResponder = {
            status: STATUS_ERROR,
            message: "doGet Error has been occured"
        };
        const payload = ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

        return payload;
    }
}