const express = require("express");
const connectDB = require("./config/database");
const app= express();
const User = require("./models/user")
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
var jwt = require('jsonwebtoken');
const {userAuth} = require("./middlewares/auth");


app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res)=>{
    console.log(req.body);
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
        await user.save();
        res.send("user added successfully");
    }
    catch (err){
        res.status(400).send("Error in saving the user : " + err.message);
    }
});

app.post("/login", async (req,res)=>{
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
            
            //Add the token to cookies and send the response back to the user
            res.cookie("token", token);
            res.send("Login Successfull");
        }
        else{
            res.status(401).send("Invalid Password");
        }

    }
    catch (err){
        res.status(400).send("Error in login API : " + err.message);
    }
});

//to read the cookies we need to use cookie-parser middleware
//before entering in this route userAuth middleware will be called first
app.get("/profile" ,userAuth , async (req,res)=>{

    try{
        const user = req.user;
        res.send(user);
    }
    catch (err){
        res.status(400).send("Error in profile API : " + err.message);
    }
   
});



app.post("/sendConnectionRequest", userAuth ,async (req,res)=> {
    const user = req.user;
        console.log("sending a connectioin request");
        res.send(user.firstName + " sent the connection request");
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


