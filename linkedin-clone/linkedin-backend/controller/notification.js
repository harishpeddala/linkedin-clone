const NotificationModel = require('../models/notification');


exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await NotificationModel.find({ receiver: userId })
            .populate('sender receiver')
            .sort({ createdAt: -1 });
        res.status(200).json({ message: "Notifications retrieved successfully", success: true, notifications: notifications });
    }
    catch (error) {
        console.error("Error in getNotifications route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};


exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;
        const notification = await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true });
        if (!notification) {
            return res.status(404).json({ error: "Notification not found." });
        }
        res.status(200).json({ message: "Notifications marked as read successfully", success: true });
    }
    catch (error) {
        console.error("Error in markAsRead route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

exports.getActiveNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await NotificationModel.find({ receiver: userId, isRead: false })
            .populate('sender receiver')
            .sort({ createdAt: -1 });
        res.status(200).json({ message: "Active notifications retrieved successfully", success: true, count: notifications.length });
    }
    catch (error) {
        console.error("Error in getActiveNotifications route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};