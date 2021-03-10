const express = require('express')

const UserCtrl = require('../controllers/user-ctrl')
const auth= require('../middleware/validate_token')
const authorize= require('../middleware/check_authorization')
const router = express.Router()


router.post('/user',auth,authorize,UserCtrl.createUser)
router.put('/user/:id',auth,authorize,UserCtrl.updateUser)
router.delete('/user/:id',auth,authorize,UserCtrl.deleteUser)
router.get('/user/:id',auth,authorize,UserCtrl.getUserById )
router.get('/users',auth,authorize,UserCtrl.getUsers)



module.exports = router