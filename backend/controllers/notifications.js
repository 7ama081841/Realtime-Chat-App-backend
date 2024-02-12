const Notification = require("../model/notification");

const getNotification = async (req, res) => {
    const { resiverId } = req.params;

    try {
        const allNotifications = await Notification.find({
            resiver: resiverId,
        })
            .populate("sender", "avatar firstName lastName -_id ")
            .select("-__v")
            .sort({
                creaAt: -1,
            });

        res.status(200).json(allNotifications);
    } catch (err) {
        console.log(err);
    }
};

const readNotification = async (req, res) => {
    const { notificationId } = req.body;

    try {
        const readNotif = await Notification.findByIdAndUpdate(notificationId, {
            $set: { isRead: true },
        });

        res.status(200).send("updated successfuly ");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const deleteNotification = async () => {
    const handleDate = (date) => {
        const formatDate = new Date(date);
        const dateNow = new Date();
        const diffDate = dateNow - formatDate;

        const days = Math.floor(diffDate / (1000 * 60 * 60 * 24));

        const weeks = Math.floor(days / 7);

        return weeks;
    };
    try {
        const notifications = await Notification.find();

        notifications.map(
            async (item) =>
                handleDate(item.creaAt) > 5 &&
                (await Notification.findByIdAndDelete(item._id))
        );
    } catch (error) {
        console.log(error);
    }
};

setInterval(() => {
    deleteNotification();
}, 1000 * 60 * 60 * 24);

module.exports = {
    getNotification,
    readNotification,
};
