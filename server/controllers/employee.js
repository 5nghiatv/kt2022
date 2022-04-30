const mongoose = require('mongoose')
const Employee = require('../models/employee')

exports.createEmployee = function (req, res) {
  if ('_id' in req.body) {
    delete req.body._id
  }
  const empl = new Employee(req.body)
  // res.json(employee) ;
  empl.save(function (err) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      })
    } else {
      res.status(201).json({
        success: true,
        message: 'New employee created successfully',
        employee: empl,
      })
    }
  })
}
// Get all Employee
exports.getAllEmployee = function (req, res) {
  Employee.find((err, docs) => {
    if (!err) {
      return res
        .status(200)
        .json({
          success: true,
          message: 'A list of all Employee',
          employees: docs,
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

  // Employee.find()
  //   .select()
  //   .then((allEmployee) => {
  //     res.send(allEmployee);
  //     return res.status(200).json({
  //       success: true,
  //       message: 'A list of all Employee',
  //       employees: allEmployee,
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       success: false,
  //       message: 'Server error. Please try again.',
  //       error: err.message,
  //     });
  //   });
}

// get single Employee
exports.getSingleEmployee = function (req, res) {
  const id = req.params.id
  Employee.findById(id)
    .then((singleEmployee) => {
      res.status(200).json({
        success: true,
        message: `More on ${singleEmployee.fullName}`,
        Employee: singleEmployee,
      })
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'This Employee does not exist',
        error: err.message,
      })
    })
}

// update Employee
exports.updateEmployee = function (req, res) {
  const id = req.params.id
  const updateObject = req.body
  //console.log(updateObject);
  Employee.updateOne({ _id: id }, { $set: updateObject })
    .exec()
    .then(() => {
      res.status(200).json({
        success: true,
      })
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
      })
    })
}

// delete a Employee
exports.deleteEmployee = function (req, res) {
  const id = req.params.id
  Employee.findByIdAndDelete(id)
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
