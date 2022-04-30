//const config = require('config');
const jwt = require('jsonwebtoken')
//const Joi = require('joi');
const mongoose = require('mongoose')

//simple schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: ['Trần Văn Nghĩa', 'Trần Thị Mai Thảo', 'Trần Vũ Anh'].find(
      (_, i, ar) => Math.random() < 1 / (ar.length - i),
    ),
  },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
      },
      message: 'Please enter a valid email',
    },
    required: [true, 'Email required'],
  },
  password: {
    type: String,
    required: true,
  },
  registered: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: ['Member', 'Staff', 'Admin'].find(
      (_, i, ar) => Math.random() < 1 / (ar.length - i),
    ),
  },
  status: {
    type: String,
    default: ['Active', 'Inactive', 'Pending', 'Banned'].find(
      (_, i, ar) => Math.random() < 1 / (ar.length - i),
    ),
  },
  admin: {
    type: Boolean,
    default: false,
  },
  databases: [],
  socialId: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
})

//custom method to generate authToken
UserSchema.methods.generateAuthToken = function () {
  const expire = `${process.env.TOKENLIFE}`
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin, user: this },
    process.env.PRIVATE_KEY,
    { expiresIn: expire },
  )
  const refreshtoken = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin, user: this },
    process.env.PRIVATE_KEY,
    { expiresIn: `${process.env.REFRESHTOKENLIFE}` },
  )

  //get the private key from the config file -> environment variable
  //console.log(jwt.verify(token, process.env.PRIVATE_KEY) )
  return { token: token, refreshtoken: refreshtoken, expiresIn: expire }
}

//custom method verify
UserSchema.methods.verify = function (token) {
  return jwt.verify(token, process.env.PRIVATE_KEY)
}

//custom method comparePassword
UserSchema.methods.comparePassword = function (password) {
  // return bcrypt.compareSync(password, this.hash_password);
}

const User = mongoose.model('User', UserSchema)
exports.User = User

//KHÔNG DÙNG module.exports = mongoose.model('User', UserSchema)
// NÊN ===> const { User } = require('../models/User')
