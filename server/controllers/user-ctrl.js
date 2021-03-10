const express = require("express");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const User = require('../models/users_models');

const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const keys = require("../../config/keys");
const utils=require("../tokes/utils");

createUser = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a user',
        })
    }

    const user = new User(req.body)

    if (!user) {
        return res.status(400).json({ success: false, error: err })
    }

    user
        .save()
        .then(() => {
            return res.status(201).json({success: true,id: user._id,message: 'User created!'})
        })
        .catch(error => {
            return res.status(400).json({error,message: 'User not created!'})
        })
}

updateUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({success: false,error: 'You must provide a body to update'})
    }
    const { errors, isValid } = validateLoginInput(req.body);
    //   Check validation
        if (!isValid) {
          return res.status(400).json({error:errors});
        }


    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(404).json({err,message: 'User not found!'})
        }
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (err) {
                  return res.status(400).json({ success: false, error: err })
              }

              user.password = hash;
              user.role= req.body.role
              user
                  .save()
                  .then(() => {
                      return res.status(200).json({success: true,id: user._id,message: 'User updated!'})
                  })
                  .catch(error => {
                      return res.status(404).json({error,message: 'User not updated!'})
                  })
            }
        )})
    })
}

deleteUser = async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404).json({ success: false, error: `User not found` })
        }

        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getUserById = async (req, res) => {
    await User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res.status(404).json({ success: false, error: `User not found` })
        }
        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getUsers = async (req, res) => {
    console.log("get users")
    await User.find({}, (err,users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!users.length) {
            return res.status(404).json({ success: false, error: `Users not found` })
        }
        return res.status(200).json({ success: true, data: users })
    }).catch(err => console.log(err))
}

loginUser = async (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);
//   Check validation
    if (!isValid) {
      return res.status(400).json({message:errors});
    }
    await User.findOne({username: req.body.username}, (err,user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!user) {
            return res.status(404).json({error:true ,message: "User not found"});
        }
        //check password match
        bcrypt.compare(req.body.password, user.password,        
            (err, valid) =>{
              if (!valid) {
               return res.status(404).json({error: true, message: "Password is Wrong"});
              }
              //Generate token
              var token = utils.generateToken(user);
              user = utils.getCleanUser(user);
              //authorization=token
        return res.status(200).json({ user: user, token: token })
    })
    }).catch(err => console.log(err));
}


registerUser = async (req, res)  => {
    const { errors, isValid } = validateRegisterInput(req.body);
//   Check validation
    if (!isValid) {       
          return res.status(400).json({error:errors});
    }

    User.findOne({ username: req.body.username }, (err, User1) => {
        if (User1) {
            return res.status(404).json({error:true , error: 'User  already exists'})      
        }
        const user = new User(req.body)

        if (!user) {
          
            return res.status(400).json({success: false, error: err })
        }
    // Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) {
              return res.status(400).json({ success: false, error: err })
          }
          user.password = hash;
          user
            .save()
            .then(() => {
            
                //Generate Token
                // var token = utils.generateToken(user); 
                // return res.status(201).json({ user: user, token: token })
                return res.status(201).json({message:"user created"})
            })
            .catch(error => {
                return res.status(400).json({error:true, error: 'User not created!'})
            }) 
        });
      });
    })
}
module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
    loginUser,
    registerUser
}