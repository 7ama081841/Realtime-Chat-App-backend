const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

dotenv.config();

app.use(bodyParser.json());
app.use(express.json());
app.use(
    cors({
        origin: true,
        methods: ["GET", "POST", "DELETE", "PATCH"],
        credentials: true,
    })
);

const port = 5000;

try {
    mongoose.connect(process.env.MONGODB);
    console.log("connected to db");
} catch (err) {
    console.log("error to connect");
}

app.use(
    "/userPhotos",
    express.static(path.join(__dirname, "uploads/userPhotos"))
);

app.use(
    "/postPhotos",
    express.static(path.join(__dirname, "uploads/postPhotos"))
);

app.use("/api", require("./router/auth"));
app.use("/api", require("./router/post"));

app.listen(port, () =>
    console.log(" server is runing on http://localhost" + port)
);
