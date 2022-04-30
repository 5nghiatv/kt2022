// const mysql = require('mysql')
// const express = require('express')
// const dotenv = require('dotenv').config()

// Get all Chitiet
exports.getAllChitiet = async function (req, res) {
  var query = 'SELECT * FROM chitiet'
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: 'A list of all Chitiet',
      chitiets: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// get single Chitiet
exports.getSingleChitiet = async function (req, res) {
  var query = 'SELECT * FROM chitiet WHERE id = ' + req.params.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: `More on: Chitiet`,
      chitiet: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// get group CtID Chitiet
exports.getChitiet = async function (req, res) {
  var query = 'SELECT * FROM chitiet WHERE ctid = ' + req.params.ctid
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: `More on: Chitiet`,
      chitiets: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}
// Create Chitiet
exports.createChitiet = async function (req, res) {
  var query =
    'INSERT INTO chitiet (`id`, `ctid`, `diengiai`, `tkno`, `tkco`, `sotien`,`matkno`,`matkco`,`ngoaite`,`ctkhac`) ' +
    'VALUES (null,"' +
    req.body.ctid +
    '","' +
    req.body.diengiai +
    '","' +
    req.body.tkno +
    '","' +
    req.body.tkco +
    '","' +
    req.body.sotien +
    '","","",0,"" )'
  // console.log(req.body)
  try {
    let rows = await runQuerySync(query, [], req, res)
    req.body.id = rows.insertId
    return res.status(201).json({
      success: true,
      message: 'New chitiet created successfully',
      chitiet: req.body,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// update Chitiet
exports.updateChitiet = async function (req, res) {
  var query =
    'UPDATE chitiet SET diengiai = "' +
    req.body.diengiai +
    '", tkno = "' +
    req.body.tkno +
    '", tkco = "' +
    req.body.tkco +
    '", sotien = "' +
    req.body.sotien +
    '" WHERE id=' +
    req.body.id

  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: 'Chitiet updated successfully',
      chitiet: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// delete a Chitiet
exports.deleteChitiet = async function (req, res) {
  var query = 'DELETE FROM chitiet WHERE id = ' + req.params.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    res.status(204).json({
      success: true,
      message: 'Chitiet Deleted successfully',
      chitiet: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}
