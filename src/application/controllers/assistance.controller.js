const { json } = require('body-parser');
const Joi = require('joi');
const joiValid = require('../../../private_modules/validators/joiValidator');
const assistanceService = require('../../domain/assistanceService');

async function getAssistance(req, res) {
    const data = { assistance_id: req.params.assistance_id};
    const schema = Joi.object().required().keys({
        assistance_id: Joi.number().required()
    })
    joiValid(schema, data);
    const response = await assistanceService.getAssistance(data);
    res.json(response);
}


async function addAssistance(req, res) {
    const data = req.body;
    const schema = Joi.object().required().keys({
        assistance: Joi.object().required().keys({
            name: Joi.string().required(),
            can_have_passengers: Joi.boolean().required(),
            license_plate: Joi.string().required(),
            description: Joi.string().required()
        })
    });
    joiValid(schema, data);
    const response = await assistanceService.addAssistance(data);
    res.json(response);
}


async function putAssistance(req, res) {
    const data = {
        datas: req.body,
        assistance_id: req.params.assistance_id
    };
    const schema = Joi.object().required().keys({
        assistance: Joi.object().required().keys({
            name: Joi.string().required(),
            can_have_passengers: Joi.boolean().required(),
            license_plate: Joi.string().required(),
            description: Joi.string().required()
        })
    });
    const schema1 = Joi.number().required();
    joiValid(schema, data.datas);
    joiValid(schema1, data.assistance_id);
    const response = await assistanceService.putAssistance(data);
    res.json(response);
}


async function deleteAssistance(req, res) {
    const data = { assistance_id: req.params.assistance_id};
    const schema = Joi.object().required().keys({
        assistance_id: Joi.number().required()
    })
    joiValid(schema, data);
    const response = await assistanceService.deleteAssistance(data);
    res.json(response);
}


module.exports = {
    getAssistance,
    addAssistance,
    putAssistance,
    deleteAssistance
}