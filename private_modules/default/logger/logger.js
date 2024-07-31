const winston = require('winston');
const winstonError = require('winston-error');
const convertAllKeysToSnakeCase = require('./commons').convertAllKeysToSnakeCase;
const maskJson = require('./commons').maskJson;

const wcf = require('winston-console-formatter');
const clc = require('cli-color');
const {
    formatter,
} = wcf({
    colors: {
        debug: clc.blue,
        info: clc.cyan,
        notice: clc.green,
        warning: clc.yellow,
        error: clc.red,
        crit: clc.red,
        alert: clc.red,
        emerg: clc.red,
    },
});
const consolePresets = {
    dev: {
        level: 'debug',
        formatter,
        timestamp: true,
    },
    prod: {
        level: 'debug',
        json: true,
        timestamp: true,
        stringify: true,
    },
};

const transports = [];
const setTransports = function() {
    transports.push(new winston.transports.Console(
        consolePresets['dev']
    ));
};

setTransports();

const logger = new(winston.Logger)({
    levels: winston.config.syslog.levels,
    transports: transports,
    rewriters: [
        (level, msg, meta) => {
            return JSON.parse(JSON.stringify(meta));
        },
        (level, msg, meta) => {
            meta.version = 'N/A';
            return meta;
        },
        (level, msg, meta) => {
            return convertAllKeysToSnakeCase(meta);
        },
        (level, msg, meta) => {
            return maskJson(meta);
        },
    ],
});

winstonError(logger, {
    pickedFields: {
        name: undefined,
        message: undefined,
        stack: undefined,
        severity: undefined,
        layer: undefined,
        type: 'error',
        code: undefined,
        originalError: undefined,
        originalCode: undefined,
    },
});


process
    .on('unhandledRejection', (err) => {
        if (err instanceof Error) {
            err.message = `Unhandled Rejection: ${err.message}.`;
            err.type = 'unhandled_rejection_error';
            logger.error(err);
        } else {
            logger.error('Unhandled Rejection', { error: err, type: 'unhandled_rejection_error' });
        }
    })
    .on('uncaughtException', (err) => {
        err.type = 'uncaught_exception_error';
        try {
            logger.error(err);
        } catch (loggerError) {
            // eslint-disable-next-line
            console.error(err);
            // eslint-disable-next-line
            console.error(loggerError);
        }
        process.exit(1);
    });

module.exports = logger;