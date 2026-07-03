const express = require("express");
const router = express.Router();
const UserController = require('../controller/user');
const Authentication = require('../authentication/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/google', UserController.gmailLogin);

router.put('/update', Authentication.auth, UserController.updateUser);
router.get('/user/:id', UserController.getProfileById);
router.post('/logout', Authentication.auth, UserController.logout);

router.get('/self', Authentication.auth, (req, res) => {
    return res.status(200).json({ message: "User data retrieved successfully", success: "yes", data: req.user });
});

router.get('/findUser', Authentication.auth, UserController.findUser);
router.post('/sendFriendRequest', Authentication.auth, UserController.sendFriendRequest);
router.post('/acceptFriendRequest', Authentication.auth, UserController.acceptFriendRequest);
router.get('/getFriendsList', Authentication.auth, UserController.getFriendsList);
router.get('/getPendingFriendsList', Authentication.auth, UserController.getPendingFriendsList);
// router.post('/rejectFriendRequest', Authentication.auth, UserController.rejectFriendRequest);
router.delete('/removeFriend/:friendId', Authentication.auth, UserController.removeFriend);


module.exports = router;