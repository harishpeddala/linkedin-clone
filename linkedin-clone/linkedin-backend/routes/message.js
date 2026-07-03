const express = require("express");
const router = express.Router();
const Authentication = require('../authentication/auth');
const messageController = require('../controller/message');


router.post('/', Authentication.auth, messageController.sendMessage);
router.get('/:conversationId', Authentication.auth, messageController.getMessages);

module.exports = router;