const express = require('express')
const TokenCtrl= require('../controllers/tokens-ctrl')
const auth= require('../middleware/validate_token')
const router = express.Router()
router.get('/token',auth,TokenCtrl.Re_Authenticate_Route)

module.exports = router;