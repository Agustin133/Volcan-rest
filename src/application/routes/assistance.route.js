const express = require('express');
const assistanceController = require('../controllers/assistance.controller');
const accessTokenValidator = require('../../../private_modules/validators/accessTokenValidator'); 

const router = express.Router();

router  
    .route('')
    .post(accessTokenValidator.validateUserData, assistanceController.addAssistance);

router
    .route('/:assistance_id')
    .get(accessTokenValidator.validateUserData, assistanceController.getAssistance)
    .put(accessTokenValidator.validateUserData, assistanceController.putAssistance)
    .delete(accessTokenValidator.validateUserData, assistanceController.deleteAssistance)

module.exports = router;