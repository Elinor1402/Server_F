const jwt = require('jsonwebtoken');
const User = require('../models/users_models');


verify_token= async (req, res,next) => {
  try {
    console.log("authenticte1");
    const token = req.headers.authorization.split(' ')[1];
    console.log("authenticte");
    const data = jwt.verify(token,process.env.JWT_SECRET);
    // console.log(data._id);
    const user = await User.findOne({ _id: data._id})
    if (!user) {
        return res.status(404).json({error: "User not found"});
    }
    // console.log("helo")
    next() ;
    // console.log("by")
  } catch(error){
    res.status(401).send({ error: 'Not authenticated to access this resource' })
  }
};
module.exports =verify_token

