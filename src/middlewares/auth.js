// creating the middlewares for user authentications.

const jwt = require('jsonwebtoken');
const User = require("../models/user");


const userAuth = async (req,res,next) => {
    try{
    //1. check for tokens
    const {token} = req.cookies;

    if(!token){
        throw new Error("jwt unavailable!....");
    }

    //2. validate the token.
    const decodeData = await jwt.verify(token, "DEV@Tinder#my");

    //3. check for user_id or any unique key, to know who has logged in
    const {_id} = decodeData;
    const userData = await User.findById(_id);

    //4. handle the user now
    if(!userData){
        throw new Error("Invalid User");
    }

    //5 to further simplify, attach the users details in the req, so to handle it easily later
    req.user = userData;
    next();

    //6 handle everything in try-catch block
}catch(err){
    res.status(404).send("Bad credentials" + err.message)
}
}

module.exports = {
    userAuth,
}