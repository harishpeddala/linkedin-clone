const CommentModel = require('../models/comment');
const PostModel = require('../models/post');
const NotificationModel = require('../models/notification');

exports.addComment = async (req, res) => {
    try {
        const { postId, comment } = req.body;
        let userId = req.user._id;
        const postExists = await PostModel.findById(postId).populate("user");
        if (!postExists) {
            return res.status(404).json({ error: "Post not found." });
        }
        postExists.comments = postExists.comments + 1;
        await postExists.save();
        const newComment = new CommentModel({
            user: userId,
            post: postId,
            comment
        });
        await newComment.save();
        const populatedComment = await CommentModel.findById(newComment._id).populate('user', 'f_name headline profilePic');
        const content = `${req.user.f_name} commented on your post.`;
        const newNotification = new NotificationModel({
            sender: req.user._id,
            receiver: postExists.user._id,
            content,
            type: 'comment',
            postId: postId.toString()
        });
        await newNotification.save();
        res.status(201).json({ message: "Comment added successfully", success: true, comment: populatedComment });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

exports.getCommentsByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        const isPostExist = await PostModel.findById(postId);
        if (!isPostExist) {
            return res.status(404).json({ error: "Post not found." });
        }
        const comments = await CommentModel.find({ post: postId }).populate('user', 'f_name headline profilePic');
        res.status(200).json({ message: "Comments fetched successfully", success: true, comments: comments });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};