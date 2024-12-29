const express = require("express");
const app= express();


app.use("/hello",(req,res)=>{
    res.send("hello hello hello");
});

app.use("/test",(req,res)=>{
    res.send("hello from the test");
});

app.use("/",(req,res)=>{
    res.send("hello from the dashboard");
});

app.listen(3000, ()=>{
    console.log("server is listening");
});