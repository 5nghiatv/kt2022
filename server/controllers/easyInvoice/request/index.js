'use strict'

const config = require('../config')
var utils = require('../utils')
var http = require('http')
var stream = require('stream')
var fs = require('fs')
const Excel = require('exceljs')

function init(methodName, strBody) {
  let body = JSON.parse(strBody)
  config.common.baseUri = body.host
  config.common.username = body.username
  config.common.password = body.password

  // Thiết lập biến thông tin đăng nhập

  var baseUri = config.common.baseUri
  var authenStr = utils.createAuthenHeader(methodName)
  console.log('Authentication string = ' + authenStr)
  var options = {
    host: baseUri,
    // port: 2294,
    method: methodName.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authentication: authenStr,
      'Content-Length': Buffer.byteLength(strBody),
    },
  }
  console.log('Request info = ' + JSON.stringify(options))
  return options
}

function postOld(body, callback) {
  //if (body.outPath) config.api.outPath = body.outPath // Nghia Add
  let action = body.function
  var strBody = JSON.stringify(body)
  var methodName = 'POST'
  var options = init(methodName, strBody)
  options.path = action
  //console.log(555, options)
  var req = http.request(options, function (res) {
    callback(res)
  })
  //console.log('Request body: ' + strBody)
  req.write(strBody, 'utf8')
  req.end()
}

function callback(res) {
  var responseString = ''
  res.on('data', function (data) {
    responseString += data
  })
  res.on('end', function () {
    console.log('Response = ' + JSON.stringify(responseString))
  })
  console.log('Done')
}

function getDataExcel(strm, res) {
  let workbook = new Excel.Workbook()
  let retData = []
  workbook.xlsx.read(strm).then((workbook) => {
    var workSheet = workbook.getWorksheet('ExportData')
    workSheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
      let currRow = workSheet.getRow(rowNumber)
      if (
        currRow.getCell(2).value +
          currRow.getCell(9).value +
          currRow.getCell(10).value >
        0
      ) {
        retData.push({
          invoiceSeri: currRow.getCell(3).value,
          invoiceNumber: currRow.getCell(5).value,
          createTime: currRow.getCell(6).value,
          buyerTaxCode: currRow.getCell(8).value,
          totalBeforeTax: currRow.getCell(9).value,
          taxAmount: currRow.getCell(10).value,
          taxRate:
            Math.round(
              (currRow.getCell(10).value / currRow.getCell(9).value) * 100,
            ) + '%',
          buyerName: currRow.getCell(7).value,
        })
      }
    })
    //console.log(retData)
    res.status(200).json({
      success: true,
      message: 'Bảng kê Hóa đơn Bán hàng !!',
      data: retData,
    })
  })
}
//function post(action, body, res) {
function post(body, res) {
  let download = body.download * 1
  let action = body.function
  var strBody = JSON.stringify(body)
  //console.log(222, body.download, strBody, strBody.password)

  var methodName = 'POST'
  var options = init(methodName, strBody)
  options.path = action
  //console.log(555, options)
  var req = http.request(options, function (ret) {
    var chunks = []
    ret.on('data', function (data) {
      chunks.push(data)
    })
    ret.on('end', function () {
      //var file = config.api.getInvoicePdf.outPath;
      var file = body.filename
      var s = new stream.Readable({
        read(size) {
          this.push(new Buffer.concat(chunks))
          this.push(null)
        },
      })

      switch (download) {
        case 1: // Download Excel file
          res.setHeader('Content-Disposition', 'attachment; filename=' + file)
          res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ) // 'application/zip'
          s.pipe(res)
          break
        case 2: // Save Excel file
          var filestream = fs.createWriteStream(file)
          s.pipe(filestream)
          res.status(200).json({ message: 'Saved file : ' + file })
          break
        default:
          // GetData Excel file
          getDataExcel(s, res)
          break
      }
      console.log('Done', file)
    })
  })
  console.log('Request body: ' + strBody)
  req.write(strBody, 'utf8')
  req.end()
}

module.exports = {
  postOld: postOld,
  post: post,
}
