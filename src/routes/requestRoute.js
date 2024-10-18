const express = require('express')
const {userAuth} = require('../middlewares/auth')

const requestRoute = express.Router();

requestRoute.post('/sendRequest', userAuth, (req, res) => {
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
  });

module.exports = requestRoute;