const mongoose=require('mongoose')
const crypto=require('crypto')

const Schema=mongoose.Schema

//basic user account data
let userSchema=new Schema({
  email: String,
  password: String,
  salt: String,
})

//make salt, hash password, and save results
userSchema.methods.savePassword=function(password){
  let user=this
  console.log(user)
  this.salt=crypto.randomBytes(128).toString('base64')
  crypto.pbkdf2(password, this.salt, 10000, 64, 'sha512', (err, key)=>{
    if (err){
      console.log(err)
      throw err;
    }
    user.password=key.toString('base64')
    console.log(user)
    user.save()
  })
}

//pass in a callback to handle correct/incorrect password
userSchema.methods.isCorrectPassword=function(attemptedPassword, callback){
  let user=this
  console.log('abcd1'+user)
  crypto.pbkdf2(attemptedPassword, this.salt, 10000, 64, 'sha512', (err, key)=>{
    if (err){
      console.log(err)
      throw err;
    }
    console.log('abcd2'+user.password)
    console.log('abcd3'+key.toString('base64'))
    callback(user.password==key.toString('base64'))
  })
}

const User=mongoose.model('User', userSchema)

module.exports={
  user: User,
  userSchema: userSchema
}