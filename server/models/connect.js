const mongoose = require('mongoose')

const connectSchema = new mongoose.Schema({
  company: { type: String, required: 'This field is required.' },
  taxcode: { type: String, required: 'This field is required.' },
  address: { type: String, required: 'This field is required.' },
  host: { type: String, required: 'This field is required.' },
  username: { type: String, required: 'This field is required.' },
  password: { type: String, required: 'This field is required.' },
  database: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'This field is required.',
  },
  port: { type: String, default: 3306 },
  active: { type: Boolean, default: false },
  // todate: {
  // 	type: Date,
  // 	default: Date.now
  // },
  // fromdate: {
  // 	type: Date,
  // 	default: Date.now
  // }
  fromdate: { type: Date },
  todate: { type: Date },
})

module.exports = mongoose.model('Connect', connectSchema)
