// const mysql = require('mysql');
// const express = require('express');
// const dotenv = require('dotenv').config();

// Get all Dmtiente
exports.getAllDmtiente = async function (req, res) {
  var query = 'SELECT *,loaitien as value FROM dmtiente ORDER BY loaitien'
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: 'A list of all Dmtiente',
      dmtientes: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// get single Dmtiente
exports.getSingleDmtiente = async function (req, res) {
  var query = 'SELECT * FROM dmtiente WHERE id = ' + req.params.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: `More on: Dmtiente`,
      dmtiente: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// Create Dmtiente
exports.createDmtiente = async function (req, res) {
  var query =
    'INSERT INTO dmtiente (`id`, `loaitien`, `tengoi`, `viettat`, `tygia`) ' +
    'VALUES (null,"' +
    req.body.loaitien +
    '","' +
    req.body.tengoi +
    '","' +
    req.body.viettat +
    '",' +
    req.body.tygia +
    ')'
  try {
    let rows = await runQuerySync(query, [], req, res)
    req.body.id = rows.insertId
    res.status(201).json({
      success: true,
      message: 'New dmtiente created successfully',
      dmtiente: req.body,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// update Dmtiente
exports.updateDmtiente = async function (req, res) {
  var query =
    'UPDATE dmtiente SET loaitien = "' +
    req.body.loaitien +
    '", tengoi = "' +
    req.body.tengoi +
    '", viettat = "' +
    req.body.viettat +
    '", tygia = ' +
    req.body.tygia +
    ' WHERE id=' +
    req.body.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    res.status(200).json({
      success: true,
      message: 'Dmtiente updated successfully',
      dmtiente: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// delete a Dmtiente
exports.deleteDmtiente = async function (req, res) {
  try {
    let rows = await runQuerySync(
      'DELETE FROM dmtiente WHERE id = ?',
      [req.params.id],
      req,
      res,
    )
    res.status(204).json({
      success: true,
      message: 'Dmtiente Deleted successfully',
      dmtiente: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}
