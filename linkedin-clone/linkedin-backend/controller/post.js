const PostModel = require("../models/post");

exports.addPost = async (req, res) => {
    try {
        const { desc, imageLink } = req.body;
        let userId = req.user._id;
        const newPost = new PostModel({
            user: userId,
            desc,
            imageLink
        });
        if (!newPost) {
            return res.status(400).json({ error: "Post data is required." });
        }
        await newPost.save();
        res.status(201).json({ message: "Post created successfully", success: true, data: newPost });
    }
    catch (error) {
        console.error("Error in addPost route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

exports.likeDislikePost = async (req, res) => {
    try {
        const { postId } = req.body;
        let userId = req.user._id;
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found." });
        }
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            post.likes.pull(userId);
            await post.save();
            return res.status(200).json({ message: "Post disliked successfully", success: true, data: post });
        }
        post.likes.push(userId);
        await post.save();
        res.status(200).json({ message: "Post liked successfully", success: true, data: post });
    }
    catch (error) {
        console.error("Error in likeDislikePost route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};


exports.getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user', 'f_name headline profilePic').sort({ createdAt: -1 });
        res.status(200).json({ message: "Posts retrieved successfully", success: true, data: posts });
    }
    catch (error) {
        console.error("Error in getAllPosts route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await PostModel.findById(id).populate('user');
        if (!post) {
            return res.status(404).json({ error: "Post not found." });
        }
        res.status(200).json({ message: "Post retrieved successfully", success: true, data: post });
    }
    catch (error) {
        console.error("Error in getPostById route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

exports.getTop5Posts = async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await PostModel.find({ user: id }).sort({ createdAt: -1 }).limit(5).populate('user');
        res.status(200).json({ message: "Top 5 posts retrieved successfully", success: true, data: posts });
    }
    catch (error) {
        console.error("Error in getTop5Posts route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await PostModel.find({ user: id }).sort({ createdAt: -1 }).populate('user');
        res.status(200).json({ message: "User posts retrieved successfully", success: true, data: posts });
    }
    catch (error) {
        console.error("Error in getUserPosts route:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};