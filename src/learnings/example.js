const express = require("express");

const app = express();

/* app.use('/user', (req,res, next) => {
    // res.send("Hello User");
    next();
});

app.get('/user/data', (req,res, next) => {
    res.send("res")
    next()  
}) */




app.get('/user', (req,res)=> {
    throw new Error("xys");
    res.send("User data sent")
});
app.use('/', (err,req,res,next) => {
    res.status(501).send('Something went wrong')
    
});

app.listen(7777, () => {
    console.log("Server is running on port number 7777");
})
