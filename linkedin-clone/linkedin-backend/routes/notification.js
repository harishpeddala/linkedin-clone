const express = require("express");
const router = express.Router();
const NotificationController = require('../controller/notification');
const Authentication = require('../authentication/auth');


router.get('/', Authentication.auth, NotificationController.getNotifications);
router.put('/markAsRead', Authentication.auth, NotificationController.markAsRead);
router.get('/activeNotifications', Authentication.auth, NotificationController.getActiveNotifications);

module.exports = router;