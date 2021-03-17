const express = require('express');
const router = express.Router();
const notificationController = require('../controller/c-notification');
router.post('/send-notification', notificationController.sendFirebaseNotification)
module.exports = router;