'use strict'

const config = require('../config')
var utils = require('../utils')
var http = require('http')
var stream = require('stream')

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

function post_(action, body, callback) {
  if (body.outPath) config.api.outPath = body.outPath // Nghia Add

  var strBody = JSON.stringify(body)
  var methodName = 'POST'
  var options = init(methodName, strBody)
  options.path = action
  var req = http.request(options, function (res) {
    callback(res)
  })
  console.log('Request body: ' + strBody)
  req.write(strBody, 'utf8')
  req.end()
}

function post(action, body, res) {
  var strBody = JSON.stringify(body)
  //console.log(222, body.outPath, strBody, strBody.outPath)
  var methodName = 'POST'
  var options = init(methodName, strBody)
  options.path = action
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

      // Trường hợp ghi file
      // var filestream = fs.createWriteStream(file)
      // s.pipe(filestream)

      res.setHeader('Content-Disposition', 'attachment; filename=' + file)
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ) // 'application/zip'
      s.pipe(res)
      console.log('Done', file)
    })
  })
  console.log('Request body: ' + strBody)
  req.write(strBody, 'utf8')
  req.end()
}

module.exports = {
  post_: post_,
  post: post,
}
