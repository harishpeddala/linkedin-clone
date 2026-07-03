const express = require("express");
const router = express.Router();
const CommentController = require('../controller/comment');
const Authentication = require('../authentication/auth');




router.post('/', Authentication.auth, CommentController.addComment);
router.get('/:postId', Authentication.auth, CommentController.getCommentsByPostId);





module.exports = router;