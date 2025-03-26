const express = require("express");
const app= express();

app.get("/user", (req,res)=>{
    res.send({firstName: "Aakash" , LastName : "Kumar"});
})

app.post("/user", (req,res)=>{
    console.log("save data to the database");
    res.send("Data saved successfully");
})

app.delete("/user", (req,res)=>{
    res.send("Data delete successfully");
})

//use match all the http method APi call to /hello
// app.use("/hello",(req,res)=>{
//     res.send("hello hello hello");
// });

// app.use("/test",(req,res)=>{
//     res.send("hello from the test");
// });

// //sequences of route matter, place this route always at the end else it will override other route
// app.use("/",(req,res)=>{
//     res.send("hello from the dashboard");
// });

app.listen(7777, ()=>{
    console.log("server is listening");
});