function doPost(e) {
    try {
        // get postdata from the request
        const data = JSON.parse(e.postData.getDataAsString())

        // get method name from the parameter
        const methodName: string = e.parameter.method;
        const method = POST_METHODS[methodName];
        if (!method) {
            throw new Error(`Method ( method=${methodName} ) is not supported`);
        }

        const result: statusResponder = method(data);
        const payload = ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);
        return payload;
    }
    catch (e) {
        const result: statusResponder = {
            status: "error",
            message: "doPost Error has been occured"
        };
        const payload = ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

        return payload;
    }
}