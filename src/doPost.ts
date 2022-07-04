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
 * @returns payload
 */
function doPost(e) {
    try {
        const GasMethods: { [key: string]: (data: DataReceiver) => DataSender } = {
            'addUser': addUser,
            'deleteUser': deleteUser,
            'addRecord': addRecord,
            'deleteRecord': deleteRecord,
        }

        const methodName: string = e.parameter.method;
        const data: DataReceiver = JSON.parse(e.parameter.data);

        const method: Function = GasMethods[methodName];

        if (!method) {
            throw new Error(`Method ( method=${methodName} ) is not supported`);
        }

        const result: DataSender = method(data);

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