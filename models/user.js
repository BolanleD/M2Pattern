const mongoose = require('mongoose');

//User schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    enum: [
      0, 
      1,
      2 
    ],
    default: 0
  },
  createdOn: {type: Date, default: Date.now},
  resetPasswordToken: String,
  resetPasswordExpires: Date
})

const User = module.exports = mongoose.model('User', UserSchema);