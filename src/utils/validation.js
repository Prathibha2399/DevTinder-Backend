const validator = require('validator');
const User = require('../models/user');

const validateSignup = (req) => {
    const {firstName, lastName, email, password} = req.body;    // js object extraction...i.e destructuring the obj body.

    // handled in schema level to but better to have one more check as utility functions.
    if(!firstName.length || !lastName.length){
        throw new Error ("Name required!....")
    }
    else if(firstName.length < 2 || firstName.length > 40){
        throw new Error ("Length exceeds the requirements!......")
    }
    else if(!validator.isEmail(email)){
        throw new Error ("Invalid email!......")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error ("Password is too weak!......")
    }

}


const validateProfileEdit = (req) => {
    const ALLOWED_EDITS = [
      'profile',
      'age',
      'gender',
      'phoneNo',
      'about',
      'skills',
    ]

    const isEditAllowed = Object.keys(req.body).every(keys => ALLOWED_EDITS.includes(keys));

    return isEditAllowed;
}


const validatePasswordEdit = async (data) => {
    const userData = data
    console.log(data)
    const isEmailExists = await User.findOne({email: userData.email});

    if(!isEmailExists){
      throw new Error('Email is not yet registered!...' + err.message);
    }

    if(!validator.isStrongPassword(userData.password)){
        throw new Error ("Password is too weak!......");
    }

    req.user = isEmailExists;
}


module.exports = {
    validateSignup,
    validateProfileEdit,
    validatePasswordEdit
}