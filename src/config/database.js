const mongoose = require('mongoose');

//this cluster will return promise use async await
const connectDB = async () =>{
    await mongoose.connect(process.env.MONGODB_URI);
};

module.exports = connectDB;

