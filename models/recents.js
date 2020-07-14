const mongoose=require('mongoose')
const Page=require('./page')

const Schema=mongoose.Schema

const recentsScehma=new Schema({
  pages: [Page.pageScema]
})

const Recents=mongoose.model('Recents', recentsScehma)

module.exports={
  recents: Recents,
  recentsScehma: recentsScehma
}