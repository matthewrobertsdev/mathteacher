const mongoose=require('mongoose')

const Schema=mongoose.Schema

const pageScema=new Schema({
  teachingName: String,
  method: String,
  arguments: String
})

const Page=mongoose.model('Page', pageScema)

module.exports={
  page: Page,
  pageScema: pageScema
}