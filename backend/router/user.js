const router = require("express").Router();
const userControllers = require("../controllers/user");
const auth = require("../middlewares/auth");

router.get("/user", auth, userControllers.getusers);
router.patch("/addFriend/:resiverId", auth, userControllers.addFriend);
router.patch(
    "/cancelinvItation/:resiverId",
    auth,
    userControllers.cancelinvItation
);
router.patch("/acceptinvItation", auth, userControllers.acceptinvItation);

module.exports = router;
