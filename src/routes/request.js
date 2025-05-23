const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");



requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status =  req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "Invalid Status Type " + status})
        }

        //toUserId must be present in Db
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({ message : "User not Exist"});
        }

        //1st condition : if there is an existing connectionRequest
        //2nd condition : prevent deadlock -> if A sent friend req B then B wont sent friend req to A, B only has the choice to accept or reject
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                { fromUserId, toUserId },
                { fromUserId : toUserId , toUserId : fromUserId}
            ]
        });

        if(existingConnectionRequest){
            return res.status(400).send({message : "Connection Request Already Exists !!"});
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message : req.user.firstName + " is "+ status + " in " + toUser.firstName,
            data
        })
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId" , userAuth , async (req, res) => {
    try{ 
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        //validate the status
        const allowedStatus = ["accepted" , "rejected"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "Status not allowed !!"});
        }

        //requestID should be present in DB
        //loggedInId = toUserId
        //status = interested
        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested"
        });

        if(!connectionRequest){
            return res.status(400).json({message : "Connection request not found !!"});
        }

        //modifying the status A/c to the request params
        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({message : "Connection request " + status , data});
        


    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }

});

module.exports = requestRouter;
