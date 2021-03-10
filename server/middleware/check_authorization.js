const jwt = require('jsonwebtoken');
const User = require('../models/users_models');


authorize_token= async (req, res,next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    // console.log(token);
    const data = jwt.verify(token,process.env.JWT_SECRET);
    console.log("authorize");
    const user = await User.findOne({ _id: data._id})
    if (!user) {
        return res.status(404).json({error: "User not found"});
    }
    console.log(user.role)
    if(data.role!==user.role || user.role!=="admin"){
        return res.status(401).send({error:true,error: 'Not admin' })
    }
    next() ;
  } catch(error){
    res.status(401).send({ error: 'Not authorized to access this resource' })
  }
};
module.exports =authorize_token

