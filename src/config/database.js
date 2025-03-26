const mongoose = require('mongoose');

//this cluster will return promise use async await
const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://aakashvishu120:aakashvishu120@namastenode.iioqm.mongodb.net/devTinder");
};

module.exports = connectDB;

