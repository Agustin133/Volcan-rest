const bcrypt = require('bcrypt');
const errorHandler = require('../../private_modules/buildErrorModule');
const accessTokenModule = require('../../private_modules/accessTokenModule');
const userQueryService = require('../infrastructure/services/userQueryService');
const httpContext = require('express-http-context');
class UserService {
    async login(params) {
        const user = await userQueryService.getUserDataAndRole(params);
        if (user.length != 0) {
            const passwordIsOk = bcrypt.compareSync(
                params.password,
                user[0].user_password
            );
            if (passwordIsOk) {
                delete user[0].user_password;
                const token = await accessTokenModule.createUserJWT(user[0]);
                const response = {
                    user: {
                        id: user[0].user_id,
                        username: params.username,
                        access_token: token,
                        personal_details: {
                            first_name: user[0].user_f_name,
                            last_name: user[0].user_l_name,
                            email: user[0].user_email,
                            phone_number: user[0].user_phone_number,
                        },
                        user_role: {
                            name: user[0].user_role_name,
                            description: user[0].user_role_description,
                            have_access: user[0].user_role_have_access ? true : false,
                            manage_emergency: user[0].user_role_manage_emergency ? true : false,
                            manage_drill: user[0].user_role_manage_drill ? true : false,
                            manage_global_settings: user[0].user_role_manage_global_settings ?
                                true : false,
                            make_backups: user[0].user_role_make_backups ? true : false,
                            manage_users: user[0].user_role_manage_users ? true : false,
                            create_report: user[0].user_role_create_report ? true : false,
                            view_report: user[0].user_role_view_report ? true : false,
                            print_report: user[0].user_role_print_report ? true : false,
                        },
                    },
                };
                return response;
            } else {
                throw errorHandler.buildError('invalid_password');
            }
        } else {
            throw errorHandler.buildError('invalid_username');
        }
    }

    async register(params) {
        const hashPassword = bcrypt.hashSync(params.password, 10);
        try {
            const user = {
                user_username: params.username,
                user_password: hashPassword,
                user_role_id: params.idRole,
                user_f_name: params.personalDetails.firstName,
                user_l_name: params.personalDetails.lastName,
                user_email: params.personalDetails.email,
                user_phone_number: params.personalDetails.phone_number,
            };
            const responseDb = await userQueryService.saveUserData(user);
            const responseToSend = {
                user: {
                    id_user: responseDb[0],
                },
            };
            return responseToSend;
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async updateUser(params) {
        let message;
        try {
            const dataToUpdate = { user_role_id: params.user.id_user_role, user_id: params.id_user };
            await userQueryService.updateUserRole(dataToUpdate);
            message = 'The user role was updated succesfully';
            return {
                user: {
                    message: message,
                },
            };
        } catch (err) {
            throw errorHandler.buildError(err.errno);
        }
    }

    async updatePersonalDetails(params) {
        let message;
        try {
            const idUser = httpContext.get('accessToken').user.id_user;
            const dataToUpdate = {
                personal_details: {
                    user_f_name: params.user.personal_details.first_name,
                    user_l_name: params.user.personal_details.last_name,
                    user_email: params.user.personal_details.email,
                    user_phone_number: params.user.personal_details.phone_number,
                },
                id_user: idUser,
            };
            await userQueryService.updatePersonalDetails(dataToUpdate);
            message = 'The user was updated succesfully';
            return {
                user: {
                    message: message,
                },
            };
        } catch (err) {
            console.log(err);
            throw errorHandler.buildError(err.errno);
        }
    }

    async userEvents() {
        try {
            const idUser = httpContext.get('accessToken').user.id_user;
            const userEvents = await userQueryService.getEventByUser({ id_user: idUser });
            const newEvents = [];
            userEvents.forEach((event) => {
                const newEvent = {
                    id_event: event.event_id,
                    is_emergency: event.event_is_emergency ? true : false,
                    created_on: event.event_created_on,
                    finished_on: event.event_finished_on,
                }
                newEvents.push(newEvent);
            });
            return newEvents;
        } catch (err) {
            throw errorHandler.buildError(err.errno);
        }
    }

    async updatePassword(params) {
        let message;
        const hashPassword = bcrypt.hashSync(params.password, 10);
        try {
            const idUser = httpContext.get('accessToken').user.id_user;
            const dataToUpdate = {
                password: hashPassword,
                id_user: idUser
            }
            await userQueryService.updatePassword(dataToUpdate);
            message = 'The password was updated succesfully';
            return {
                message
            };
        } catch (err) {
            throw errorHandler.buildError(err.errno);
        }
    }
}

module.exports = new UserService();