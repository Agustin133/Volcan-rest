const express = require('express');
const roleController = require('../controllers/role.controller');
const accessTokenValidator = require('../../../private_modules/validators/accessTokenValidator');
const { route } = require('./user.route');

// eslint-disable-next-line
const router = express.Router();

router
    .route('')
    .get(accessTokenValidator.validateUserData, roleController.getRole)
    .post(accessTokenValidator.validateUserData, roleController.addRole)

router
    .route('/:id_role')
    .put(accessTokenValidator.validateUserData, roleController.updateRole)

router
    .route('/:id_role')
    .delete(accessTokenValidator.validateUserData, roleController.deleteRole);


module.exports = router;