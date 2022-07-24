'use strict'

const config = require('../config')
var crypto = require('crypto')

//Generate random 10-characters string
function makeId() {
  var text = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

function createAuthenHeader(methodName) {
  var d = new Date()
  var epochInSecond = Math.round(d.getTime() / 1000)
  var nonce = makeId()
  methodName = methodName.toUpperCase()
  var rawSignature = methodName + epochInSecond + nonce
  var md5Tmp = crypto.createHash('md5').update(rawSignature).digest()
  var signature = Buffer.from(md5Tmp).toString('base64')
  // console.log("createHeader, signature = " + signature);

  var username = config.common.username
  var password = config.common.password
  return (
    signature +
    ':' +
    nonce +
    ':' +
    epochInSecond +
    ':' +
    username +
    ':' +
    password
  )
}

module.exports = {
  createAuthenHeader: createAuthenHeader,
}
