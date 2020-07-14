const bodyParser=require('body-parser')
const Recents=require('../models/recents').recents
const Page=require('../models/page').page
module.exports=function(app){
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  //get for a main teaching page
  app.get('/teachings/:teachingName', function(req, res){
    console.log('teaching page history update')
    //res.json({message: 'Teaching Page URL recieved'})
    Recents.find({}, function (err, docs) {
      //create the page
      const page=Page({
        teachingName: req.params.teachingName,
          method: null,
          arguments: null
      })
      //if recents already exists
      if (docs.length!=0){
        console.log('recents found')
        const doc=docs[0]
        let index=-1
        //try to find an index of a duplicate recents item
        for (let i=0; i<doc.pages.length; i++){
          if (doc.pages[i].teachingName=req.params.teachingName
            &&doc.pages[i].method==null
            &&doc.pages[i].arguments==null){
              index=i
            }
        }
        //remove if already there
        if (index!==-1){
          doc.pages.splice(index, 1)
        }
        //get rid of oldest
        if (doc.pages.length>99){
          docs.pages.pop()
        }
        //add newest
        doc.pages.unshift(page)
        //update the doc in the db
        doc.save();
        //send the doc over for debugging
        res.json({doc})
      } else {
        //if recents is not found
        console.log('recents not found')
        console.log(req.params.teachingName)
        //create the recents with the new page
        const recents=Recents({
          pages: [page]
        })
        //save the recents
        recents.save(function(err){
          console.log(err)
          res.json({message: 'Recents initiated'})
          console.log('Recents initiated')
        })
      }
    })
  })
  //get for the recents page
  app.get('/recents', function(req, res){
    console.log('Recieved request for recents')
    res.json({message: 'Recieved request for recents'})
  })

}