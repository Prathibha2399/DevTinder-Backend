const mongoose = require('mongoose');
const validator = require('validator');

// this can also be written as import {Schema} =  mongoose; a destructuring way

//every schema is built as new instances....so define new keyword

//Schema or model level validations;
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String, // shorthand wouldbe -> firstName:String
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
      maxLength: 20,
    },
    age: {
      type: Number,
      min: 18,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // db level validator library
      validate(v) {
        if (!validator.isEmail(v)) {
          throw new Error('Incorrect e-mail');
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(v) {
        if (!validator.isStrongPassword(v)) {
          throw new Error('Password is too weak');
        }
      },
      // can also pass options -> if(!validator.isStrongPassword(v, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}))
    },
    phoneNo: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      validate(v) {
        if (!['male', 'female', 'others'].includes(v)) {
          throw new Error('Invalid gender');
        }
      },
      // when custom validations are applied, change the options under patch requests.
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: 'Passionate Developer looking for great connections...',
    },
    profile: {
      type: String,
      default: 'https://www.pngall.com/profile-png/',
      validate(v) {
        if (!validator.isURL(v)) {
          throw new Error('Invalid URL');
        }
      },
    },
  },
  {
    timestamps: true, // to add created and updated timestamps automatically
  }
);

// once schema is defined with required fields; now create the model; using mongoose model method
const User = mongoose.model('User', userSchema);

module.exports = User; // it could also be written as module.exports = mongoose.model('User', userSchema); directly
