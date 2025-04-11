const express = require('express');
const { userAuth } = require('../middlewares/auth');
const connectionRequestModel = require('../models/connectionRequest');
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

//get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req , res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequestModel.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId" , USER_SAFE_DATA);

        //no need to fetch for every id using forloop instead use mongoDb populate function, this function requires ref from other collection 

        res.json({message : "Data Fetch Successfully", data : connectionRequests});
    }
    catch (err){
        req.statusCode(400).send("Error : " + err.message);
    }
}); 


userRouter.get("/user/connections", userAuth, async (req , res) => 
{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequestModel.find({
            $or : [
                {toUserId : loggedInUser._id, status : "accepted"},
                {fromUserId : loggedInUser._id, status : "accepted"},
            ]
        }).populate("toUserId" , USER_SAFE_DATA).populate("fromUserId" , USER_SAFE_DATA);

        //remove data of loggedin user because i cannot friend of myself
        const combinedData = connectionRequests.map((row) => 
            {
                if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                    return row.toUserId;
                }
                return row.fromUserId;
            }
        );


        //this code is also correct
        // var combinedData = [];
        // if(connectionRequests[0]?.fromUserId){
        //     combinedData.push(connectionRequests[0].fromUserId);
        // }

        // if(connectionRequests[0]?.toUserId){
        //     combinedData.push(connectionRequests[0].toUserId);
        // }

        // //remove itself name because i am not a connection of myself
        // combinedData = combinedData.filter( value => !value._id.equals(loggedInUser._id ));

        
        res.json({message : "Conenctions Fetch Successfully", data : combinedData}); 

    }
    catch(err){
        req.statusCode(400).send("Error : " + err.message);
    }
});

module.exports = userRouter;
