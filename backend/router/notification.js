const router = require("express").Router();
const notificationControllers = require("../controllers/notifications");

router.get("/notification/:resiverId", notificationControllers.getNotification);
router.patch("/readNotification", notificationControllers.readNotification);

module.exports = router;
