const cacheMemoryModule = require('../private_modules/cacheMemoryModule');
const credentialQueryService = require('../src/infrastructure/services/credentialQueryService');
const userRoleQueryService = require('../src/infrastructure/services/userRoleQueryService');

async function getDataForStartApp() {
    await saveUserCredential();
    await saveUserRoles();
}

async function saveUserCredential() {
    let credential = cacheMemoryModule.getKey("accessTokenCredential");
    if (!credential) {
        const result = await credentialQueryService.getUserCredential();
        credential = result[0].value;
        cacheMemoryModule.setKey("accessTokenCredential", credential, 0);
    }
}

async function saveUserRoles() {
    let userRoles = cacheMemoryModule.getKey("userRoles");
    if (!userRoles) {
        const result = await userRoleQueryService.getRoles();
        userRoles = result[0].id_user_role;
        cacheMemoryModule.setKey("userRoles", result, 0);
    }
}

module.exports = {
    getDataForStartApp,
};