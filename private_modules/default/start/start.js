const httpContext = require('express-http-context');
const path = require('path');
const dataForStartModule = require("../../dataForStartModule");

module.exports = class Start {
    constructor(options) {
        const defaults = {
            enableHttpContext: true,
            enableLogger: false,
            enableCors: true,
            enableSwaggerStatsLogger: true,
            enableSecurity: true,
            enableBodyParser: true,
            enableVersion: true,
            enableErrorMiddleware: true,
            logger: require('../logger/logger'),
            config: require('config'),
            express: require('express'),
            enableAsyncErrors: true
        };

        this.options = Object.assign({}, defaults, options);
        if (this.options.config.has('cors.enabled')) {
            this.options.enableCors = true;
        }
        if (this.options.enableAsyncErrors) {
            require('./asyncErrors');
        }

        this.app = this.options.express();
        this.beforeStartRoutes();
        this.app.use('/', this.getRoutes());
        this.afterStartRoutes();
    }
    getRoutes() {
        return require('../../../src/application/routes/index');
    }
    async getAndSaveUserData() {
        await dataForStartModule.getDataForStartApp();
    }
    enableHttpContext() {
        if (this.options.enableHttpContext) {
            this.app.use(httpContext.middleware);
        }
    }
    enableLogger() {
        if (this.options.enableLogger) {
            const expressLogger = require('../logger/expressLogger');
            this.app.use(expressLogger);
        }
    }
    enableSwaggerStatsLogger() {
        if (this.options.enableSwaggerStatsLogger) {
            const swaggerStatsLogger = require('../logger/statsLogger');
            this.app.use(swaggerStatsLogger);
        }
    }
    enableSecurity() {
        if (this.options.enableSecurity) {
            const helmet = require('helmet');
            this.app.use(helmet());
        }
    }
    getResponseCodesDictionary() {
        return require('../../../src/infrastructure/dictionaries/responseCodes.dictionary.json');
    }
    enableErrorMiddleware() {
        if (this.options.enableErrorMiddleware) {
            const errorMiddleware = require('../error-handler/errorMiddleware')({
                responseCodesDictionary: this.getResponseCodesDictionary(),
                logger: this.options.logger,
            });
            this.app.use(errorMiddleware);
        }
    }
    enableBodyParser() {
        if (this.options.enableBodyParser) {
            const bodyParser = require('body-parser');
            this.app.use(bodyParser.json({ type: 'application/json' }));
        }
    }
    enableCors() {
        if (this.options.enableCors) {
            const cors = require('cors');
            this.app.use(cors({
                origin: '*',
            }));
        }
    }
    enableVersion() {
        if (this.options.enableVersion) {
            const versionMiddleware = require('./version')(this.options);
            this.app.use('/version', versionMiddleware);
        }
    }
    enable404NotFound() {
        this.app.use(function(req, res, next) {
            const e = new Error();
            e.code = 'not_found';
            e.message = 'Server did not find a current representation for the target resource';
            e.severity = 'HIGH';
            e.status = 404;

            throw e;
        });
    }
    enable400InvalidJSONParameters() {
        this.app.use(
            function(err, req, res, next) {
                if (err instanceof SyntaxError &&
                    err.status >= 400 && err.status < 500 &&
                    err.message.indexOf('JSON')) {
                    const error = new Error();
                    error.message = 'Invalid parameters';
                    error.code = 'bad_request';
                    error.severity = 'LOW';
                    throw error;
                }
                next(err);
            },
        );
    }
    beforeStartRoutes() {
        this.enableVersion();
        this.enableBodyParser();
        this.enableHttpContext();
        this.enableLogger();
        this.enableCors();
        this.enableSwaggerStatsLogger();
        this.enableSecurity();
        this.enable400InvalidJSONParameters();

    }
    afterStartRoutes() {
        this.enable404NotFound();
        this.enableErrorMiddleware();
    }
    async start() {
        this.server = await this.startServer();
    }
    async stop() {
        await this.closeServer();
    }
    closeServer() {
        const port = process.env.PORT || 3000;
        const server = this.server;
        const logger = this.options.logger;
        return new Promise(function(resolve, reject) {
            server.close(function() {
                logger.info(
                    `App TROMEN stopped`, {
                        type: 'stopped',
                        applicationName: 'TROMEN',
                        port,
                    });
                resolve();
            });
        });
    }
    startServer() {
        const port = process.env.PORT || 3000;
        const app = this.app;
        const logger = this.options.logger;
        return new Promise(function(resolve, reject) {
            const server = app.listen(port, function() {
                logger.info(
                    `App TROMEN started at port ${port}`, {
                        type: 'started',
                        applicationName: 'TROMEN',
                        port,
                    });
                const socket = require('../../../src/domain/sockets/socket');
                socket(server);
                resolve(server);
            });
        });
    }
};