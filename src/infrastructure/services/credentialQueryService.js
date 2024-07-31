const knex = require('../../../private_modules/knexModule').getKnex();

class CredentialQueryService {
    async getUserCredential() {
        return await knex('credential')
            .select('credential_value')
            .where({ credential_type: 2 });
    }
}

module.exports = new CredentialQueryService();