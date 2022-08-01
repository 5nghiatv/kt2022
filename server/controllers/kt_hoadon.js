// const mysql = require('mysql');
// const express = require('express');
// const dotenv = require('dotenv').config();

// Get all Hoadon
exports.getAllHoadon = async function (req, res) {
  var query = 'SELECT * FROM hoadon'
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: 'A list of all Hoadon',
      hoadons: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// get single Hoadon
exports.getSingleHoadon = async function (req, res) {
  var query = 'SELECT * FROM hoadon WHERE id = ' + req.params.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: `More on: Hoadon`,
      hoadon: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// get ctID Hoadon
exports.getHoadon = async function (req, res) {
  var query =
    'SELECT * FROM hoadon WHERE ctid = ' +
    req.params.ctid +
    ' ORDER BY ngay, sohd'
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: `More on: Hoadon`,
      hoadons: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// Create Hoadon
exports.createHoadon = async function (req, res) {
  var query =
    'INSERT INTO hoadon (`id`,`ctid`,`sohd`,`ngay`,`diengiai`,`masothue`,`thuesuat`,`giaban`,`thuegtgt`,`mausohd`,`mamauhd`,`sohdong`,`ngayhdong`,' +
    '`hinhthuctt`,`diemgiao`,`diemnhan`,`sovandon`,`socontaine`,`dvanchuyen`,`dienthoai`,`tygia` ) ' +
    'VALUES (null,"' +
    req.body.ctid +
    '","' +
    req.body.sohd +
    '","' +
    req.body.ngay +
    '","' +
    req.body.diengiai +
    '","' +
    req.body.masothue +
    '","' +
    req.body.thuesuat +
    '",' +
    req.body.giaban +
    ',' +
    req.body.thuegtgt +
    ',"","","","0001-01-01","","","","","","","",0 )'
  //console.log(query)
  try {
    let rows = await runQuerySync(query, [], req, res)
    req.body.id = rows.insertId
    res.status(201).json({
      success: true,
      message: 'New hoadon created successfully',
      hoadon: req.body,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// update Hoadon
exports.updateHoadon = async function (req, res) {
  //`ctid`,`sohd`,`ngay`,`diengiai`,`masothue`,`thuesuat`,`giaban`,`thuegtg
  var query =
    'UPDATE hoadon SET sohd = "' +
    req.body.sohd +
    '", ngay = "' +
    req.body.ngay +
    '", diengiai = "' +
    req.body.diengiai +
    '", masothue = "' +
    req.body.masothue +
    '", thuesuat = "' +
    req.body.thuesuat +
    '", giaban = ' +
    req.body.giaban +
    ', thuegtgt = ' +
    req.body.thuegtgt +
    ' WHERE id=' +
    req.body.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    res.status(200).json({
      success: true,
      message: 'Hoadon updated successfully',
      hoadon: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// delete a Hoadon
exports.deleteHoadon = async function (req, res) {
  try {
    let rows = await runQuerySync(
      'DELETE FROM hoadon WHERE id = ?',
      [req.params.id],
      req,
      res,
    )
    res.status(204).json({
      success: true,
      message: 'Hoadon Deleted successfully',
      hoadon: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}
