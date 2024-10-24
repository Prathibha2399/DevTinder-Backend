const cookieParser = require('cookie-parser');
const express = require('express');
const User = require('./models/user');
const connectDB = require('./configarations/database');
const authRouter = require('./routes/authRoute');
const profileRouter = require('./routes/profileRoute')
const requestRouter = require('./routes/requestRoute')
const userRouter = require('./routes/userRoute');
const feedRouter = require('./routes/feedRoute');


const app = express();

app.use(express.json());
app.use(cookieParser());

/* Routes */
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', feedRouter);


connectDB().then(() => {console.log('DB connection established!..');
  app.listen(3000, () => {
    console.log("Server running successfully!...")
  })
}).catch((err) => console.error('Failed to connect dB :' + err.message))





