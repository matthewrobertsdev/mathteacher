const bodyParser=require('body-parser')
const Page=require('../models/page').page
module.exports=function(app){
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  app.get('/teachings/:teachingName', function(req, res){
    console.log('teaching page history update')
    res.json({message: 'Teaching Page URL recieved'})
    const page=Page({
      teachingName: req.body.teachingName,
      method: null,
      arguments: null
    })
    page.save(function(err){
      //res.json({message: 'Teaching Page Saved'})
      console.log('Teaching Page saved')
    })
  })
}