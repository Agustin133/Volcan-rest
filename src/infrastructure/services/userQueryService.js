const knex = require('../../../private_modules/knexModule').getKnex();

class UserQueryService {
    async getUserDataAndRole(params) {
        return await knex('user')
            .join('user_role', { 'user_role.user_role_id': 'user.user_role_id' })
            .select()
            .where({ user_username: params.username });

        // return await knex('user as u')
        // .join('user_role as ur', 'u.id_user_role', 'ur.id_user_role')
        // .select('u.name AS user_name', 'ur.name AS user_role_name')
        // .where({ username: params.username });
    }

    async saveUserData(user) {
        return await knex('user').insert(user);
    }

    async updateUserRole(dataToUpdate) {
        return await knex('user')
            .update({ user_role_id: dataToUpdate.user_role_id })
            .where({ user_id: dataToUpdate.user_id });
    }

    async updatePersonalDetails(dataToUpdate) {
        return await knex('user')
            .update(dataToUpdate.personal_details)
            .where({ user_id: dataToUpdate.id_user });
    }

    async getEventByUser(data) {
        return await knex('event_user')
            .join('event', { 'event.event_id': 'event_user.event_id' })
            .where({ user_id: data.id_user })
            .select('event.*');
    }

    async updatePassword(dataToUpdate) {
        return await knex('user')
            .update({ user_password: dataToUpdate.password })
            .where({ user_id: dataToUpdate.id_user });
    }
}

module.exports = new UserQueryService();