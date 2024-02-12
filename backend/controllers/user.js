const User = require("../model/User");
const Notification = require("../model/notification");

const getusers = async (req, res) => {
    const { userId } = req.params;

    try {
        const OneUser = await User.findById(userId);

        const allUsers = await User.find().select("-password -__v ");

        const filteredUsers = allUsers.filter((user) => {
            const isFriend =
                OneUser.frands && OneUser.frands.includes(user._id);
            const isInvited =
                OneUser.invitations && OneUser.invitations.includes(user._id);

            const isCurrentUser =
                OneUser._id.toString() === user._id.toString();

            return !isFriend && !isInvited && !isCurrentUser;
        });

        res.status(200).json({
            success: true,
            message: "successduly geted",
            users: filteredUsers,
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

    try {
        const sender = await User.findByIdAndUpdate(
            senderId,
            {
                $pull: { invitasions: resiverId },
                $push: { frands: resiverId },
            },
            { new: true }
        ).exec();

        const resiver = await User.findByIdAndUpdate(
            resiverId,
            {
                $pull: { pindingFrands: senderId },
                $push: { frands: senderId },
            },
            { new: true }
        ).exec();

        const newNotification = new Notification({
            sender: senderId,
            resiver: resiverId,
            notificationMessage: "accepted your invitation ",
        });

        await newNotification.save();

        res.status(200).send("accept a Friend");
    } catch (err) {
        console.log(err);
    }
};

const rejectInvitation = async (req, res) => {
    const { senderId, resiverId } = req.body;

    try {
        const sender = await User.findByIdAndUpdate(
            senderId,
            {
                $pull: { invitasions: resiverId },
            },
            { new: true }
        ).exec();

        const resiver = await User.findByIdAndUpdate(
            resiverId,
            {
                $pull: { pindingFrands: senderId },
            },
            { new: true }
        ).exec();

        const newNotification = new Notification({
            sender: senderId,
            resiver: resiverId,
            notificationMessage: "rejected your invitation ",
        });

        await newNotification.save();

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
    rejectInvitation,
};
