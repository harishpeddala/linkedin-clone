const User = require("../models/user");
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const NotificationModel = require("../models/notification");

const cookieOptions = {
    httpOnly: true,
    secure: false,  //Set to true in production
    sameSite: 'Lax' //Set None in Production
};



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID?.trim());

exports.gmailLogin = async (req, res) => {
    try {
        const { token } = req.body;
        console.log("GOOGLE_CLIENT_ID at runtime:", JSON.stringify(process.env.GOOGLE_CLIENT_ID));
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID?.trim()
        });
        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        let userExists = await User.findOne({ email });
        if (!userExists) {
            //Register New User
            const newUser = new User({
                email,
                f_name: name,
                googleId: sub,
                profilePic: picture
            });
            await newUser.save();
            return res.status(201).json({ message: "User registered successfully", success: "yes", data: newUser });
        }
        let jwtToken = jwt.sign({ userId: userExists._id }, process.env.JWT_PRIVATE_KEY);
        res.cookie('token', jwtToken, cookieOptions);
        return res.status(200).json({ message: "User logged in successfully", success: "yes", data: userExists });

    }
    catch (error) {
        console.error("Error in gmailLogin route:", error);
    }
}


exports.register = async (req, res) => {
    try {
        let { email, password, f_name } = req.body;
        let isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({ error: "User already exists. Please try with another email." });
        }
        let hashedPassword = await bcrypt.hash(password, 10);
        let newUser = new User({ email, password: hashedPassword, f_name });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", success: true, data: newUser });
    }
    catch (error) {
        console.error("Error in register route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(400).json({ error: "User not found. Please register first." });
        }
        if (userExists && !userExists.password) {
            return res.status(400).json({ error: "User registered with Google. Please login with Google." });
        }
        let isPasswordValid = await bcrypt.compare(password, userExists.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid Credentials. Please try again." });
        }
        let token = jwt.sign({ userId: userExists._id }, process.env.JWT_PRIVATE_KEY);
        res.cookie('token', token, cookieOptions);
        res.status(200).json({ message: "Login successful", success: true, data: userExists });
    }
    catch (error) {
        console.error("Error in login route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { user } = req.body;
        const isUserExist = await User.findById(req.user._id);
        if (!isUserExist) {
            return res.status(404).json({ error: "User not found." });
        }
        const updateData = await User.findByIdAndUpdate(isUserExist._id, user);
        const userData = await User.findById(req.user._id);
        res.status(200).json({ message: "User updated successfully", success: true, data: userData });
    }
    catch (error) {
        console.error("Error in updateUser route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

exports.getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const isUserExist = await User.findById(id);
        if (!isUserExist) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json({ message: "User profile retrieved successfully", success: true, data: isUserExist });
    }
    catch (error) {
        console.error("Error in getProfileById route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', cookieOptions);
        res.status(200).json({ message: "Logout successful", success: true });
    }
    catch (error) {
        console.error("Error in logout route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

// User Search in Search Bar
exports.findUser = async (req, res) => {
    try {
        const { query } = req.query;
        const users = await User.find({ $and: [{ _id: { $ne: req.user._id } }, { $or: [{ f_name: { $regex: new RegExp(`^${query}`, "i") } }, { email: { $regex: new RegExp(`^${query}`, "i") } }] }] });
        res.status(200).json({ message: "Users fetched successfully", success: true, users: users });
    } catch (error) {
        console.error("Error in findUser route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

exports.sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user._id;
        if (senderId.toString() === receiverId) {
            return res.status(400).json({ error: "You cannot send a friend request to yourself." });
        }
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ error: "Receiver user not found." });
        }
        if (receiver.pending_friends.includes(senderId)) {
            return res.status(400).json({ error: "Friend request already sent." });
        }
        receiver.pending_friends.push(senderId);
        await receiver.save();
        let content = `${sender.f_name} has sent you a friend request.`;
        const newNotification = new NotificationModel({
            sender: senderId,
            receiver: receiverId,
            content,
            type: 'friendRequest'
        });
        await newNotification.save();
        res.status(200).json({ message: "Friend request sent successfully", success: true });
    } catch (error) {
        console.error("Error in sendFriendRequest route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

exports.acceptFriendRequest = async (req, res) => {
    try {
        const { senderId } = req.body;
        const receiverId = req.user._id;
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender) {
            return res.status(404).json({ error: "Sender user not found." });
        }
        if (!receiver) {
            return res.status(404).json({ error: "Receiver user not found." });
        }
        if (!receiver.pending_friends.includes(senderId)) {
            return res.status(400).json({ error: "No pending friend request from this user." });
        }
        receiver.pending_friends.pull(senderId);
        receiver.friends.push(senderId);
        sender.friends.push(receiverId);
        await receiver.save();
        await sender.save();

        let content = `${receiver.f_name} has accepted your friend request.`;
        const newNotification = new NotificationModel({
            sender: receiverId,
            receiver: senderId,
            content,
            type: 'friendRequest'
        });
        await newNotification.save();
        res.status(200).json({ message: "Friend request accepted successfully", success: true });
    }
    catch (error) {
        console.error("Error in acceptFriendRequest route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

exports.getFriendsList = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('friends', 'f_name email profilePic cover_pic headline curr_location curr_company');
        res.status(200).json({ message: "Friends list retrieved successfully", success: true, friends: user.friends });
    } catch (error) {
        console.error("Error in getFriendsList route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

exports.getPendingFriendsList = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('pending_friends', 'f_name email profilePic cover_pic headline curr_location curr_company');
        res.status(200).json({ message: "Pending friends list retrieved successfully", success: true, pendingFriends: user.pending_friends });
    } catch (error) {
        console.error("Error in getPendingFriendsList route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

exports.removeFriend = async (req, res) => {
    try {
        const { friendId } = req.params;
        const userId = req.user._id;
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (!friend) {
            return res.status(404).json({ error: "Friend user not found." });
        }
        user.friends.pull(friendId);
        friend.friends.pull(userId);
        await user.save();
        await friend.save();
        res.status(200).json({ message: "Friend removed successfully", success: true });
    } catch (error) {
        console.error("Error in removeFriend route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};