const express = require("express");
const router = express.Router();
const Authentication = require('../authentication/auth');
const conversationController = require('../controller/conversation');

router.post('/addConversation', Authentication.auth, conversationController.addConversation);
router.get('/getConversations', Authentication.auth, conversationController.getConversations);

module.exports = router;