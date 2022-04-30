const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: 'This field is required.',
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
  mobile: { type: String },
  city: { type: String },
  dofbirth: {
    type: Date,
    default: Date.now,
    required: 'Must have start date - default value is the created date',
  },
  salary: { type: Number },
})

module.exports = mongoose.model('Employee', employeeSchema)
