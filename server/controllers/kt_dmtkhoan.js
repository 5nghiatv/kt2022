// const mysql = require('mysql');
// const express = require('express');
// const dotenv = require('dotenv').config();

// Get all Dmtkhoan
exports.getAllDmtkhoan = async function (req, res) {
  var query = 'SELECT *,sotk as value FROM dmtkhoan ORDER BY sotk'
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: 'A list of all Dmtkhoan',
      dmtkhoans: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// get single Dmtkhoan
exports.getSingleDmtkhoan = async function (req, res) {
  var query = 'SELECT * FROM dmtkhoan WHERE id = ' + req.params.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    res.status(200).json({
      success: true,
      message: `More on dmtkhoan`,
      dmtkhoan: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// Create Dmtkhoan
exports.createDmtkhoan = async function (req, res) {
  var query =
    'INSERT INTO dmtkhoan (`id`,`sotk`,`tkhoan`,`tentk`,`diachi`,`nodn`,`codn`,`nodk`,`codk`,`psno`,`psco`,`lkpsno`,`lkpsco`,`nock`,`cock`,`ghichu`,`loaitien`,`ngoaite`,`thuedt`,`lcheck`,`hanmuc`) ' +
    'VALUES (null,"' +
    req.body.sotk +
    '","","' +
    req.body.tentk +
    '","",' +
    req.body.nodn +
    ',' +
    req.body.codn +
    ',0,0,0,0,0,0,0,0,"","",0,0,0,0' +
    ')'
  //console.log(query)
  try {
    let rows = await runQuerySync(query, [], req, res)
    req.body.id = rows.insertId
    res.status(201).json({
      success: true,
      message: 'New dmtkhoan created successfully',
      dmtkhoan: req.body,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// update Dmtkhoan
exports.updateDmtkhoan = async function (req, res) {
  var query =
    'UPDATE dmtkhoan SET sotk = "' +
    req.body.sotk +
    '", tentk = "' +
    req.body.tentk +
    '", nodn = ' +
    req.body.nodn +
    ', codn = ' +
    req.body.codn +
    ' WHERE id=' +
    req.body.id
  //console.log(query)
  try {
    let rows = await runQuerySync(query, [], req, res)
    res.status(200).json({
      success: true,
      message: 'Dmtkhoan updated successfully',
      dmtkhoan: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// delete a Dmtkhoan
exports.deleteDmtkhoan = async function (req, res) {
  try {
    let rows = await runQuerySync(
      'DELETE FROM dmtkhoan WHERE id = ?',
      [req.params.id],
      req,
      res,
    )
    res.status(204).json({
      success: true,
      message: 'Dmtkhoan Deleted successfully',
      dmtkhoan: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}
