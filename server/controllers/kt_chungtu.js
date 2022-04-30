// const mysql = require('mysql')
// const express = require('express')
// const dotenv = require('dotenv').config()

// Get all Chungtu
exports.getAllChungtu = async function (req, res) {
  var query =
    'SELECT * FROM ctuktoan WHERE ngay >= ? AND ngay <= ? ORDER BY ngay,soct'
  var tudengay = [req.body.pd_fromdate, req.body.pd_todate]
  try {
    let rows = await runQuerySync(query, tudengay, req, res)
    return res.status(200).json({
      success: true,
      message: 'A list of all Chungtu',
      chungtus: rows,
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Server error. Please try again.',
      error: error,
      tudengay: tudengay,
    })
  }
}

// get single Chungtu
exports.getSingleChungtu = async function (req, res) {
  var query = 'SELECT * FROM ctuktoan WHERE id = ' + req.params.id
  try {
    let rows = await runQuerySync(query, [], req, res)
    return res.status(200).json({
      success: true,
      message: `More on Chungtu`,
      chungtu: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// Create Chungtu
exports.createChungtu = async function (req, res) {
  //var ctid = (Date.parse(new Date())/1000).toString().substring(0, 12);
  //var query= 'INSERT INTO ctuktoan (soct, ngay, diengiai, tkno, tkco, sotien,ngaytt,ngaytra,loaitien,ngoaite,userid,matkno,matkco,hopdong,nhom,ghichu,khac,sodk,mamauhd,ctid)  VALUES ("'+req.body.soct+'","'+req.body.ngay +'","'+req.body.diengiai +'","'+req.body.tkno +'","'+req.body.tkco +'", '+req.body.sotien +',"0001-01-01","0001-01-01","001",0,0,"","","","","","","","","'+ctid+'")';
  var query = 'SELECT GetNextCtid() as NextCtid'
  try {
    let rows = await runQuerySync(query, [], req, res)
    req.body.ctid = rows[0].NextCtid // Phải có
    var query =
      'INSERT INTO ctuktoan (soct, ngay, diengiai, tkno, tkco, sotien,ngaytt,ngaytra,loaitien,ngoaite,userid,matkno,matkco,hopdong,nhom,ghichu,khac,sodk,mamauhd,ctid)  VALUES ("' +
      req.body.soct +
      '","' +
      req.body.ngay +
      '","' +
      req.body.diengiai +
      '","' +
      req.body.tkno +
      '","' +
      req.body.tkco +
      '", ' +
      req.body.sotien +
      ',"0001-01-01","0001-01-01","001",0,0,"","","","","","","","","' +
      req.body.ctid +
      '")'
    //console.log(req.body);
    rows = await runQuerySync(query, [], req, res)
    req.body.id = rows.insertId // Phải có
    res.status(201).json({
      success: true,
      message: 'New chungtu created successfully',
      chungtu: req.body,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// update Chungtu
exports.updateChungtu = async function (req, res) {
  var query =
    'UPDATE ctuktoan SET soct = "' +
    req.body.soct +
    '", ngay = "' +
    req.body.ngay +
    '", diengiai = "' +
    req.body.diengiai +
    '", tkno = "' +
    req.body.tkno +
    '", tkco = "' +
    req.body.tkco +
    '", sotien = ' +
    req.body.sotien +
    ' WHERE id=' +
    req.body.id
  // console.log(query)
  try {
    let rows = await runQuerySync(query, [], req, res)
    res.status(200).json({
      success: true,
      message: 'Chungtu updated successfully',
      chungtu: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}

// delete a Chungtu
exports.deleteChungtu = async function (req, res) {
  try {
    let rows = await runQuerySync(
      'DELETE FROM ctuktoan WHERE id = ?',
      [req.params.id],
      req,
      res,
    )
    res.status(204).json({
      success: true,
      message: 'Chungtu Deleted successfully',
      chungtu: rows,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error. Please try again.', error: error })
  }
}
