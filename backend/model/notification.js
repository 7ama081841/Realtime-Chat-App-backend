const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notificationMessage: String,
    creaAt: { type: Date, default: Date.now() },
});

const Notification = mongoose.model("Notifications", NotificationSchema);

module.exports = Notification;
