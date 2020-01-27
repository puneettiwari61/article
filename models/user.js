var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var userSchema = new Schema({
  username:{
    type: String,
    unique: true,
    required: true
  },
  email:{
    type: String,
    unique: true,
    required: true
  } ,
  password:{
    type: String,
    required: true
  },
  articleId: [{
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }]
},
{ timestamps:true })



userSchema.methods.verifyPassword = function(password,hashed) {
  return bcrypt.compareSync(password,hashed)
}



userSchema.pre('save', function(next) {
  // check whether password is changed on not
  if(this.isModified('password')) {
      //hash and save it to same password field
      this.password = bcrypt.hashSync(this.password,10)
      return next();
  }
  next();
})

module.exports = mongoose.model('User',userSchema);