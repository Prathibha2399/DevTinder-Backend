const express = require('express');
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

// to get all requests received by the user
userRouter.get('/request/received',userAuth, async (req, res) => {
    // if loggedInUser is B then what ever the requests A->B C->B D->B and so on sends must be listed. 
  try {
    const loggedInUser = req.user;


    const allRequests = await ConnectionRequest.find({
        toId : loggedInUser,
        status: 'interested' // important to add this field else both pending as well as accepted or rejected all data will be populated. Here we want to check only requests received notifications, i.e still the pending requests
    }).populate('fromId' , 'firstName lastName age gender skills about profile')

    // Intension of joining through fromId is just a logic here, if toId means logged in user, then who has sent the requests will be in fromId, so with that we need to get details of the user.

    res.send(allRequests)
  } catch (err) {
    res.status(400).send('Failed to get the requests feed!....');
  }
});

module.exports = userRouter;
