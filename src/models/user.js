const mongoose = require('mongoose');


// this can also be written as import {Schema} =  mongoose; a destructuring way

//every schema is built as new instances....so define new keyword

const userSchema = new mongoose.Schema({   
    firstName:{
        type:String,    // shorthand wouldbe -> firstName:String
    },
    lastName: {
        type:String,
    },
    age:{
        type:Number,
    },
    email: {
        type:String,
    },
    password: {
        type:String,
    },
    phoneNo: {
        type:String,
    },
    gender: {
        type:String,
    },
});


// once schema is defined with required fields; now create the model; using mongoose model method
const User = mongoose.model('User', userSchema);

module.exports = User;    // it could also be written as module.exports = mongoose.model('User', userSchema); directly