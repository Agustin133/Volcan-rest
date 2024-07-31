const errorHandler = require('../../private_modules/buildErrorModule');
const accessTokenModule = require('../../private_modules/accessTokenModule');
const roleQueryService = require('../infrastructure/services/roleQueryService');
const categoryQueryService = require('../infrastructure/services/categoryQueryService');

class RoleService {
    async getRole() {
        try {
            const dataToReturn = await roleQueryService.getRole();
            const newData = [];
            dataToReturn.forEach(role => {
                const newRole = {
                    id: role.user_role_id,
                    name: role.user_role_name,
                    style: role.user_role_style,
                    description: role.user_role_description,
                    have_access: role.user_role_have_access ? true : false,
                    manage_emergency: role.user_role_manage_emergency ? true : false,
                    manage_drill: role.user_role_manage_drill ? true : false,
                    manage_global_settings: role.user_role_manage_global_settings ? true : false,
                    make_backups: role.user_role_make_backups ? true : false,
                    manage_users: role.user_role_manage_users ? true : false,
                    create_report: role.user_role_create_report ? true : false,
                    view_report: role.user_role_view_report ? true : false,
                    print_report: role.user_role_print_report ? true : false
                }
                newData.push(newRole);
            });
            return {
                roles: newData
            }
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async addRole(params) {
        try {
            const data = {
                user_role_name: params.name,
                user_role_description: params.description,
                user_role_have_access: params.have_access,
                user_role_manage_emergency: params.manage_emergency,
                user_role_manage_drill: params.manage_drill,
                user_role_manage_global_settings: params.manage_global_settings,
                user_role_make_backups: params.make_backups,
                user_role_manage_users: params.manage_users,
                user_role_create_report: params.create_report,
                user_role_view_report: params.view_report,
                user_role_print_report: params.print_report
            };
            await roleQueryService.addRole(data);
            return params;
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async updateRole(params) {
        let message;
        try {
            const dataToUpdate = {
                user_role_name: params.role.name,
                user_role_description: params.role.description,
                user_role_have_access: params.role.have_access,
                user_role_manage_emergency: params.role.manage_emergency,
                user_role_manage_drill: params.role.manage_drill,
                user_role_manage_global_settings: params.role.manage_global_settings,
                user_role_make_backups: params.role.make_backups,
                user_role_manage_users: params.role.manage_users,
                user_role_create_report: params.role.create_report,
                user_role_view_report: params.role.view_report,
                user_role_print_report: params.role.print_report
            };
            const id = { user_role_id: params.id_role };
            await roleQueryService.updateRole(dataToUpdate, id);
            message = 'The role was updated successfully';
            return {
                message
            };
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async deleteRole(params) {
        let message;
        try {
            const data = { user_role_id: params.id_role };
            await roleQueryService.deleteRole(data);
            message = 'The role was deleted successfully';
            return {
                message
            };
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }
}

module.exports = new RoleService();