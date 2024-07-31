const accessTokenModule = require('../accessTokenModule');
const buildErrorModule = require('../buildErrorModule');
const httpContext = require('express-http-context');
const config = require('config');
const cacheMemoryModule = require('../cacheMemoryModule');

async function validateUserData(req, res, next) {
    const authorization = req.header('Authorization');
    if (authorization) {
        if (authorization.startsWith("Bearer ")) {
            const token = authorization.split(" ");
            try {
                await accessTokenModule.verifyJWT(token[1])
                const tokenDecoded = await accessTokenModule.decodeJWT(token[1])
                    //console.log(req.route.path);
                    //await validateUserRole(req._parsedUrl.path, tokenDecoded.user.id_role);
                httpContext.set("accessToken", tokenDecoded);
                next();
            } catch (err) {
                throw buildErrorModule.buildError('unauthorized');
            }
        } else {
            throw buildErrorModule.buildError('unauthorized');
        }
    } else {
        throw buildErrorModule.buildError('unauthorized');
    }
}

module.exports = {
    validateUserData,
};