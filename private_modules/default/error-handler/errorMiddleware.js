const serializeError = require('serialize-error');

module.exports = (options) => {
    const errorMapper = require('./errorMapper')({
        responseCodesDictionary: options.responseCodesDictionary,
        logger: options.logger,
    });
    const logger = options.logger;
    const errorMiddleware = (err, req, res, next) => {
        const internalError = serializeError(err);
        if (internalError && !internalError.code) {
            internalError.code = internalError.name;
        }
        if (logger) {
            logger.error(err);
        }
        const { error, responseCode } = errorMapper(err);
        const { code, message, severity } = error;
        res.errorMessage = message;
        res.errorCode = code;
        res.errorSeverity = severity;
        res.internalError = internalError;
        if (res.headersSent) {
            return next(error);
        }

        res.status(responseCode).json({ code, message, severity });
    };
    return errorMiddleware;
};