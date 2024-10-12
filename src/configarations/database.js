const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://prathibha230499:dgtXnGro0tg7ObIw@cluster0.dgvnk.mongodb.net/');    // this will connect to our clusters


// mongoose.connect('mongodb+srv://prathibha230499:dgtXnGro0tg7ObIw@cluster0.dgvnk.mongodb.net/<db name')  // this will connect to perticular db


// above action is enough to connect to dB but generally we handle it gracefully as it returns a Promise object.

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://prathibha230499:dgtXnGro0tg7ObIw@cluster0.dgvnk.mongodb.net/DevTinder')
}


// now in order to ensure, api calls happens only after db connection.... export this connection and import under the files where we need to call the routes. Ensure to handle the Promise.


module.exports = connectDB;      // pass the reference but dont call connectDb() function here

