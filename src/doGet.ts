/**
 * doGet function
 * 
 * @param e: Event
 * e.parameter.data: string
 *  {
 *      method: string,
 *      data?: { ... } // depends on the method
 *  }
 * 
 * @returns payload: string(?)
 */
function doGet(e) {
    try {
        const GasMethods: { [key: string]: (data: object) => { status: string, message: string } } = {
            'addRunner': addRunner,
            'deleteRunner': deleteRunner,
            'addRun': addRun,
            'deleteRun': deleteRun,
        }

        const methodName = e.parameter.method;
        const data = JSON.parse(e.parameter.data);

        const method = GasMethods[methodName];

        if (!method) {
            throw new Error(`Method ( method=${methodName} ) is not supported`);
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