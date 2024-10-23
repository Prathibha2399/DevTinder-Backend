// User Authentications

const express = require('express');
const {validateSignup} = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const authRouter = express.Router();

/* Sign-up route */
authRouter.post('/signup', async (req, res) => {
  try {
    validateSignup(req);

    const {
      firstName,
      lastName,
      email,
      password,
      phoneNo,
      age,
      gender,
      profile,
      about,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const userObj = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      phoneNo,
      age,
      gender,
      profile,
      about,
    });

    await userObj.save();

    res.send('User data stored successfully!........');
    // console.log(req.body);
  } catch (err) {
    res.status(400).send('Error in storing the data: ' + err.message);
  }
});


/* Login route */
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error('Invalid Credentials!....');
    }

    const passwordCheck = await user.validatePassword(password);

    if (passwordCheck) {
      // 1. create a JWT Token
      const token = await user.getjwtToken();

      res.cookie('token', token, {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        httpOnly: true,
      });

      res.send('Login Successfull!....');
    } else {
      throw new Error('Invalid Credentials!....');
    }
  } catch (err) {
    res.status(400).send('Error in login: ' + err.message);
  }
});


/* Logout Route */
authRouter.post('/logout' , (req,res) => {
  res.cookie("token", null, {expires: new Date(Date.now())}).send('Logged Out, Login to continue!...')
})


module.exports = authRouter;