const jwt = require('jsonwebtoken');
const cacheMemoryModule = require('../private_modules/cacheMemoryModule');
const credentialQueryService = require('../src/infrastructure/services/credentialQueryService');

async function getAndSaveUserCredential() {
    let credential = cacheMemoryModule.getKey("accessTokenCredential");
    if (!credential) {
        const result = await credentialQueryService.getUserCredential();
        credential = result[0].credential_value;
        cacheMemoryModule.setKey("accessTokenCredential", credential, 86400);
    }
    return credential;
}

async function createUserJWT(params) {
    const credential = await getAndSaveUserCredential();
    const token = jwt.sign({
        user: {
            id_user: params.user_id,
            username: params.user_username,
            id_role: params.id_user_role,
            personal_details: { first_name: params.user_f_name, last_name: params.user_l_name, email: params.user_email, phone_number: params.user_phone_number }
        }
    }, credential);
    return token;
}

async function decodeJWT(accessToken) {
    const credential = await getAndSaveUserCredential();
    const token = jwt.decode(accessToken, credential)
    return token;
}

async function verifyJWT(accessToken) {
    const credential = await getAndSaveUserCredential();
    const token = jwt.verify(accessToken, credential)
    return token;
}

module.exports = {
    createUserJWT,
    decodeJWT,
    verifyJWT
};