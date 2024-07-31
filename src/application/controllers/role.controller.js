const Joi = require('joi');
const joiValid = require('../../../private_modules/validators/joiValidator');
const roleService = require('../../domain/roleService');

async function getRole(req, res) {
    const response = await roleService.getRole();
    res.json(response);
}

async function addRole(req, res) {
    const data = req.body.user_role;
    const schema = Joi.object()
        .required()
        .keys({
            name: Joi.string().required(),
            description: Joi.string().required(),
            have_access: Joi.boolean().required(),
            manage_emergency: Joi.boolean().required(),
            manage_drill: Joi.boolean().required(),
            manage_global_settings: Joi.boolean().required(),
            make_backups: Joi.boolean().required(),
            manage_users: Joi.boolean().required(), 
            create_report: Joi.boolean().required(),
            view_report: Joi.boolean().required(), 
            print_report: Joi.boolean().required(),
        });
    joiValid(schema, data);
    const response = await roleService.addRole(data);
    res.json(response);
}

async function updateRole(req, res) {
    const data = {id_role: req.params.id_role, role: req.body.user_role};
    const schema = Joi.object()
        .required()
        .keys({
            id_role: Joi.number().required(),
            role: Joi.object().required().keys({
                name: Joi.string().required(),
                description: Joi.string().required(),
                have_access: Joi.boolean().required(),
                manage_emergency: Joi.boolean().required(),
                manage_drill: Joi.boolean().required(),
                manage_global_settings: Joi.boolean().required(),
                make_backups: Joi.boolean().required(),
                manage_users: Joi.boolean().required(), 
                create_report: Joi.boolean().required(),
                view_report: Joi.boolean().required(), 
                print_report: Joi.boolean().required(),
            })
        });
    joiValid(schema, data);
    const response = await roleService.updateRole(data);
    res.json(response);
}

async function deleteRole(req, res) {
    const data = {id_role: req.params.id_role};
    const schema = Joi.object().required().keys({
        id_role: Joi.number().required(),
    });
    joiValid(schema, data);
    const response = await roleService.deleteRole(data);
    res.json(response);
}

module.exports = {
    getRole,
    addRole,
    updateRole,
    deleteRole
}
