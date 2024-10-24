const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

const USERS_SAFE_DATA = 'firstName lastName age gender skills about profile';

// to get all requests received by the user
userRouter.get('/user/request/received', userAuth, async (req, res) => {
  // if loggedInUser is B then what ever the requests A->B C->B D->B and so on sends must be listed.
  try {
    const loggedInUser = req.user;

    const allRequests = await ConnectionRequest.find({
      toId: loggedInUser,
      status: 'interested', // important to add this field else both pending as well as accepted or rejected all data will be populated. Here we want to check only requests received notifications, i.e still the pending requests
    }).populate('fromId', 'firstName lastName age gender skills about profile');

    // Intension of joining through fromId is just a logic here, if toId means logged in user, then who has sent the requests will be in fromId, so with that we need to get details of the user.

    res.send(allRequests);
  } catch (err) {
    res.status(400).send('Failed to get the requests feed!....');
  }
});

// To get all connected users
userRouter.get('/user/connection', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    /* consider the case A->B and B->C  A has sent connction to B and its accepted similarly B to C has also been accepted. Now if LoggedIn user is B then both A and C will be in his connected lists, so here he is sometimes as from and sometimes as to; hence need to check both the cases */
    const allConnected = await ConnectionRequest.find({
      /* $and: [
                {
                    $or: [
                        {fromId: loggedInUser._id},
                        {toId: loggedInUser._id}
                    ]
                },{status: 'accepted'}
            ] */

      $or: [
        { toId: loggedInUser._id, status: 'accepted' },
        { fromId: loggedInUser._id, status: 'accepted' },
      ],
    }).populate('fromId', USERS_SAFE_DATA).populate("toId", USERS_SAFE_DATA);

   /*  res.send(allConnected); */ // this will give along with fromuser data to all other datas.

    //in order to get only from users data
    const data = allConnected.map(row => {
        if(row.fromId._id.toString() === loggedInUser._id.toString()){
            return row.toId;
        }
        return row.fromId;
    });

        res.json({data})
  } catch (err) {
    res
      .status(400)
      .send(
        'Error in fetching all the connections! try again!.....' + err.message
      );
  }
});
module.exports = userRouter;
