const express = require('express');
// eslint-disable-next-line
const router = new express.Router();
const userRoute = require('./user.route');
const eventRoute = require('./event.route');
const categoryRoute = require('./category.route');
const roleRoute = require('./role.route');
const assistanceRoute = require('./assistance.route');

router.use('/api/tromen/user', userRoute);
router.use('/api/tromen/event', eventRoute);
router.use('/api/tromen/category', categoryRoute);
router.use('/api/tromen/role', roleRoute);
router.use('/api/tromen/assistance', assistanceRoute)

module.exports = router;