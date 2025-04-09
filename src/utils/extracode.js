//find user by email
app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOne({emailId : userEmail});
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


//API to delete a user from the database
app.delete("/user", async (req,res) => {
    const userId = req.body.userId;
    try{ 
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted Successfully");
    }
    catch (err){
        res.status(400).send("something went wrong in Delete API");
    }
})

//API to update the user
app.patch("/user/:userId", async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;

    try{ 
        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender", 
            "age", 
            "skills"
        ];
    
        const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
    
        if(!isUpdateAllowed){
            throw new Error("Update not Allowed");
        } 

        if(data?.skills.length > 10){
            throw new Error("skills cannot be more than 10");
        }

        const user = await User.findByIdAndUpdate({_id : userId}, data , {runValidators : true});
        console.log(user);
        res.send("user updated Successfully");
    }
    catch (err){
        res.status(400).send("something went wrong in Update API "+ err.message);
    }
})
