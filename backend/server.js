const express = require("express");
const http = require("http");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { Server } = require("socket.io");
const { Socket } = require("dgram");
const { getNotification } = require("./controllers/notifications");

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
app.use("/api", require("./router/profile"));
app.use("/api", require("./router/user"));
app.use("/api", require("./router/notification"));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PATCH"],
    },
});

let users = [];

const addUsers = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({
            userId,
            socketId,
        });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const logoutUser = (userId) => {
    users = users.filter((user) => user.userId !== userId);
};

io.on("connection", (socket) => {
    socket.on("connected", (userId) => {
        addUsers(userId, socket.id);
        io.emit("onlineUsers", users);
        console.log("user connected", users);
    });

    socket.on("sendNotification", (notificationData) => {
        const fund_resiverId = users.find(
            (user) => user.userId === notificationData.resiverId
        );

        const fund_user = users.some(
            (user) => user.userId === notificationData.resiverId
        );

        fund_user && io.to(fund_resiverId.socketId).emit("getNotification");
    });

    socket.on("logoutUser", (userId) => {
        logoutUser(userId);
        io.emit("onlineUsers", users);
        console.log("User disconnected: ", users);
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("onlineUsers", users);
        console.log("User disconnected: ", users);
    });
});

server.listen(port, () =>
    console.log(" server is runing on http://localhost:" + port)
);
