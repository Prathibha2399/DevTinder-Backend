const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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


/*--------------------------------------------------------------------*/
//practice => to create SCHEMA METHODS

userSchema.methods.getjwtToken = async function () {
  const user = this; // this is not associated arrow func
  const token = await jwt.sign({ _id: user._id }, 'DEV@Tinder#my', {
    expiresIn: '1d',
  });
  return token;
};


userSchema.methods.validatePassword = async function(passwordInput){
  const user = this;
  const isPasswordValid = await bcrypt.compare(passwordInput ,user.password);

  return isPasswordValid;
}


/*--------------------------------------------------------------------*/

// once schema is defined with required fields; now create the model; using mongoose model method.....(<model name>, <schema created as name>)
const User = mongoose.model('User', userSchema);

module.exports = User; // it could also be written as module.exports = mongoose.model('User', userSchema); directly









/*--------------------------------------------------------------------*/
// by default strict mode for schema will be true, hence it will not allow additional fields which are requested through URL and when schema fields are not defined; to be updated/ appended onto database.
// to allow additional fields to be updated/ appended onto database, set strict mode to false
/* const userSchema = new mongoose.Schema({...},{
strict: false;
}) */

// Or this can also be done at api query level ;
// await userObj.save({strict:false})
