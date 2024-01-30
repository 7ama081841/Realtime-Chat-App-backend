const User = require("../model/User");
const Notification = require("../model/notification");

const getusers = async (req, res) => {
    try {
        const users = await User.find().select("-password -__v ");

        res.status(200).json({
            success: true,
            message: "successduly geted",
            users,
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

const addFriend = async (req, res) => {
    const { resiverId } = req.params;
    const { senderId } = req.body;

    try {
        const resiverFind = await User.findByIdAndUpdate(
            resiverId,
            {
                $push: { invitasions: senderId },
            },
            {
                new: true,
            }
        );

        const newNotification = new Notification({
            sender: senderId,
            resiver: resiverId,
            notificationMessage: "sended invitasion to you",
        });

        await newNotification.save();

        const senderUser = await User.findByIdAndUpdate(
            senderId,
            {
                $push: { pindingFrands: resiverId },
            },
            {
                new: true,
            }
        )
            .select(" -__v -password")
            .populate("pindingFrands", "_id");

        res.status(200).json(senderUser);
    } catch (err) {
        console.log(err);
    }
};

const cancelinvItation = async (req, res) => {
    const { resiverId } = req.params;
    const { senderId } = req.body;

    try {
        const resiverFind = await User.findByIdAndUpdate(
            resiverId,
            {
                $pull: { invitasions: senderId },
            },
            {
                new: true,
            }
        );

        const deleteNotification = await Notification.findOneAndDelete(
            {
                sender: senderId,
                resiver: resiverId,
                notificationMessage: "sended invitasion to you",
            },
            { new: true }
        );

        const senderUser = await User.findByIdAndUpdate(
            senderId,
            {
                $pull: { pindingFrands: resiverId },
            },
            {
                new: true,
            }
        )
            .select(" -__v -password")
            .populate("pindingFrands", "_id");

        res.status(200).json(senderUser);
    } catch (err) {
        console.log(err);
    }
};

const acceptinvItation = async (req, res) => {
    const { senderId, resiverId } = req.body;

    console.log({ senderId, resiverId });
    try {
        const sender = await User.findByIdAndUpdate(
            senderId,
            {
                $pull: { invitasions: resiverId },
                $push: { frands: resiverId },
            },
            { new: true }
        ).exec();

        console.log(sender);
        res.status(200).send("accept a Friend");
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    getusers,
    addFriend,
    cancelinvItation,
    acceptinvItation,
};
