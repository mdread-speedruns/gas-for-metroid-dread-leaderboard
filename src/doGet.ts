function doGet(e) {
    const params = e.parameter;


    const result = {};

    const payload = ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);

    return payload;
}