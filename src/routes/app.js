const express = require('express');

const connectDB = require('../configarations/database');

const User = require('../models/user');

const { validations } = require('../utils/validation');

const bcrypt = require('bcrypt');

const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');

const {userAuth} = require('../middlewares/auth')

const app = express();

app.use(express.json()); // created a middleware so that all js req will be handled as json req.

app.use(cookieParser()); // middleware to read the cookies.

app.post('/signup', async (req, res) => {
  /* this could also be written as 
    const userObj = {
        firstName:'Prajwal',
        lastName:'Kumar',
        email:'prajwalkumar@gmail.com',
        password:'prajwalkumar',
        });

        const user = new User(userObj); */

  // creating an instance of User data and storing them inside userObj
  /* const userObj = new User({
    firstName: 'Prajwal',
    lastName: 'Bhat',
    email: 'prajwalbhat854@gmail.com',
    password: 'prajwalASBhat',
  }); */

  // Since json is handled, -> to make req more dynamic;

  // once the user hits sign-up api, 1st thing is to validate the request. Then encrypt the password later store the data into dB.

  // wrap inside try-catch to handle errors gracefully. if incase post req might not have sent the data, then error messages would be an warn prop instead of getting random error values.

  try {
    validations(req);

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

    // const userObj = new User(req.body);  // but this is bad way of creating the instances so do like the one in the above.

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
    // save() again gives a promise obj, so handle using await async
    await userObj.save(); // to pass or save onto the dB

    // always send res back

    res.send('User data stored successfully!........');
    // console.log(req.body);
  } catch (err) {
    res.status(400).send('Error in storing the data: ' + err.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    // validations(req);

    const { email, password } = req.body;

    // console.log(email, password);

    //check whether email is registered or not
    const user = await User.findOne({ email: email }); // findOne or find anything can work here as it would return one entry since we have given unique validations under schema.

    if (!user) {
      throw new Error('Invalid Credentials!....'); // never expose too much info abt validations.
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    // const passwordCheck = await bcrypt.compare(password, user[0].password); if find() is used as results would be in array of obj format.

    // To provide Authentications, when user is there and logged in
    if (passwordCheck) {
      // 1. create a JWT Token
      const token = await jwt.sign({_id: user._id}, 'DEV@Tinder#my'); //here hiding my userid(unique) under the token, which later will be retrived.

      // 2. create a cookie for the token. (<cookie name; here wrapper of token>, <token value>)
      // res.cookie("token", 'esdrftyuiokjhgfdsxdcfvgbhnjkmkjhgfd');
      res.cookie('token', token);

      res.send('Login Successfull!....');
    } else {
      throw new Error('Invalid Credentials!....');
    }
  } catch (err) {
    res.status(400).send('Error in login: ' + err.message);
  }
});

app.get('/profile', userAuth, async (req, res) => {
  try {
    /* // check whether cookie => token is present or not
    const { token } = req.cookies; // cookies are created once logged in and sent back to browsers. now upon every req, cookies needs to be checked. // destructure by name as passed while creating cookies with name.

    if (token) {
      // verify the token => destructure/ retrive key
      const decodejwt = await jwt.verify(token , 'DEV@Tinder#my') // secrete key passed

      // console.log(decodejwt) this has data of hidden field passed

      // destruct the hidden field, here user's id (std practice)
      const {_id} = decodejwt;

      const profileData = await User.findById(_id);

      if(profileData){
        res.send(profileData);
      }else{
        throw new Error("Bad credentials");
      }
    } else {
      throw new Error('Tokens not available!....');
    } */


      // Since Auth middleware is created, now we can use it directly
      const user = req.user;

      if(user){
        res.send(user);
      }else{
        throw new Error("Bad credentials");
      }
  } catch (err) {
    res.status(400).send('Error in login: ' + err.message);
  }
});

// get perticular user data, eg: user whose email matches to prajwalbhat854@gmail.com
app.get('/user', async (req, res) => {
  const userData = req.body.eid; // i would be requesting for... must match req object key. not necessarly schemas key.....

  // wrap inside try-catch to handle errors, also this returns a promise object.
  try {
    const user = await User.find({ email: userData }); // can also be written as User.find({email: req.body.email}). must match schema's key
    if (user) {
      res.send(user);
    } else {
      res.status(404).send('Error in fetching user data');
    }
  } catch (err) {
    res.status(400).send('Error in fetching the data: ', err.message);
  }
});

// get all data from the database
app.get('/feeds', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send('Error in fetching the data: ', err.message);
  }
});

// delete the user from the database
app.delete('/user', async (req, res) => {
  // to delete any entries, first we need a unique key associated it could be _id or email or name itself. based on these data it would delete all the entries which matches the key...

  const userId = req.body.id; // matches with the id name key passed inside body of req...
  // console.log(userId)

  try {
    //must pass id itself as parameter as its for id query
    //const user = await User.findByIdAndDelete({_id:userId}); // findByIdAndDelete is shorthand of findOneAndDelete({_id:userId})

    //const user = await User.findOneAndDelete(userId); // this can accept anything, since key is not passed as per schema, it will delete 1st entry

    const user2 = await User.findOneAndDelete({ firstName: userId }); // this can accept anything as a unique key. but key must match schema

    // console.log(user2);  //stores deleted entry
    res.send('Deleted successfully!.....');
  } catch (err) {
    res.status(500).send('Error in deleting the data: ');
  }
});

// update the user from existing database
app.patch('/user/:userId', async (req, res) => {
  //operations are similar to delete, like differnece b/w findOneAndUpdate for generalized way, and findByIdAndUpdate for perticual id unique key

  //const userId = req.body.id;  // best practice of fetching userId is from params
  const userId = req.params?.userId;
  const data = req.body; // unique keys not matching with dB schema will be neglected. eg, in schema i have key as _id but while calling i have used it as id key....so this will not replace.

  try {
    // API level Data validations
    const ALLOWED_UPDATES = [
      'profile',
      'age',
      'gender',
      'password',
      'phoneNo',
      'about',
      'skills',
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error('Updates not allowed!......');
    }
    if (data.skills.length > 10) {
      throw new Error('Skills cannot be more than 10......');
    }
    const user = await User.findOneAndUpdate({ _id: userId }, data, {
      returnDocument: 'after',
      runValidators: true,
    }); // this will now explicitly return after updating the filed.
    // console.log(user);  // bydefault it will return the entries of field/document before updating.
    res.send('Updated successfully!.....');
  } catch (err) {
    res.status(400).send('Error in updating the data:' + err.message);
  }
});

// Sending the connection request
app.post('/sendRequest' ,userAuth, (req,res) => {
try{
// userAuth would have given perticular user who has logged in

const user = req.user;
if(user){
  const {firstName} = user;

  res.send(`${firstName} sent a connection request!....`);

}else{
  throw new Error("Invalid Login!.....")
}

}catch(err){
  res.status(404).send("Invalid request" + err.message)
}
})

connectDB()
  .then(() => {
    console.log('Connection established to MongoDB');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => console.error(error));

// here connection to db is established 1st, now if connection is established; then start the server
