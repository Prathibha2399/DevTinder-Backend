const express = require('express');

const connectDB = require('../configarations/database');

const User = require('../models/user');

const app = express();

app.post('/user', async (req, res) => {
  /* this could also be written as 
    const userObj = {
        firstName:'Prajwal',
        lastName:'Kumar',
        email:'prajwalkumar@gmail.com',
        password:'prajwalkumar',
        });

        const user = new User(userObj); */

  // creating an instance of User data and storing them inside userObj
  const userObj = new User({
    firstName: 'Prajwal',
    lastName: 'Bhat',
    email: 'prajwalbhat854@gmail.com',
    password: 'prajwalASBhat',
  });

  // wrap inside try-catch to handle errors gracefully. if incase post req might not have sent the data, then error messages would be an warn prop instead of getting random error values.

  try {
    // save() again gives a promise obj, so handle using await async
    await userObj.save(); // to pass or save onto the dB

    // always send res back

    res.send('User data stored successfully!........');
  } catch (err) {
    res.status(400).send('Error in storing the data: ', err.message);
  }
});

connectDB()
  .then(() => {
    console.log('Connection established to MongoDB');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => console.error(error));

// here connection to db is established 1st, now if connection is established; then start the server
