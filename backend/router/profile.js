const router = require("express").Router();
const profileControllers = require("../controllers/profile");
const auth = require("../middlewares/auth");

router.get("/profile/:userId", auth, profileControllers.getProfile);
// router.patch("/pfofile/:userId");

module.exports = router;
