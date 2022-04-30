const mongoose = require('mongoose')
const Connect = require('../models/connect')
const { User } = require('../models/User')
const mysql = require('mysql')
const {
  createConnectSql,
  getAllConnectSql,
  getFilterConnectSql,
  getSingleConnectSql,
  updateConnectSql,
  deleteConnectSql,
} = require('./kt_connect')
// Get all Connect - FILTER
exports.getFilterConnect = function (req, res) {
  // console.log('getFilterConnect : __mongodb:', __mongodb,', req.body:', req.body )
  if (!__mongodb) {
    return getFilterConnectSql(req, res)
  } else {
    const { email } = req.body // Lấy biến email trong body
    User.find({ email: email }).then((singleUser) => {
      var databases = []
      if (singleUser.length > 0) databases = singleUser[0].databases.toString()
      Connect.find()
        .select()
        .then((allConnect) => {
          //res.send(allConnect);
          var confilter = [] // Lọc và chọn Database
          var ncount = 0
          var result = new Promise((resolve, reject) => {
            if (singleUser.length == 0 || singleUser[0].databases.length == 0)
              resolve(confilter)
            //console.log(singleUser.length, 1,singleUser[0].databases);
            allConnect.forEach((kq, index, array) => {
              //console.log(databases,kq.database)
              const retcon = mysql.createConnection({
                host: kq.host,
                user: kq.username,
                password: kq.password,
                database: kq.database,
              })
              retcon.connect(function (err) {
                // The server is either down
                retcon.query(
                  'SELECT MIN(ngay) AS fromdate ,MAX(ngay) AS todate FROM ctuktoan',
                  (err, rows, fields) => {
                    retcon.destroy()
                    ncount++
                    if (!err) {
                      var conn = allConnect[index]
                      conn['fromdate'] = rows[0].fromdate
                      conn['todate'] = rows[0].todate
                      if (databases.includes(kq.database)) confilter.push(conn)
                    }
                    //console.log(ncount,array.length,kq.database);
                    if (ncount === array.length) resolve(confilter)
                  },
                )
              }) //  retcon.connect()
            }) // allConnect.forEach()
          }) // result = new Promise()
          result.then((ret) => {
            //console.log(111,ret);
            return res.status(200).json({
              success: true,
              message: 'A list of all Connect OK',
              connects: ret,
              mongodb: __mongodb,
            })
          })
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: err.message,
          })
        })
    })
  }
}

// Get all Connect
exports.getAllConnect = async function (req, res) {
  if (!__mongodb) {
    return getAllConnectSql(req, res)
  } else {
    Connect.find()
      .select()
      .then((allConnect) => {
        //res.send(allConnect);
        return res.status(200).json({
          success: true,
          message: 'A list of all Connect',
          connects: allConnect,
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

// get single Connect
exports.getSingleConnect = function (req, res) {
  const id = req.params.id
  Connect.findById(id)
    .then((singleConnect) => {
      res.status(200).json({
        success: true,
        message: `More on Connect`,
        connect: singleConnect,
      })
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'This Connect does not exist',
        error: err.message,
      })
    })
}

// Create Connect
exports.createConnect = async function (req, res) {
  if (!__mongodb) {
    return createConnectSql(req, res)
  } else {
    if ('_id' in req.body) {
      delete req.body._id
    }
    const cust = new Connect(req.body)
    // console.log(cust);
    cust.save(function (err) {
      if (err) {
        res.status(500).json({
          success: false,
          message: 'Server error. Please try again.',
          error: err.message,
        })
      } else {
        res.status(201).json({
          success: true,
          message: 'New connect created successfully',
          connect: cust,
        })
      }
    })
  }
}

// update Connect
exports.updateConnect = async function (req, res) {
  if (!__mongodb) {
    return updateConnectSql(req, res)
  } else {
    const id = req.params.id
    const updateObject = req.body
    Connect.updateOne({ _id: id }, { $set: updateObject })
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

// delete a Connect
exports.deleteConnect = async function (req, res) {
  if (!__mongodb) {
    return deleteConnectSql(req, res)
  } else {
    const id = req.params.id
    Connect.findByIdAndDelete(id)
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
