const accessTokenModule = require('./accessTokenModule');
const httpContext = require("express-http-context");

async function setUserData(req, res, next) {
    const token = httpContext.get("accessToken");
    const tokenDecoded = await accessTokenModule.decodeJWT(token);
    delete tokenDecoded.iat;
    httpContext.set("loggedUser", tokenDecoded);
    next();
}


module.exports = {
    setUserData,
};