const multer = require("multer");
const path = require("path");

const postUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, "../uploads/postPhotos/"));
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    }),
});

module.exports = postUpload;
