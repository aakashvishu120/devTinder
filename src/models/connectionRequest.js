const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User", //reference to the usercollection
            required : true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        status: {
            type: String,
            required : true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`
            }
        }
    },
    {
        timestamps: true
    }
);


//compound(multiple field combined) index will make query fast and 1 means ascending oreer
connectionRequestSchema.index({fromUserId : 1, toUserId : 1});



//in order to write pre function avoid arrow function 
//called just before save() function of mongoose
//this is just like middle therefore at the send of function call next
connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this;

    //check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
    next();
})

const connectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = connectionRequestModel;