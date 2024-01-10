const router = require("express").Router();
const postControllers = require("../controllers/post");
const postUpload = require("../middlewares/postImage");
const auth = require("../middlewares/auth");

router.post(
    "/post",
    [auth, postUpload.single("media")],
    postControllers.addPost
);

router.get("/post", auth, postControllers.getPosts);

router.delete("/post/:postId", auth, postControllers.deletPost);

module.exports = router;
