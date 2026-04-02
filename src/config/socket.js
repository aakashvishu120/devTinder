const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("../models/message");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: { origin: "http://127.0.0.1:5173", credentials: true }
    });

    io.use((socket, next) => {
        // Auth via cookie
        const token = socket.handshake.auth.token;
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
            // Create consistent room ID for 2 users
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