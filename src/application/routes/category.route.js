const express = require('express');
const categoryController = require('../controllers/category.controller');
const accessTokenValidator = require('../../../private_modules/validators/accessTokenValidator');
// eslint-disable-next-line
const router = express.Router();

router
    .route('')
    .get(accessTokenValidator.validateUserData, categoryController.getCategories)
    .post(accessTokenValidator.validateUserData, categoryController.addCategory)
    .put(accessTokenValidator.validateUserData, categoryController.updateCategory)
    .delete(accessTokenValidator.validateUserData, categoryController.deleteCategory);

module.exports = router;