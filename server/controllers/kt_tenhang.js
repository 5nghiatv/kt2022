// const mysql = require('mysql');
// const express = require('express');
// const dotenv = require('dotenv').config();

// Get all Tenhang
exports.getAllTenhang = async function (req, res) {
  var query = 'SELECT *,mahang as value FROM tenhang ORDER BY mahang'
  try {
    let rows = await runQuerySync(query, [], req, res)
    res.status(200).json({
      success: true,
      message: 'A list of all Tenhang',
      tenhangs: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// get single Tenhang
exports.getSingleTenhang = async function (req, res) {
  var query = 'SELECT * FROM tenhang WHERE id = ' + req.params.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    res.status(200).json({
      success: true,
      message: `More on: Tenhang`,
      tenhang: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// Create Tenhang
exports.createTenhang = async function (req, res) {
  var query =
    'INSERT INTO tenhang (`id`,`mahang`,`tenhang`,`donvi`,`sotk`,`userid`,`dongiakh`,`thuedt`,`dutru`,`newdonvi`,`newluong`,`dutrutt`,`dutrutd`,`table_`,`postion`,`code`,`descriptio`) ' +
    'VALUES (null,"' +
    req.body.mahang +
    '","' +
    req.body.tenhang +
    '","' +
    req.body.donvi +
    '","",0,0,0,0,"","",0,0,"","","","")'
  try {
    let rows = await runQuerySync(query, [], req, res)
    req.body.id = rows.insertId
    res.status(201).json({
      success: true,
      message: 'New tenhang created successfully',
      tenhang: req.body,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// update Tenhang
exports.updateTenhang = async function (req, res) {
  var query =
    'UPDATE tenhang SET mahang = "' +
    req.body.mahang +
    '", tenhang = "' +
    req.body.tenhang +
    '", donvi = "' +
    req.body.donvi +
    '" WHERE id=' +
    req.body.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    res.status(200).json({
      success: true,
      message: 'Tenhang updated successfully',
      tenhang: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// delete a Tenhang
exports.deleteTenhang = async function (req, res) {
  try {
    let rows = await runQuerySync(
      'DELETE FROM tenhang WHERE id = ?',
      [req.params.id],
      req,
      res,
    )
    res.status(204).json({
      success: true,
      message: 'Tenhang Deleted successfully',
      tenhang: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}
