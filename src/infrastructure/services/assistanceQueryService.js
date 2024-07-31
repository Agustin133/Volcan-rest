const knex = require('../../../private_modules/knexModule').getKnex();

class AssistanceQuerryService {
    async addAssistance(dataToInsert) {
        return await knex('assistance').insert(dataToInsert);
    }

    async getAssistance(id) {
        return await knex('assistance').select().where(id);
    }

    async putAssistance(dataToInsert) {
        return await knex('assistance').update(dataToInsert.body).where(dataToInsert.id);
    }

    async deleteAssistance(id) {
        return await knex('assistance').delete().where(id);
    }
}

module.exports = new AssistanceQuerryService();