//Generate Token using secret from process.env.JWT_SECRET
var jwt = require("jsonwebtoken");
function generateToken(user) {
  //1. Dont use password and other sensitive fields
  //2. Use fields that are useful in other parts of the     
  //app/collections/models
  if (!user) return null;
  var payload = {
  //  role: user.role to authorization
    _id: user._id.toString(),
    username: user.username,
    role: user.role
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
     expiresIn: 60 * 60 * 24 // expires in 24 hours
  });
}
  function getCleanUser(user) {
    if (!user) return null;
   
    return {
      _id: user._id.toString(),
      username: user.username
    };
  } 
module.exports = {
  generateToken,
  getCleanUser
}