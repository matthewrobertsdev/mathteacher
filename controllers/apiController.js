const bodyParser=require('body-parser')
const Recents=require('../models/recents').recents
const Page=require('../models/page').page
module.exports=function(app){
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))

  //get for a main teaching page
  app.get('/teachings/:teachingName', function(req, res){
    console.log('teaching page history update')
    console.log(req.params.teachingName)
    updateRecents(req.params.teachingName, null, null, res)
  })

  //get for a method teaching
  app.get('/teachings/:teachingName/:methodName', function(req, res){
    console.log('method page history update')
    console.log(req.params.teachingName)
    updateRecents(req.params.teachingName, req.params.methodName, null, res)
  })

  //get for a solving page
  app.get('/teachings/:teachingName/:methodName/:args', function(req, res){
    console.log('solving page history update')
    console.log(req.params.teachingName)
    updateRecents(req.params.teachingName, req.params.methodName, req.params.args, res)
  })
  //get for the recents page
  app.get('/recents', function(req, res){
    console.log('Recieved request for recents')
    //res.json({message: 'Recieved request for recents'})
    Recents.find({}, function (err, docs) {
      if (docs.length!=0){
        res.json(docs[0])
      } else {
        res.json({})
      }
    })
  })

}

function updateRecents(teaching, methodName, args, res){
  Recents.find({}, function (err, docs) {
    console.log(err)
    console.log(teaching)
    //create the page
    const page=Page({
      teachingName: teaching,
        method: methodName,
        arguments: args
    })
    //if recents already exists
    if (docs.length!=0){
      console.log('recents found')
      const doc=docs[0]
      let index=-1
      //try to find an index of a duplicate recents item
      for (let i=0; i<doc.pages.length; i++){
        if (doc.pages[i].teachingName==teaching
          &&doc.pages[i].method==methodName
          &&doc.pages[i].arguments==args){
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
      res.json({messsage: 'Recent saved'})
    } else {
      //if recents is not found
      console.log('recents not found')
      //create the recents with the new page
      const recents=Recents({
        pages: [page]
      })
      //save the recents
      recents.save(function(err){
        console.log(err)
        res.json({message: 'Recents initiated with first page'})
        console.log('Recents initiated')
      })
    }
  })
}