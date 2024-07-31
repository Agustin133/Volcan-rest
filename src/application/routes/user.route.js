const express = require('express');
const userController = require('../controllers/user.controller');
const accessTokenValidator = require('../../../private_modules/validators/accessTokenValidator');

// eslint-disable-next-line
const router = express.Router();

router
    .route('/login')
    .post(userController.userLogin);

router
    .route('/register')
    .post(accessTokenValidator.validateUserData, userController.userRegister);

router
    .route('/personal_details')
    .put(accessTokenValidator.validateUserData, userController.userPersonalDetails);

router
    .route('/event')
    .get(accessTokenValidator.validateUserData, userController.userEvents);

router
    .route('/update_password')
    .put(accessTokenValidator.validateUserData, userController.updatePassword);

router
    .route('/:id_user').put(userController.userRoleUpdate);

module.exports = router;