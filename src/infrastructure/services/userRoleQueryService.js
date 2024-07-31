const knex = require('../../../private_modules/knexModule').getKnex();

class UserRoleQueryService {
  async getRoles() {
    return await knex('user_role').select();
  }
}

module.exports = new UserRoleQueryService();
