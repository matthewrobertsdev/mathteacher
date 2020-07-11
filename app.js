const express=require('express')
const mongoose=require('mongoose')
const app=express();
const cors = require('cors')
const apiController=require('./controllers/apiController')

//hello on run
console.log('Hello from Math Teacher')

//connect to localhost mongodb (must be running)
const mongoDBurl = 'mongodb://localhost:27017'
mongoose.connect(mongoDBurl)

//get apis running
app.use(cors())
apiController(app)

//start listening
const port=9000
app.listen(port)