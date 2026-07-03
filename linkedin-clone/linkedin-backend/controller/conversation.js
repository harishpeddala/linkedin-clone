const ConversationModel = require('../models/conversation');
const MessageModel = require('../models/message');

exports.addConversation = async (req, res) => {
    try {
        const { recipientId, message } = req.body;
        const senderId = req.user._id;
        let conversation = await ConversationModel.findOne({
            members: { $all: [senderId, recipientId] }
        });
        if (!conversation) {
            conversation = new ConversationModel({
                members: [senderId, recipientId]
            });
            await conversation.save();
            const newMessage = new MessageModel({   
                conversation: conversation._id,
                sender: senderId,
                message
            });
            await newMessage.save();
        }
        else {
            const newMessage = new MessageModel({
                conversation: conversation._id,
                sender: senderId,
                message
            });
            await newMessage.save();
        }
        res.status(200).json({ message: "Conversation retrieved successfully", success: true, conversation });
    } catch (error) {
        console.error("Error in addConversation route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await ConversationModel.find({
            members: { $in: [userId] }
        }).populate('members', '-password').sort({ createdAt: -1 });
        res.status(200).json({ message: "Conversations retrieved successfully", success: true, conversations });
    } catch (error) {
        console.error("Error in getConversations route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};