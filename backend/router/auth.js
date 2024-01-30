const router = require("express").Router();
const userControllers = require("../controllers/auth");
const userUpload = require("../middlewares/userImege");

router.post("/user", userUpload.single("avatar"), userControllers.regesterUser);
router.post("/getuser", userControllers.loginUser);

module.exports = router;
