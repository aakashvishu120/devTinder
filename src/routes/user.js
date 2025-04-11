const express = require('express');
const { userAuth } = require('../middlewares/auth');
const connectionRequestModel = require('../models/connectionRequest');
const user = require('../models/user');
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
        res.status(400).send("Error : " + err.message);
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
        res.status(400).send("Error : " + err.message);
    }
});



userRouter.get("/feed", userAuth, async (req , res) => 
{
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1) * limit;

        
        //User should see all the user card except : 
        // 1 his own card
        // 2 His connection 
        // 3 Already ignored profile
        // 4 already sent the connection request
        
        //Find all connectionn request (sent + received) and these are those people who has exclude in feed
        const connectionRequest = await connectionRequestModel.find({
            $or : [
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        // console.log("hideUsersFromFeed" , hideUsersFromFeed);
        const users = await user.find({
            _id : {$nin : Array.from(hideUsersFromFeed)}
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({data : users});
    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }
});

module.exports = userRouter;
