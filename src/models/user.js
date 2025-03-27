const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
    lastName: { type: String },
    emailId: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    age: { type: Number, min: 18, max: 100 },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender Data is not valid");
            }
        }
    },
    photoUrl: { type: String, default: "https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg" },
    about: { type: String, default: "This is a default about of the user" },
    skills: { type: [String] }
},
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);