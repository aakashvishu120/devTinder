const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");




//to read the cookies we need to use cookie-parser middleware
//before entering in this route userAuth middleware will be called first
profileRouter.get("/profile" ,userAuth , async (req,res)=>{

    try{
        const user = req.user;
        res.send(user);
    }
    catch (err){
        res.status(400).send("Error in profile API : " + err.message);
    }
   
});

module.exports = profileRouter;