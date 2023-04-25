const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, 
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dob: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true, 
  },
  accountType: {
    type: String,
    enum: ['personal', 'professional'],
    default: 'personal'
  },
  displayName: {
    type: String
  },
  personalTemplate:{
    type: String
  },
  businessLogo: {
    type: String
  },
  businessName: {
    type: String
  },
  businessType: {
    type: String
  },
  interestName: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interest'
  }],
  coverPic: {
    type: String
  },
  search: [{
    interest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interest'
    }
  }]
}, {
  timestamps: true
});


module.exports = mongoose.model('UserRegistration', userSchema);



