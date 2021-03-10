const express = require('express')
const router = express.Router()
const FileCtrl = require('../controllers/file-ctrl')

router.post('/uploadfile',FileCtrl.fileUpload)
router.post('/uploadfiles',FileCtrl.files_Upload)
router.get('/getfiles',FileCtrl.getfiles)
router.post('/createdir',FileCtrl.create_directory)
module.exports = router