module.exports = (options) => {
    const responseCodes = options.responseCodesDictionary;

    const errorMapper = (error) => {
        let responseCode = responseCodes[error.code];

        if (!responseCode) {
            error.code = 'internal_server_error';
            error.severity = 'HIGH';
            error.message = 'Internal Server Error';
            responseCode = 500;
        }
        error.severity = error.severity || 'UNKNOWN';

        return {
            error,
            responseCode,
        };
    };
    return errorMapper;
};