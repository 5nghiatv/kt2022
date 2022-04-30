const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: 'This field is required.',
  },
  email: {
    type: String,
    required: 'This field is required.',
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
      },
      message: 'Please enter a valid email',
    },
    required: [true, 'Email required'],
  },
  mobile: { type: String },
  address: { type: String },
  birthdate: {
    type: Date,
    default: Date.now,
    required: 'Must have start date - default value is the created date',
  },
  accounts: [],
  taxcode: { type: String, required: 'This field is required.' },
  active: {
    type: Boolean,
  },
})

module.exports = mongoose.model('Customer', customerSchema)
