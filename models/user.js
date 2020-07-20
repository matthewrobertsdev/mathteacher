const mongoose=require('mongoose')
const crypto=require('crypto')

const Schema=mongoose.Schema

const userSchema=new Schema({
  email: String,
  password: String,
  salt: String,
})

userSchema.methods.savePassword=function(password){
  this.salt=crypto.randomBytes(128).toString('base64')
  this.password=crypto.pbkdf2(password, salt, 10000)
}

userSchema.methods.isCorrectPassword=function(attemptedPassword){
  return this.password==crypto.pbkdf2(attemptedPassword, salt, 10000)
}

const User=mongoose.model('User', userSchema)

module.exports={
  user: User,
  userSchema: userSchema
}