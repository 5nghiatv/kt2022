// const mysql = require('mysql');
// const express = require('express');
// const dotenv = require('dotenv').config();

// Get all Dmtenkho
exports.getAllDmtenkho = async function (req, res) {
  var query = 'SELECT *,makho as value FROM dmtenkho ORDER BY makho'
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: 'A list of all Dmtenkho',
      dmtenkhos: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// get single Dmtenkho
exports.getSingleDmtenkho = async function (req, res) {
  var query = 'SELECT * FROM dmtenkho WHERE id = ' + req.params.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: `More on: Dmtenkho`,
      dmtenkho: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// Create Dmtenkho
exports.createDmtenkho = async function (req, res) {
  var query =
    'INSERT INTO dmtenkho (`id`, `makho`, `tengoi`, `diachi`) ' +
    'VALUES (null,"' +
    req.body.makho +
    '","' +
    req.body.tengoi +
    '","' +
    req.body.diachi +
    '")'
  try {
    let rows = await runQuerySync(query, [], req, res)
    req.body.id = rows.insertId
    //console.log(req.body)
    res.status(201).json({
      success: true,
      message: 'New dmtenkho created successfully',
      dmtenkho: req.body,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// update Dmtenkho
exports.updateDmtenkho = async function (req, res) {
  var query =
    'UPDATE dmtenkho SET makho = "' +
    req.body.makho +
    '", tengoi = "' +
    req.body.tengoi +
    '", diachi = "' +
    req.body.diachi +
    '" WHERE id=' +
    req.body.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    res.status(200).json({
      success: true,
      message: 'Dmtenkho updated successfully',
      dmtenkho: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// delete a Dmtenkho
exports.deleteDmtenkho = async function (req, res) {
  try {
    let rows = await runQuerySync(
      'DELETE FROM dmtenkho WHERE id = ?',
      [req.params.id],
      req,
      res,
    )
    res.status(204).json({
      success: true,
      message: 'Dmtenkho Deleted successfully',
      dmtenkho: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}
