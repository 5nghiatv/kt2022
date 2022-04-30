// const mysql = require('mysql')
// const express = require('express')
// const dotenv = require('dotenv').config()

// Get all Customer
exports.getAllCustomer_ = async function (req, res) {
  var query = 'SELECT *,maso as value FROM customer ORDER BY maso'
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: 'A list of all Customer',
      customers_: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// get single Customer
exports.getSingleCustomer_ = async function (req, res) {
  var query = 'SELECT * FROM customer WHERE id = ' + req.params.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: `More on: Customer`,
      customer_: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

exports.getCusTaxcode = async function (req, res) {
  var query = 'SELECT * FROM customer WHERE maso = ' + req.params.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: `More on: Customer`,
      customer_: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// Create Customer
exports.createCustomer_ = async function (req, res) {
  var query =
    'INSERT INTO customer (`id`, `fullname`, `name`, `company`, `address`, `email`, `phone1`, `phone2`, `fax1`, `ghichu`, `group_id`, `maso`, `account`, `bank`, `citibank`, `makhach`) ' +
    'VALUES (null,"","","' +
    req.body.company +
    '","' +
    req.body.address +
    '","","","","","' +
    req.body.ghichu +
    '","","' +
    req.body.maso +
    '","","","",""' +
    ')'
  try {
    let rows = await runQuerySync(query, [], req, res)
    req.body.id = rows.insertId
    //console.log(req.body)
    res.status(201).json({
      success: true,
      message: 'New customer created successfully',
      customer_: req.body,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// update Customer
exports.updateCustomer_ = async function (req, res) {
  var query =
    'UPDATE customer SET company = "' +
    req.body.company +
    '", address = "' +
    req.body.address +
    '", maso = "' +
    req.body.maso +
    '", ghichu = "' +
    req.body.ghichu +
    '", account= "' +
    req.body.account +
    '", bank = "' +
    req.body.bank +
    '", citibank = "' +
    req.body.citibank +
    '", phone1 = "' +
    req.body.phone1 +
    '" WHERE id=' +
    req.body.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      customer_: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// delete a Customer
exports.deleteCustomer_ = async function (req, res) {
  try {
    let rows = await runQuerySync(
      'DELETE FROM customer WHERE id = ?',
      [req.params.id],
      req,
      res,
    )
    res.status(204).json({
      success: true,
      message: 'Customer Deleted successfully',
      customer_: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}
