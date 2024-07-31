const knex = require('../../../private_modules/knexModule').getKnex();

class RoleQueryService {
    async getRole () {
        return await knex('user_role').select();
    }

    async addRole (dataToInsert) {
        return await knex('user_role').insert(dataToInsert);
    }

    async updateRole (dataToInsert, id) {
        return await knex('user_role').update(dataToInsert).where(id);
    }

    async deleteRole (dataToDelete) {
        return await knex('user_role').delete().where(dataToDelete);
    }
}

module.exports = new RoleQueryService();