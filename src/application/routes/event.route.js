const express = require('express');
const eventController = require('../controllers/event.controller');
const accessTokenValidator = require('../../../private_modules/validators/accessTokenValidator');
// eslint-disable-next-line
const router = express.Router();

router
    .route('/create/:event_type')
    .post(accessTokenValidator.validateUserData, eventController.addEvent);

router
    .route('/:event_id/people/:people_id')
    .put(accessTokenValidator.validateUserData, eventController.putPeople);

router
    .route('/:event_id/people/:people_id')
    .delete(accessTokenValidator.validateUserData, eventController.deletePeople);

router
    .route('/:event_id/people/:people_id')
    .get(accessTokenValidator.validateUserData, eventController.getPeopleById);

router
    .route('/:event_id/people')
    .get(accessTokenValidator.validateUserData, eventController.getPeople);

router
    .route('/:event_id/people')
    .post(accessTokenValidator.validateUserData, eventController.addPeople);

router
    .route('/:id_event')
    .put(accessTokenValidator.validateUserData, eventController.putEvent);

router
    .route('/:id_event/category')
    .post(accessTokenValidator.validateUserData, eventController.addCategory);

router
    .route('/:id_event')
    .put(accessTokenValidator.validateUserData, eventController.putEvent);

router
    .route('/:id_event/category/:id_category')
    .post(accessTokenValidator.validateUserData, eventController.addCategory);

router
    .route('/:id_event/category')
    .get(accessTokenValidator.validateUserData, eventController.getEventCategories);

router
    .route('/in_progress')
    .get(accessTokenValidator.validateUserData, eventController.getInprogressEvent);

router
    .route('/:id_event/contact_detail')
    .post(accessTokenValidator.validateUserData, eventController.addContactDetail);

router
    .route('/:id_event/contact_detail')
    .put(accessTokenValidator.validateUserData, eventController.putContactDetail);

router
    .route('/:id_event/contact_detail')
    .get(accessTokenValidator.validateUserData, eventController.getContactDetail);

router
    .route('/:id_event/location')
    .post(accessTokenValidator.validateUserData, eventController.addLocation);

router
    .route('/:id_event/location')
    .put(accessTokenValidator.validateUserData, eventController.putLocation);

router
    .route('/:id_event/location')
    .get(accessTokenValidator.validateUserData, eventController.getLocation);

router  
    .route('/:id_event/note')
    .get(accessTokenValidator.validateUserData, eventController.getNotes);

router
    .route('/:id_event/note')
    .post(accessTokenValidator.validateUserData, eventController.addNote);

router  
    .route('/:id_event/note/:note_id')
    .put(accessTokenValidator.validateUserData, eventController.putNote);

module.exports = router;