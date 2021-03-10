require('dotenv').config();
const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const userRouter = require('./routes/user-router')
const loginClient=  require('./routes/login')
const registerClient=  require('./routes/register')


const verifyToken= require('./routes/token-router')

const uploadFile= require('./routes/files-router')

const app = express()
const apiPort = 8080

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// app.use('/static', express.static('uploads'));
app.use(express.static('public'));


db.on('error', console.error.bind(console, 'MongoDB connection error:'))
// var subjects = db.collection("AllUsers");
// console.log("the collection is:"+subjects[0])

app.get('/', (req, res) => {
    res.append('Access-Control-Allow-Origin', '*');
    res.send('Hello World!')
})

app.use('/api',uploadFile)
app.use('/api', userRouter)
app.use('/api',loginClient)
app.use('/api',registerClient)
app.use('/api',verifyToken)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))

// var fs=require('fs');
// fs.readFile('./uploads/','utf8',function(err,data)
// {
//     var file=data.toString('base64')
//     console.log(file)
// });