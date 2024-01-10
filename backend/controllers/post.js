const Post = require("../model/Post");

const addPost = async (req, res) => {
    try {
        const newPost = new Post({ ...req.body });

        if (req.file) {
            newPost.media = `http://localhost:5000/postPhotos/${req.file.filename}`;
        }

        await newPost.save();

        res.status(200).json({
            success: true,
            message: "successduly created",
            data: {
                post: newPost,
            },
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

const getPosts = async (req, res) => {
    try {
        const post = await Post.find();

        res.status(200).json({
            success: true,
            message: "successduly created",
            data: {
                post,
            },
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

const deletPost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.postId);

        res.status(200).json(deletedPost);
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    addPost,
    getPosts,
    deletPost,
};
