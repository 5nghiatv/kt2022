// const dependencies
require('dotenv').config()
//const mysql = require('mysql')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.use for all : get,post,put ...., app.post ( post oncly)
app.use('/hoadon/:id', async function (req, res) {
  res.status(200).json({
    success: true,
    params: req.params,
    body: req.body,
  })
  console.log(
    'Method: %s %s %s %s %s',
    req.method,
    req.url,
    req.path,
    req.params,
    req.query,
  )
  console.log('body: ', req.body)
})

//----------------------------------------------------
//Create a Server -------> process.env.PORT || 8081  // VÔ CÙNG QUAN TRỌNG --> HEROKU
var server = app.listen(3000, function () {
  console.log(`Server is running on : ${process.env.APP_URL}`)
})
