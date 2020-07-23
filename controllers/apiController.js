const bodyParser = require('body-parser')
const Recents = require('../models/recents').recents
const Page = require('../models/page').page
const jwt = require('jsonwebtoken')
const User = require('../models/user').user
const privateKey=require('../config/config.json').secret
module.exports = function (app) {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  //get for a main teaching page
  app.post('/teachings/:teachingName', function (req, res) {
    console.log('teaching page history update')
    console.log(req.params.teachingName)
    updateRecents(req, req.params.teachingName, null, null, res)
  })

  //get for a method teaching
  app.post('/teachings/:teachingName/:methodName', function (req, res) {
    console.log('method page history update')
    console.log(req.params.teachingName)
    updateRecents(req, req.params.teachingName, req.params.methodName, null, res)
  })

  //get for a solving page
  app.post('/teachings/:teachingName/:methodName/:args', function (req, res) {
    console.log('solving page history update')
    console.log(req.params.teachingName)
    updateRecents(req, req.params.teachingName, req.params.methodName, req.params.args, res)
  })
  //get for the recents page
  app.post('/recents', function (req, res) {
    console.log('Received request for recents')
    let decodedJWT={}
    try{
      console.log(req.body.jwt)
      decodedJWT=jwt.verify(req.body.jwt, privateKey)
    } catch {
      res.json({error: 'invalidJWT'})
      return
    }
    //res.json({message: 'Recieved request for recents'})
    Recents.find({email: decodedJWT.email}, function (err, docs) {
      if (docs.length != 0) {
        res.json(docs[0])
      } else {
        //if recents is not found
      console.log('recents not found')
      //create the recents with the new page
      const recents = Recents({
        email: decodedJWT.email,
        pages: []
      })
      //save the recents
      recents.save(function (err) {
        console.log(err)
        res.json({ message: 'Recents initiated' })
        console.log('Recents initiated')
      })
      }
    })
  })

  //try to login user
  app.post('/login', function (req, res) {
    console.log(req.body)
    if (req.body.email === null || req.body.email === undefined || req.body.email === "") {
      res.json({ error: 'email must not be blank' })
      return
    }
    if (req.body.password === null || req.body.password === undefined || req.body.password === "") {
      res.json({ error: 'password must not be blank' })
      return
    }
    handlePassword = (bool) => {
      if (bool) {
        console.log(req.body.email)
        res.json({ success: true, email: req.body.email, jwt: jwt.sign({email: req.body.email}, privateKey, {expiresIn: '1d'})})
      } else {
        res.json({ error: 'invalid username or password' })
      }
    }
    User.find({ 'email': req.body.email }, function (err, docs) {
      if (docs.length == 0) {
        res.json({ error: 'invalid username or password' })
      } 
      docs[0].isCorrectPassword(req.body.password, handlePassword)
    })
})

//try to create an account
app.post('/createAccount', function (req, res) {
  if (req.body.email === null || req.body.email === undefined || req.body.email === "") {
    res.json({ error: 'email must not be blank' })
    return
  }
  if (req.body.password === null || req.body.password === undefined || req.body.password === "") {
    res.json({ error: 'password must not be blank' })
    return
  }
  User.find({ 'email': req.body.email }, function (err, docs) {
    if (docs.length == 0) {
      console.log('email not taken')
      const user = User({
        email: req.body.email,
        password: null,
        salt: null
      })
      user.savePassword(req.body.password)
      res.json({ success: true })
      return
    } else {
      console.log('email is taken')
      res.json({ emailTaken: true })
      return
    }
  })
})

}

//update the recents
function updateRecents(req, teaching, methodName, args, res) {
  let decodedJWT={}
    try{
      console.log(req.body.jwt)
      decodedJWT=jwt.verify(req.body.jwt, privateKey)
    } catch {
      res.json({error: 'invalid JWT'})
      return
    }
  Recents.find({email: decodedJWT.email}, function (err, docs) {
    console.log(err)
    //create the page
    const page = Page({
      teachingName: teaching,
      method: methodName,
      arguments: args
    })
    //if recents already exists
    if (docs.length != 0) {
      console.log('recents found')
      const doc = docs[0]
      let index = -1
      //try to find an index of a duplicate recents item
      for (let i = 0; i < doc.pages.length; i++) {
        if (doc.pages[i].teachingName == teaching
          && doc.pages[i].method == methodName
          && doc.pages[i].arguments == args) {
          index = i
        }
      }
      //remove if already there
      if (index !== -1) {
        doc.pages.splice(index, 1)
      }
      //get rid of oldest
      if (doc.pages.length > 99) {
        docs.pages.pop()
      }
      //add newest
      doc.pages.unshift(page)
      //update the doc in the db
      doc.save();
      //send the doc over for debugging
      res.json({ messsage: 'Recent saved' })
    } else {
      //if recents is not found
      console.log('recents not found')
      //create the recents with the new page
      const recents = Recents({
        email: decodedJWT.email,
        pages: [page]
      })
      //save the recents
      recents.save(function (err) {
        console.log(err)
        res.json({ message: 'Recents initiated with first page' })
        console.log('Recents initiated')
      })
    }
  })
}