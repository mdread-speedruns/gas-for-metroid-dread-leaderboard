function doGet(e) {
    try {
        const GAS_METHODS: { [key: string]: (data: string) => { status: string, message: string } } = {
            'addRunner': addRunner,
            'deleteRunner': deleteRunner,
            'addRun': addRun,
            'deleteRun': deleteRun,
        }

        const methodName = e.parameter.method;
        const data = e.parameter.data;

        const method = GAS_METHODS[methodName];

        if (!method) {
            throw new Error(`Method ${methodName} is not supported`);
        }

        const result = method(data);

        const payload = ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

        return payload;

    } catch (e) {
        Logger.log(e);
        return ContentService
            .createTextOutput(JSON.stringify({
                status: "error",
                message: e.message
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}