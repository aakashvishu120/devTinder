const express = require("express");
const connectDB = require("./config/database");
const app= express();
const User = require("./models/user")


app.post("/signup", async (req,res)=>{
    const user = new User({
        firstName : "Aakash",
        lastName : "kumar",
        emailId : "fds",
        password : "vfdsac",
    })

    try{
        //this function returns a promise
        await user.save();
        res.send("user added successfully");
    }
    catch (err){
        res.status(400).send("Error in saving the user : " + err.message);
    }

});


connectDB().then(()=>{
    console.log("Database connected Successfully");
    // When the database is successfuly connected then only listen for request becuz api may contain some database operation
    app.listen(7777, ()=>{
        console.log("server is listening");
    });
}).catch(err=>{
    console.log("Database Not Connect");
});


