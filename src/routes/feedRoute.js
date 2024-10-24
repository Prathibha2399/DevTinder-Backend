const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const feedRouter = express.Router();

const USERS_SAFE_DATA = 'firstName lastName age gender skills about profile';

// populate all the feeds
feedRouter.get('/user/feeds', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    /* PAGINATION */
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 1;
    limit = limit > 50 ? 50 : limit;

    const size = (page - 1) * limit;

    // avoid -> all connected, requested and oneselfs data.

    // 1. find all connected/ignored feeds of loggedIn users. logged in user can be sender or might be a receiver
    const connectedFeeds = await ConnectionRequest.find({
      $or: [{ fromId: loggedInUser._id }, { toId: loggedInUser._id }],
    });

    // 2. Since we got all the connections, now need to find the unique feeds, for ex A-> B A-> C B-> c so feeds would be like that... now data we got would be like this itself. So we need to filter in such a way that, unique values i.e A B C here should only be fetched.
    const hideFeeds = new Set();
    connectedFeeds.forEach((feed) => {
      hideFeeds.add(feed.fromId.toString());
      hideFeeds.add(feed.toId.toString());
    });

    // 3. now we will get the unique connected lists. So now filter out these feeds from the total remaining feeds.
    const usersFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideFeeds) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USERS_SAFE_DATA).size(size).limit(limit);

    if (!usersFeed) {
      throw new Error('Failed to display you feeds!....');
    }

    res.send(usersFeed);
  } catch (err) {
    res.status(500).json({ message: 'Error in displaying feeds!...' });
  }
});

module.exports = feedRouter;
