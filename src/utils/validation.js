const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName){
        throw new Error("First Name and Last Name are required");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not Valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not Strong");
    }
};

module.exports = {
    validateSignUpData
};