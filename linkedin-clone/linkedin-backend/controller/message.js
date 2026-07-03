const MessageModel = require('../models/message');

exports.sendMessage = async (req, res) => {
    try {
        const { conversationId, message, picture } = req.body;
        const senderId = req.user._id;
        const newMessage = new MessageModel({
            conversation: conversationId,
            sender: senderId,
            message,
            picture
        });
        await newMessage.save();
        let populatedMessage = await newMessage.populate('sender');
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await MessageModel.find({ conversation: conversationId }).populate('sender').sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};