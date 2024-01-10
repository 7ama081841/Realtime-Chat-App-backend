const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    media: String,
    like: [mongoose.Schema.Types.ObjectId],
    shear: [mongoose.Schema.Types.ObjectId],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            comment: String,
            like: [mongoose.Schema.Types.ObjectId],
            responseComment: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    comment: String,
                    like: [mongoose.Schema.Types.ObjectId],
                },
            ],
        },
    ],
    postedAtt: {
        type: Date,
        default: Date.now(),
    },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
