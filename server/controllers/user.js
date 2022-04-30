const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { User } = require('../models/User')
const {
  createUserSql,
  getAllUserSql,
  getSingleUserSql,
  updateUserSql,
  deleteUserSql,
  findOneUserSql,
} = require('./kt_users')

exports.createUser = async function (req, res) {
  if (!__mongodb) {
    return createUserSql(req, res)
  } else {
    if ('_id' in req.body) {
      delete req.body._id
    }
    const colls = new User(req.body)
    // res.json(user) ;
    colls.password = colls.password ? await bcrypt.hash(colls.password, 10) : ''
    colls.save(function (err) {
      if (err) {
        res.status(500).json({
          success: false,
          message: 'Server error. Please try again.',
          error: err.message,
        })
      } else {
        res.status(201).json({
          success: true,
          message: 'New user created successfully',
          user: colls,
        })
      }
    })
  }
}
// Get all User
exports.getAllUser = async function (req, res) {
  if (!__mongodb) {
    return getAllUserSql(req, res)
  } else {
    User.find()
      .select()
      .then((allUser) => {
        //res.send(allUser);
        return res.status(200).json({
          success: true,
          message: 'A list of all User',
          users: allUser,
        })
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: 'Server error. Please try again.',
          error: err.message,
        })
      })
  }
}

// get single User
exports.getSingleUser = function (req, res) {
  //__mongodb = false;  // test
  if (!__mongodb) {
    return getSingleUserSql(req, res)
  } else {
    const id = req.params.id
    User.findById(id)
      .then((singleUser) => {
        res.status(200).json({
          success: true,
          message: `More on ${singleUser.fullName}`,
          User: singleUser,
        })
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: 'This User does not exist',
          error: err.message,
        })
      })
  }
}
exports.getUserEmail = function (req, res) {
  //console.log(req.params.email)
  //__mongodb = false;  // test

  if (!__mongodb) {
    return findOneUserSql(req, res)
  } else {
    User.findOne({ email: req.params.email })
      .then((singleUser) => {
        if (!singleUser)
          return res
            .status(404)
            .json({
              success: false,
              message: 'This User does not exist.',
              error: 404,
            })
        res.status(200).json({
          success: true,
          message: `More on ${singleUser.username}`,
          User: singleUser,
        })
      })
      .catch((err) => {
        res
          .status(500)
          .json({
            success: false,
            message: 'Server error. Please try again.',
            error: err.message,
          })
      })
  }
}

// update User
exports.updateUser = async function (req, res) {
  if (!__mongodb) {
    return updateUserSql(req, res)
  } else {
    if (req.body.newPassword)
      req.body.password = await bcrypt.hash(req.body.newPassword, 10)
    const updateObject = req.body
    User.updateOne({ _id: req.params.id }, { $set: updateObject })
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
}

// delete a User
exports.deleteUser = async function (req, res) {
  if (!__mongodb) {
    return deleteUserSql(req, res)
  } else {
    const id = req.params.id
    User.findByIdAndDelete(id)
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
}
