const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRoute = express.Router();

/* requestRoute.post('/sendRequest', userAuth, (req, res) => {
    try {
      const user = req.user;
      if (user) {
        const { firstName } = user;
  
        res.send(`${firstName} sent a connection request!....`);
      } else {
        throw new Error('Invalid Login!.....');
      }
    } catch (err) {
      res.status(404).send('Invalid request' + err.message);
    }
  }); */

/* Interested or ignored connection request */
requestRoute.post(
  '/request/send/:status/:userId',
  userAuth,
  async (req, res) => {
    try {
      // userAuth for user's authentication
      const fromId = req.user._id;
      const toId = req.params.userId;
      const status = req.params.status;

      const requestFrom = await User.findById(fromId);
      const requestTo = await User.findById(toId);

      // case 1. since its a request action either interested/ignored status must come, though we have schema level validation check for the status, there are 2 more actions which is not feasible for this operation...
      const allowedActions = ['interested', 'ignored'];
      if (!allowedActions) {
        return res.status(400).send('Invalid requests!....'); // can also through error instead. no mandate to have res.send. if this is used add 'RETURN' keyword.
      }

      // case 2. check whether the to address is there in the database,
      if (!requestTo) {
        res.status(400).json({
          message: 'Request action failed, user is not available!....',
        });
      }

      // case 3. dont allow multiple requests, for example A sends the request to B, then its similar or makes no sence to B to send again the request back. so once the actions are done, dont allow same actions to take place.
      const connectionExists = await ConnectionRequest.findOne({
        // allows both the checks here, and queries for truthy value
        $or: [
          { fromId, toId },
          { fromId: toId, toId: fromId },
        ],
      });

      /* // case 4. one cannot send the request to oneself
      if(fromId == toId){
        res.status(400).send("Can't create connection request!...")
      } */
      // this is valid one, but i have created as pre schema method. creating like that is not a mandate action.

      if (connectionExists) {
        return res.status(400).json({
          message: `${requestTo.firstName} is already your connection!...`,
        });
      }

      const connectRequest = new ConnectionRequest({
        fromId,
        toId,
        status,
      });

      const data = await connectRequest.save();

      res.json({
        message: `Connection request from ${requestFrom.firstName} to ${
          requestTo.firstName
        } is ${status == 'interested' ? 'sent' : 'ignored'}!...`,
        data,
      });
    } catch (err) {
      res.status(404).send('Invalid request' + err.message);
    }
  }
);

/* Accept or reject connection request */
requestRoute.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  //these actions are from users logged in, if A has sent request to B then B if logged in can accept or reject.
  try {
    const loggedInUser = req.user;
    const { status, requestId } =
      req.params; /* similar to const status = req.params.status.. */

      // check only accept or reject status is coming
      const allowedActions = ['accepted', 'rejected'];
      if(!allowedActions.includes(status)){
        return res.status(400).json({message: "Invalid request action!...."})
      }

     /* case.1. Check whether loggedIn user is same as req send to sender, 
     2. to accept or reject the request 1st sender must have INTERESTED status*/
     const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,  // which is created as _id when request is sent to this user,
      toId: loggedInUser._id,
      status: "interested"
     });

    //  console.log(connectionRequest)

     if(!connectionRequest){
      return res.status(404).json({message: "Connection request not found!"})
     }

     // else now if request is available then users option is to accept / reject, in other words user now can change the status stored.

     connectionRequest.status = status;

     const data = await connectionRequest.save();

     res.json({message: `Connection Established!....`, data});
    

  } catch (err) {
    res.status(400).send('Error in saving the status!....' + err.message);
  }
});

module.exports = requestRoute;
