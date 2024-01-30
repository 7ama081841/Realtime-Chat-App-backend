const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    age: String,
    avatar: { type: String, default: null },
    profilePhoto: { type: String, default: null },
    photos: [String],
    frands: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    pindingFrands: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    invitasions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    notifications: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            resiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            notificationMessage: String,
        },
    ],
    phoneNumber: { type: Number, default: null },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
