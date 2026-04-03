const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const { upload } = require("../config/cloudinary");

// ── View Profile ──────────────────────────────────────────────
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("Error in profile API : " + err.message);
    }
});

// ── Edit Profile ──────────────────────────────────────────────
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your Profile was Updated Successfully`,
            data: loggedInUser
        });
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

// ── Upload Profile Photo ──────────────────────────────────────
profileRouter.post(
    "/profile/upload-photo",
    userAuth,
    upload.single("photo"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const user = req.user;
            user.photoUrl = req.file.path; // Cloudinary URL
            await user.save();

            res.json({
                message: "Photo uploaded successfully",
                photoUrl: req.file.path
            });
        }
        catch (err) {
            res.status(400).send("Error uploading photo: " + err.message);
        }
    }
);

module.exports = profileRouter;