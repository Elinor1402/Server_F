const jwt = require('jsonwebtoken');
const User = require('../models/users_models');
const utils=require("../tokes/utils");

//This route is called when the user refreshes the browser to re-authenticate the user.
// The assumption here is that the app has stored the token in localstorage or sessionStorage.
Re_Authenticate_Route= async (req, res) => {
     // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token;
 const token = req.headers.authorization.split(' ')[1];
  if (!token) {
   return res.status(400).json({error:true,message: "Must pass token"});
  }
// Check token that was passed by decoding token using secret
 jwt.verify(token,process.env.JWT_SECRET, (err, user)=> {
    if (err) 
    {
        //Invalid token
        return res.status(401).json({error:true, message: 'Unauthenticated'})
    }
   //return user using the id from w/in JWTToken
   User.findOne({ _id: user._id }, (err, user) => {
    if (err) {
        return res.status(404).json({error:true, message: 'User not found!'})
    }
          user = utils.getCleanUser(user); 
         //Note: you can renew token by creating new token(i.e.    
         //refresh it)w/ new expiration time at this point, but I’m 
         //passing the old token back.
         var token = utils.generateToken(user);
         //return both user and token

         return res.status(200).json({ user: user, token: token })
     });
    })
}

module.exports = {
    Re_Authenticate_Route
}