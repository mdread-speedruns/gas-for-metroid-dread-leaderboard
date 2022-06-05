// function getRecords(sheetid: string): string {
//     const sheet = SpreadsheetApp.openById(sheetid).getSheets()[0];
//     const table = sheet.getDataRange().getValues();

//     const labels = table[0];
//     const ids = table[1];
//     const data = table.slice(2);

//     const records: object[] = [];

//     for (let record of data) {
//         // dict for each record
//         const obj: object = {};

//         for (let i = 0; i < labels.length; i++) {
//             if (ids[i] !== '') {
//                 const ref = JSON.parse(getRecords(ids[i])).find((r: object) => r['id'] === record[i]);
//                 obj[labels[i]] = record[i];
//             }
//             else {
//                 obj[labels[i]] = record[i];
//             }
//         }

//         // for (let i = 0; i < labels.length; i++) {
//         //     if (ids[i] !== '') {
//         //         const rec = JSON.parse(getRecords(ids[i]))
//         //         records.push()
//         //     } else {
//         //         records.push(obj);
//         //     }
//         // }

//     }

//     return JSON.stringify(records);
// }

// function getRecordsTest() {
//     const sheetid = '1-MwVWnlS4x-00qcvyzaV6bL4LsoZN440Yr0GhQlMal4';
//     const result = getRecords(sheetid);

//     Logger.log(result);
// }