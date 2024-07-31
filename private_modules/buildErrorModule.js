const errorCatalog = require('../src/infrastructure/dictionaries/errorCatalog.json');
const mysqlErrorCatalog = require('../src/infrastructure/dictionaries/mysqlErrorCatalog.json');
const mysqlErrorNumberDictionary = require('../src/infrastructure/dictionaries/mysqlErrorNumber.dictionary.json');

function buildError(errorCode, isMysql) {
    const error = new Error();
    let errorDetail;
    if (isMysql) {
        errorDetail = mysqlErrorCatalog[errorCode];
    } else {
        errorDetail = errorCatalog[errorCode];
    }
    Object.assign(error, errorDetail, {
        code: errorCode,
        message: errorDetail.message,
        severity: errorDetail.severity
    })
    return error;
}

function buildErrorMysql(errorNumber) {
    const errorCode = mysqlErrorNumberDictionary[errorNumber];
    const errorDetail = buildError(errorCode, true);
    return errorDetail;
}

module.exports = {
    buildError,
    buildErrorMysql
};