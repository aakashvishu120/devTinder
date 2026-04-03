const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("../models/message");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            // origin: function(origin, callback) {
            //     callback(null, origin); // mirror back whatever origin
            // },
            origin: "http://localhost:5173",   //Dynamic origin can break cookies in some cases
            credentials: true,
            methods: ["GET", "POST"],
        }
    });

    io.use((socket, next) => {
        // const token = socket.handshake.auth.token;
        // if (!token) return next(new Error("Unauthorized"));
        
        const cookie = socket.handshake.headers.cookie || "";
        const token = cookie.split("token=")[1]?.split(";")[0];
        if (!token) return next(new Error("Unauthorized"));
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded._id;
            next();
        } catch {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        socket.on("joinRoom", (targetUserId) => {
            const roomId = [socket.userId, targetUserId].sort().join("_");
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({ targetUserId, text }) => {
            const roomId = [socket.userId, targetUserId].sort().join("_");
            const message = await Message.create({
                senderId: socket.userId,
                receiverId: targetUserId,
                text
            });
            io.to(roomId).emit("receiveMessage", message);
        });

        socket.on("disconnect", () => {});
    });
};

module.exports = initializeSocket;