const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized Access. No token provided." });
        }
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = await User.findById(decoded.userId).select('-password');
        next();
    }
    catch (error) {
        console.error("Error in auth middleware:", error);
        res.status(401).json({ error: "Invalid Token", message: error.message });
    }
}