// function doPost(e) {
//     try {
//         // ポストデータを取得
//         const data = JSON.parse(e.postData.getDataAsString())

//         // メソッド名を取得
//         const methodName: string = e.parameter.method;
//         const method = POST_METHODS[methodName];
//         if (!method) {
//             throw new Error(`Method ( method=${methodName} ) is not supported`);
//         }

//         const result: PostStatusResponder = method(data);
//         const payload = ContentService
//             .createTextOutput(JSON.stringify(result))
//             .setMimeType(ContentService.MimeType.JSON);
//         return payload;
//     }
//     catch (e) {
//         const result: PostStatusResponder = {
//             status: "error",
//             message: "doPost Error has been occured"
//         };
//         const payload = ContentService
//             .createTextOutput(JSON.stringify(result))
//             .setMimeType(ContentService.MimeType.JSON);

//         return payload;
//     }
// }