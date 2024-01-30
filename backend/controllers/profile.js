const User = require("../model/User");

const getProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const profile = await User.findById(userId)
            .select("-__v -password")
            .populate("invitasions", "avatar email firstName lastName _id")
            .populate("frands", "avatar email firstName lastName _id")
            .populate("notifications", "avatar email firstName lastName _id")
            .populate("pindingFrands", "avatar email firstName lastName _id");

        res.status(200).json({
            success: true,
            message: "successduly geted",
            profile,
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = {
    getProfile,
};
