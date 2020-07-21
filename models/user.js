const mongoose=require('mongoose')
const crypto=require('crypto')

const Schema=mongoose.Schema

let userSchema=new Schema({
  email: String,
  password: String,
  salt: String,
})

userSchema.methods.savePassword=function(password){
  let user=this
  console.log(user)
  this.salt=crypto.randomBytes(128).toString('base64')
  crypto.pbkdf2(password, this.salt, 10000, 64, 'sha512', (err, key)=>{
    if (err){
      console.log(err)
      throw err;
    }
    console.log(key.toString('base64'))
    user.password=key.toString('base64')
    console.log(user)
    user.save()
  })
}

userSchema.methods.isCorrectPassword=function(attemptedPassword, callback){
  let user=this
  console.log(user)
  crypto.pbkdf2(attemptedPassword, this.salt, 10000, 64, 'sha512', (err, key)=>{
    if (err){
      console.log(err)
      throw err;
    }
    console.log("1234"+key.toString('base64'))
    console.log(user.password)
    console.log(user.password==key.toString('base64'))
    callback(user.password==key.toString('base64'))
  })
}

const User=mongoose.model('User', userSchema)

module.exports={
  user: User,
  userSchema: userSchema
}