const mongoose = require('mongoose')
const Customer = require('../models/customer')

// Get all Customer
exports.getAllCustomer = function (req, res) {
  Customer.find((err, docs) => {
    if (!err) {
      return res
        .status(200)
        .json({
          success: true,
          message: 'A list of all Customer',
          customers: docs,
        })
    } else
      res
        .status(500)
        .json({
          success: false,
          message: 'Server error. Please try again.',
          error: err.message,
        })
  })

  // Customer.find()
  //   .select()
  //   .then((allCustomer) => {
  //     res.send(allCustomer);
  //     return res.status(200).json({  success: true, message: 'A list of all Customer', customers: allCustomer, });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({ success: false, message: 'Server error. Please try again.', error: err.message, });
  //   });
}

// get single Customer
exports.getSingleCustomer = function (req, res) {
  const id = req.params.id
  Customer.findById(id)
    .then((singleCustomer) => {
      res.status(200).json({
        success: true,
        message: `More on Customer`,
        customer: singleCustomer,
      })
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'This Customer does not exist',
        error: err.message,
      })
    })
}

// Create Customer
exports.createCustomer = function (req, res) {
  if ('_id' in req.body) {
    delete req.body._id
  }
  const cust = new Customer(req.body)
  // console.log(cust);
  cust.save(function (err) {
    if (err) {
      res
        .status(500)
        .json({
          success: false,
          message: 'Server error. Please try again.',
          error: err.message,
        })
    } else {
      res
        .status(201)
        .json({
          success: true,
          message: 'New customer created successfully',
          customer: cust,
        })
    }
  })
}

// update Customer
exports.updateCustomer = function (req, res) {
  console.log(req.params)
  const id = req.params.id
  const updateObject = req.body
  // console.log(updateObject);

  Customer.updateOne({ _id: id }, { $set: updateObject })
    .exec()
    .then(() => {
      res.status(200).json({ success: true })
    })
    .catch((err) => {
      res.status(500).json({ success: false })
    })
}

// delete a Customer
exports.deleteCustomer = function (req, res) {
  const id = req.params.id
  Customer.findByIdAndDelete(id)
    .exec()
    .then(() =>
      res.status(204).json({
        success: true,
      }),
    )
    .catch((err) =>
      res.status(500).json({
        success: false,
      }),
    )
}
