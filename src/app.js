require("dotenv").config();
const express = require("express");
const http = require("http");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// ── CORS ──────────────────────────────────────────────────────
const corsOptions = {
    origin: function(origin, callback) {
        callback(null, origin);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Handle ALL preflight requests explicitly
app.options("*", cors(corsOptions));

// Manual CORS headers as backup on every response
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

// ── Middlewares ───────────────────────────────────────────────
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
        console.log("✅ Database connected successfully");

        // Initialize Socket.io after DB connects
        const initializeSocket = require("./config/socket");
        initializeSocket(server);

        server.listen(process.env.PORT || 7777, () => {
            console.log(`🚀 Server is listening on port ${process.env.PORT || 7777}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err.message);
        process.exit(1);
    });