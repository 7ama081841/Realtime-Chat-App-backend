const { boolean } = require("joi");
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notificationMessage: String,
    creaAt: { type: Date, default: Date.now() },
    isRead: { type: Boolean, default: false },
});

const Notification = mongoose.model("Notifications", NotificationSchema);

module.exports = Notification;
