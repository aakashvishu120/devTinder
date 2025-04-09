const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation")



//to read the cookies we need to use cookie-parser middleware
//before entering in this route userAuth middleware will be called first
profileRouter.get("/profile/view" ,userAuth , async (req,res)=>{

    try{
        const user = req.user;
        res.send(user);
    }
    catch (err){
        res.status(400).send("Error in profile API : " + err.message);
    }
   
});


profileRouter.patch("/profile/edit" ,userAuth , async (req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();

        // res.send(`${loggedInUser.firstName} , your Profile was Updated SuccessFully`);

        res.json({
            message : `${loggedInUser.firstName} , your Profile was Updated SuccessFully`,
            data : loggedInUser
        });
    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }
});

module.exports = profileRouter;