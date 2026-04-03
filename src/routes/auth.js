const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3600000, // 1 hour in ms
};

authRouter.post("/signup", async (req, res) => {
    const { firstName, lastName, emailId, password } = req.body;
    try {
        validateSignUpData(req);
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        res.cookie("token", token, COOKIE_OPTIONS);
        res.json({ message: "user added successfully", data: savedUser });
    }
    catch (err) {
        res.status(400).send("Error in saving the user : " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("User not found with this emailId");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, COOKIE_OPTIONS);
            res.send(user);
        }
        else {
            res.status(401).send("Invalid Password");
        }
    }
    catch (err) {
        res.status(400).send("Error in login : " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.send("Logout SuccessFull !!!");
});

module.exports = authRouter;