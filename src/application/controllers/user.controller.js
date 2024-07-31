const Joi = require('joi');
const joiValid = require('../../../private_modules/validators/joiValidator');
const userService = require('../../domain/userService');

async function userLogin(req, res) {
    const data = {
        username: req.body.user.username,
        password: req.body.user.password,
    };
    const schema = Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string()
            .required()
            .min(8)
            .max(20),
    });
    joiValid(schema, data, true);
    const response = await userService.login(data);
    res.json(response);
}

async function userRegister(req, res) {
    const data = {
        username: req.body.user.username,
        password: req.body.user.password,
        idRole: req.body.user.id_role,
        personalDetails: {
            firstName: req.body.user.personal_details.first_name,
            lastName: req.body.user.personal_details.last_name,
            email: req.body.user.personal_details.email,
            phone_number: req.body.user.personal_details.phone_number,
        },
    };
    const schema = Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string()
            .required()
            .min(8)
            .max(20),
        idRole: Joi.number().required(),
        personalDetails: Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required(),
            phone_number: Joi.string().required(),
        }),
    });
    joiValid(schema, data, true);
    const response = await userService.register(data);
    res.json(response);
}

async function userRoleUpdate(req, res) {
    const data = { id_user: req.params.id_user, user: req.body.user };
    const schema = Joi.object()
        .required()
        .keys({
            id_user: Joi.number().required(),
            user: Joi.object()
                .required()
                .keys({
                    id_user_role: Joi.number().required(),
                }),
        });
    joiValid(schema, data);
    const response = await userService.updateUser(data);
    res.json(response);
}

async function userPersonalDetails(req, res) {
    const data = { user: req.body.user };
    const schema = Joi.object()
        .required()
        .keys({
            user: Joi.object()
                .required()
                .keys({
                    personal_details: Joi.object()
                        .required()
                        .keys({
                            first_name: Joi.string().required(),
                            last_name: Joi.string().required(),
                            email: Joi.string().required(),
                            phone_number: Joi.string().required(),
                        }),
                }),
        });
    joiValid(schema, data);
    const response = await userService.updatePersonalDetails(data);
    res.json(response);
}

async function userEvents(req, res) {
    const response = await userService.userEvents();
    res.json(response);
}

async function updatePassword(req, res) {
    const data = req.body.user;
    const schema = Joi.object()
        .required()
        .keys({
            password: Joi.string().required().min(8).max(20)
        })
    joiValid(schema, data, true);
    const response = await userService.updatePassword(data);
    res.json(response);
}

module.exports = {
    userLogin,
    userRegister,
    userRoleUpdate,
    userPersonalDetails,
    userEvents,
    updatePassword,
};