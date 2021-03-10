const express = require('express')
const auth= require('../middleware/validate_token')
const authorize= require('../middleware/check_authorization')
const UserCtrl = require('../controllers/user-ctrl')

const router = express.Router()

router.post('/register',auth,authorize, UserCtrl.registerUser)


module.exports = router