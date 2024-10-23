const express = require('express');
const {userAuth} = require('../middlewares/auth');
const { validateProfileEdit, validatePasswordEdit } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const profileRouter = express.Router();

/* Get User's profile details */
profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
      const user = req.user;
  
      if (user) {
        res.send(user);
      } else {
        throw new Error('Bad credentials');
      }
    } catch (err) {
      res.status(400).send('Error in login: ' + err.message);
    }
  });


/* To edit Users profile details */
profileRouter.patch('/profile/edit', userAuth, async(req,res) => {
  try{
   if(!validateProfileEdit(req)){
    throw new Error("Profile edit failed!..." + err.message);
   }

   const loggedInUser = req.user;

  Object.keys(loggedInUser).forEach(key => loggedInUser[key] = req.body[key]);

  await loggedInUser.save();

  res.send(`${loggedInUser.firstName}, your profile is edited successfully!...`)
    
  }catch(err){
    res.status(400).send('Error in updating the profile; try again: ' + err.message);
  }

})


/* To edit password */
profileRouter.patch('/profile/edit/password', async(req,res) => {
  try{
    const userData = req.body;
    console.log(userData)
    if(!validatePasswordEdit(userData)){
      throw new Error("Invalid Password edit!..." + err.message);
    }

    console.log(userData.password);
    const newPassword = await bcrypt.hash(userData.password, 10);

    if(!newPassword){
      throw new Error("Password edit failed!..." + err.message);
    }

    const registeredUser = req.user;

    registeredUser[password] = newPassword;

    await registeredUser.save();

    res.send(`${registeredUser.firstName} your password is updated successfully!....`);  
   
  }catch(err){
    res.status(400).send("Error in changing password!.." + err.message)
  }
})


module.exports = profileRouter;