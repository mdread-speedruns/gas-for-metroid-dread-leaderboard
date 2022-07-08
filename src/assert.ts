// const WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty('WEBHOOK_URL')
// const exports = WEBHOOK_URL ? GASUnit.slack(WEBHOOK_URL).exports : GASUnit.exports
const exports = GASUnit.exports
const assert = GASUnit.assert