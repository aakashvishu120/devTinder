const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
    lastName: { type: String },
    emailId: { type: String, required: true, unique: true, lowercase: true, trim: true, 
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address : " + value);
            }
        }
     },
    password: { type: String, required: true, 
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password");
            }
        }
     },
    age: { type: Number, min: 18, max: 100 },
    gender: {
        type: String,
        enum : {
            values : ["male", "female",  "other"],
            message : `{VALUE} is not a valid gender type`
        },
        // validate(value) {
        //     if (!["male", "female", "others"].includes(value)) {
        //         throw new Error("Gender Data is not valid");
        //     }
        // }
    },
    photoUrl: { type: String, default: "https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg" , 
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo Url");
            }
        }
     },
    about: { type: String, default: "This is a default about of the user" },
    skills: { type: [String] }
},
    { timestamps: true }
);

//don't use arrow function here, because we need to access the user instance, this didn't work with arrow function
userSchema.methods.getJWT = async function () {
    const user = this; //this will refer to the user instance

    //creating a JWT token
    const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790", {expiresIn : "1h"});
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);