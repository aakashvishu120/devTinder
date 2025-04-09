const express = require("express");
const connectDB = require("./config/database");
const app= express();
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);




connectDB().then(()=>{
    console.log("Database connected Successfully");
    // When the database is successfuly connected then only listen for request becuz api may contain some database operation
    app.listen(7777, ()=>{
        console.log("server is listening");
    });
}).catch(err=>{
    console.log("Database Not Connect");
});


