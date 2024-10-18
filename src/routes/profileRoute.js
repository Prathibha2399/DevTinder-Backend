const express = require('express');
const {userAuth} = require('../middlewares/auth')

const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {
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


module.exports = profileRouter;