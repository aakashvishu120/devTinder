require("dotenv").config();
const express = require("express");
const http = require("http");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const initializeSocket = require("./config/socket");

const app = express();
const server = http.createServer(app);

// ── Initialize Socket.io ──────────────────────────────────────
initializeSocket(server);

// ── Middlewares ───────────────────────────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://127.0.0.1:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────
const authRouter    = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter    = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// ── Connect DB then start server ──────────────────────────────
connectDB()
    .then(() => {
        console.log("Database connected successfully");
        server.listen(process.env.PORT || 7777, () => {
            console.log(`🚀 Server is listening on port ${process.env.PORT || 7777}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    });