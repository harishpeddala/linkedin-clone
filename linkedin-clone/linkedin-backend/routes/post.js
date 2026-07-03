const express = require("express");
const router = express.Router();
const PostController = require('../controller/post');
const Authentication = require('../authentication/auth');


router.post('/', Authentication.auth, PostController.addPost);
router.post('/likeDislike', Authentication.auth, PostController.likeDislikePost);
router.get('/getAllPosts', PostController.getAllPosts);
router.get('/getPostById/:id', Authentication.auth, PostController.getPostById);
router.get('/getTop5Posts/:id', Authentication.auth, PostController.getTop5Posts);
router.get('/getUserPosts/:id', Authentication.auth, PostController.getUserPosts);

module.exports = router;