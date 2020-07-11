const mongoose=require('mongoose')
const Page=require('./page')

const Schema=moongoose.Schema

const historyScehma=new Schema({
  problems: [Page.pageScema]
})

const History=mongoose.model('History', historyScehma)

module.exports={
  history: History,
  historyScehma: historyScehma
}