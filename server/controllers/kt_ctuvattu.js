// const mysql = require('mysql')
// const express = require('express')
// const dotenv = require('dotenv').config()


// Get all Ctuvattu
exports.getAllCtuvattu = async function (req, res) {
  var query = 'SELECT * FROM ctuvattu'
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: 'A list of all Ctuvattu',
      ctuvattus: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// get single Ctuvattu
exports.getSingleCtuvattu = async function (req, res) {
  var query = 'SELECT * FROM ctuvattu WHERE id = ' + req.params.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: `More on: Ctuvattu`,
      ctuvattu: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// get ctID Ctuvattu
exports.getCtuvattu = async function (req, res) {
  var query = 'SELECT * FROM ctuvattu WHERE ctid = ' + req.params.ctid
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: `More on: Ctuvattu`,
      ctuvattus: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}
// Create Ctuvattu
exports.createCtuvattu = async function (req, res) {
  var query =
    'INSERT INTO ctuvattu (`id`, `ctid`, `mahang`, `makho`, `soluong`, `sotien`, `dongia`,`vtkhac`,`ngoaite`,`doituong`,`giaban`,`thue`,`soluong2`,`doituong2`) ' +
    'VALUES (null,"' +
    req.body.ctid +
    '","' +
    req.body.mahang +
    '","' +
    req.body.makho +
    '","' +
    req.body.soluong +
    '","' +
    req.body.sotien +
    '",0,"",0,"",0,0,0,"")'
  try {
    let rows = await runQuerySync(query, [], req, res)
    req.body.id = rows.insertId
    //console.log(req.body)
    res.status(201).json({
      success: true,
      message: 'New ctuvattu created successfully',
      ctuvattu: req.body,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// update Ctuvattu
exports.updateCtuvattu = async function (req, res) {
  var query =
    'UPDATE ctuvattu SET mahang = "' +
    req.body.mahang +
    '", makho = "' +
    req.body.makho +
    '", soluong = "' +
    req.body.soluong +
    '", sotien = "' +
    req.body.sotien +
    '" WHERE id=' +
    req.body.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    res.status(200).json({
      success: true,
      message: 'Ctuvattu updated successfully',
      ctuvattu: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// delete a Ctuvattu
exports.deleteCtuvattu = async function (req, res) {
  try {
    let rows = await runQuerySync(
      'DELETE FROM ctuvattu WHERE id = ?',
      [req.params.id],
      req,
      res,
    )
    res.status(204).json({
      success: true,
      message: 'Ctuvattu Deleted successfully',
      ctuvattu: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}
