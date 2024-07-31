const logger = require('./logger');
const swaggerStats = require('swagger-stats');
const cloneDeep = require('lodash.clonedeep');
const compose = require('compose-middleware').compose;
const config = require('config');


const statsConfig = {
    onResponseFinish: function(req, res, rrr) {
        let properties = cloneDeep(rrr);

        properties.type = 'http_request';
        properties.responseTime = properties.responsetime;
        properties.isStats = true;
        properties.http.method = properties.method;
        properties.http.request.body = req.body;
        properties.http.request.query = req.query;
        properties.http.request.params = req.params;
        if (res.statusCode > 399) {
            if (!res.internalError) {
                res.internalError = {
                    code: res.errorCode,
                    message: res.message,
                };
            }
            if (res.statusCode < 500) {
                res.internalError.errorType = 'http_client_error';
            }
            if (res.statusCode === 500) {
                res.internalError.errorType = 'internal_server_error';
            }
            if (!res.internalError.errorType) {
                switch (res.statusCode) {
                    case 502:
                        res.internalError.errorType = 'downstream_http_server_error';
                        break;
                    case 504:
                        res.internalError.errorType = 'downstream_http_connection_error';
                        break;
                    default:
                        res.internalError.errorType = 'internal_server_error';
                }
            }
            properties.error = {
                message: res.errorMessage,
                code: res.errorCode,
                severity: res.errorSeverity,
                internalError: res.internalError,
            };
        }
        properties.layer = 'application';
        properties = removeFields(properties);
        logger.info(`${properties.http.method} ${properties.api.path} ${properties.http.response.code} ${properties.responseTime}ms`, properties);
    },
};

const removeFields = (log) => {
    const fieldsToRemove = ['responsetime', 'path', 'method', 'query', 'node', 'ip', 'real_ip', 'port'];
    fieldsToRemove.forEach((field) => {
        if (log.hasOwnProperty(field)) {
            delete log[field];
        }
    });
    return log;
};

module.exports = compose([
    swaggerStats.getMiddleware(statsConfig)
]);