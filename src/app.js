const express = require("express");
const connectDB = require("./config/database");
const app= express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

//axios doed not allow to set cookies in http so need whotlist
//this will whitelist the domain name so that browser can set cookie in application tab
app.use(cors({
    origin : "http://127.0.0.1:5173",
    credentials : true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);





connectDB().then(()=>{
    console.log("Database connected Successfully");
    // When the database is successfuly connected then only listen for request becuz api may contain some database operation
    app.listen(7777, ()=>{
        console.log("server is listening");
    });
}).catch(err=>{
    console.log("Database Not Connect");
});


