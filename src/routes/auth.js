const express = require('express');
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation")
const User = require("../models/user")
const bcrypt = require("bcrypt");




authRouter.post("/signup", async (req,res)=>{
    const { firstName, lastName, emailId, password } = req.body;

    try{
    //validation of data
    validateSignUpData(req);

    //encrypt the password

    const passwordHash = await bcrypt.hash(password, 10);

    //creating a new instance of the User model
    const user = new User({
        firstName, 
        lastName, 
        emailId, 
        password : passwordHash
    });

        //this function returns a promise
        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        res.cookie("token", token);
        res.json({message : "user added successfully", data :savedUser });
    }
    catch (err){
        res.status(400).send("Error in saving the user : " + err.message);
    }
});

authRouter.post("/login", async (req,res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId : emailId});

        if(!user){
            throw new Error("User not found with this emailId");
        }

        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.validatePassword(password);


        if(isPasswordValid){
            //calling schemma method to get the JWT token
            const token = await user.getJWT();
            const option = {
                 httpOnly: true
            };

            
            //Add the token to cookies and send the response back to the user
            res.cookie("token", token);
            res.send(user);
        }
        else{
            res.status(401).send("Invalid Password");
        }

    }
    catch (err){
        res.status(400).send("Error in login : " + err.message);
    }
});

//we dont have to check that user is loggedIn or Auth
authRouter.post("/logout", async (req,res)=>{
    res.cookie("token", null , {
        expires: new Date(Date.now()),
    });
    res.send("Logout SuccessFull !!!");
});

module.exports = authRouter;