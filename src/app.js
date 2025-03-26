const express = require("express");
const connectDB = require("./config/database");
const app= express();
const User = require("./models/user")

app.use(express.json());

app.post("/signup", async (req,res)=>{
    console.log(req.body);
    const user = new User(req.body);
    // const user = new User({
    //     firstName : "Aakash",
    //     lastName : "kumar",
    //     emailId : "fds",
    //     password : "vfdsac",
    // })

    try{
        //this function returns a promise
        await user.save();
        res.send("user added successfully");
    }
    catch (err){
        res.status(400).send("Error in saving the user : " + err.message);
    }
});

//find user by email
app.get("/user" , async (req,res)=>{
    const userEmail = req.body.emailId;
    try{
        // const user = await User.find({emailId : userEmail});
        // if(user.length === 0){
        //     res.status(404).send("user not found");
        // }
        // else{
        //     res.send(user);
        // }
        const user = await User.findOne({emailId : userEmail});
        // console.log(user);
        if(!user){
            res.status(404).send("user not found");
        }
        else{
            res.send(user);
        }
    }
    catch (err){
        res.status(400).send("something went wrong in email APi");
    }
})

//get all the user from the DB
app.get("/feed", async (req,res)=>{
    try{
        const users = await User.find({});
            res.send(users);
    }
    catch (err){
        res.status(400).send("something went wrong in feed API");
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


