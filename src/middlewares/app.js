const express = require('express');

const connectDB = require('../configarations/database');

const User = require('../models/user');

const app = express();

app.use(express.json()); // created a middleware so that all js req will be handled as json req.

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
  const userObj = new User(req.body);

  // wrap inside try-catch to handle errors gracefully. if incase post req might not have sent the data, then error messages would be an warn prop instead of getting random error values.

  try {
    // save() again gives a promise obj, so handle using await async
    await userObj.save(); // to pass or save onto the dB

    // always send res back

    res.send('User data stored successfully!........');
    console.log(req.body);
  } catch (err) {
    res.status(400).send('Error in storing the data: ', err.message);
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

    const user2 = await User.findOneAndDelete({firstName : userId}); // this can accept anything as a unique key. but key must match schema

    // console.log(user2);  //stores deleted entry
    res.send('Deleted successfully!.....');
  } catch (err) {
    res.status(500).send('Error in deleting the data: ');
  }
});


// update the user from existing database
app.patch('/user', async (req,res) => {
  //operations are similar to delete, like differnece b/w findOneAndUpdate for generalized way, and findByIdAndUpdate for perticual id unique key

  const userId = req.body.id;
  const data = req.body;    // unique keys not matching with dB schema will be neglected. eg, in schema i have key as _id but while calling i have used it as id key....so this will not replace.

  try{
    const user = await User.findOneAndUpdate({_id: userId}, data, {returnDocument: 'after'});  // this will now explicitly return after updating the filed.
    // console.log(user);  // bydefault it will return the entries of field/document before updating.
    res.send("Updated successfully!.....");
  }catch(err){
    res.status(400).send("Error in updating the data:", err.message);
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
