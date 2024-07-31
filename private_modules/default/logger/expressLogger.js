const logger = require('./logger');
const expressWinston = require('express-winston');

module.exports = expressWinston.logger({
  winstonInstance: logger,
  expressFormat: true,
  meta: true,
  colorize: false,
  baseMeta: {
    type: 'http_request',
  },
  dynamicMeta(req, res, err) {
    const meta = {};
    if (req.route) {
      meta.route = req.route.path;
    } else {
      meta.route = 'N/A';
    }
    if (res.statusCode > 399) {
      meta.error = {
        message: res.errorMessage,
        code: res.errorCode,
        severity: res.errorSeverity,
        internalError: res.internalError,
      };
    }
    return meta;
  },
});
