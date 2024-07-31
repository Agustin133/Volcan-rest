const Joi = require('joi');
const joiValid = require('../../../private_modules/validators/joiValidator');
const categoryService = require('../../domain/categoryService');

async function updateCategory(req, res) {
    const data = req.body.category;
    const schema = Joi.object().required().keys({
        id_category: Joi.number().required(),
        name: Joi.string().required(),
        style: Joi.string().required().valid('primary', 'danger', 'warning', 'success', 'info', 'extra'),
    })
    joiValid(schema, data);
    const response = await categoryService.updateCategory(data)
    res.json(response);
}

async function addCategory(req, res) {
    const data = req.body
    const schema = Joi.object().required().keys({
        category: Joi.object().required().keys({
            name: Joi.string().required(),
            style: Joi.string().required().valid('primary', 'danger', 'warning', 'success', 'info', 'extra'),
            parent_id_category: Joi.number()
        })
    });
    joiValid(schema, data);
    const response = await categoryService.addNewCategory(data);
    res.json(response);
}

async function deleteCategory(req, res) {
    const data = {
        id_category: req.body.category.id_category
    }
    const schema = Joi.object().required().keys({
        id_category: Joi.number().required()
    })
    joiValid(schema, data);
    const response = await categoryService.deleteCategory(data);
    res.json(response);
}

async function getCategories(req, res) {
    const response = await categoryService.getCategories();
    res.json(response);
}

module.exports = {
    updateCategory,
    addCategory,
    deleteCategory,
    getCategories,
};