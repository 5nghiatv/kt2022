// const dependencies
require('dotenv').config()
const mysql = require('mysql')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const passport = require('passport')
const passportStory = require('passport')
const passportTwitter = require('passport')
const passportFacebook = require('passport')
const passportGithub = require('passport')
const passportLinkedin = require('passport')

const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const mainRoutes = require('./server/routes/main-api')
const otherRoutes = require('./server/routes/main-exp')
//const products = require('./server/routes/products');
const employees = require('./server/routes/employees')
const customers = require('./server/routes/customers')
const connects = require('./server/routes/connects')
const usersexp = require('./server/routes/users-exp')
const strip = require('./server/routes/strip')

const serveStatic = require('serve-static')
const path = require('path')

// set up dependencies
const app = express()
app.use(serveStatic(path.join(__dirname, 'dist')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Express session
const session = require('express-session')
// const Redis = require('ioredis')
// const RedisStore = require('connect-redis')(session)
// const clientRedis = new Redis()
app.use(
  session({
    secret: 'secret',
    //store: new RedisStore({ client: clientRedis }),
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //   secure: true,
    //   httpOnly: true,
    // },
  }),
)

// Passport Config
require('./server/configs/passport')(passport)
require('./server/configs/passportStory')(passportStory)
require('./server/configs/passportTwitter')(passportTwitter)
require('./server/configs/passportFacebook')(passportFacebook)
require('./server/configs/passportGithub')(passportGithub)
require('./server/configs/passportLinkedin')(passportLinkedin)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})
global.__basedir = __dirname
global.__user = ''
global.__mongodb = false
global.__poolmysql = null
global.__dbConnect = 'Chưa đăng nhập : Dùng thông tin Database default...'

//global.__connects = [{author: 'Trần Văn Nghĩa'}];
// process.env.DB_CONNECT = JSON.stringify(
//   'Chưa đăng nhập : Dùng thông tin Database default...',
// )
// Global Function
app.locals = require('./server/helpers/ejs_helpers')
app.locals.globalUser = { googleId: '' }

// extended: true && in Postman->body-> x-www-form-urlencoded->input ->OK

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

// Không thể KHÔNG CÓ NÓ
const corsOptions = {
  exposedHeaders: 'Authorization',
  credentials: true,
  origin: true,
}
app.use(cors(corsOptions))

app.use(logger('dev'))
app.use(async function (req, res, next) {
  //console.log(req.user); // Chỉ có khi đăng nhập
  if (
    req.query._method == 'POST' ||
    req.query._method == 'PUT' ||
    req.query._method == 'DELETE' ||
    req.query._method == 'PATCH'
  ) {
    req.method = req.query._method
    req.url = req.path
    console.log('Method: %s %s %s %', req.method, req.url, req.path)
    console.log(req.body)
  }

  next()
})

app.use(function (err, req, res, next) {
  console.log(err)
  res.send(500)
  // res.status(500).json({success: "Error code 500  !!"  });
})

//------------------------------------E-COMMERCE
//const api = require("./server/routes/e-commerce/api");
const stripeApi = require('./server/routes/e-commerce/stripeApi')
const productApi = require('./server/routes/e-commerce/productApi')
const ShippingDetailApi = require('./server/routes/e-commerce/shippingDetailApi')
// const authApi = require("./server/routes/e-commerce/authApi__");
app.use('/api', [stripeApi, productApi, ShippingDetailApi])
//------------------------------------

// set up route
app.use('/api/', mainRoutes)
app.use('/exp/', otherRoutes)
app.use('/users', require('./server/routes/users.js'))
app.use('/social', require('./server/routes/story'))
app.use('/mysql', require('./server/routes/mysql-heroku'))
//app.use('/', products); Không dùng hiệu chỉnh trên server
app.use('/', employees)
app.use('/', customers)
app.use('/', connects)
app.use('/', usersexp)
app.use('/', strip)

app.use('/upl', require('./server/routes/uploads.js'))

//----------------------------------------------------
//Create a Server -------> process.env.PORT || 8080  // VÔ CÙNG QUAN TRỌNG --> HEROKU
var server = app.listen(process.env.PORT || 8081, function () {
  var port = server.address().port
  console.log(`Server is running on : ${port}`)
})
//----------------------------------------------------

// set up mongoose - select connect NODJS in mongodb
var ur5 = process.env.MONGODB_URL_KETOAN
//"mongodb+srv://nghiatv:Tranmeji1@cluster0-ql9ch.mongodb.net/ketoan?retryWrites=true&w=majority";
// var uri = 'mongodb+srv://nghiatv:Tranmeji1@cluster0-qf5xp.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(
  ur5,
  { autoIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (!err) {
      ;(global.__mongodb = true), console.log('MongoDB ketoan connected OK !!')
    } else {
      console.log('Error connecting to database: ' + err)
    }
  },
)

//----------------------------------------------------

app.get('/restart', function (req, res, next) {
  process.exit(1)
})

app.use('*', (req, res) => {
  res.render('pages/404')
  // res.render(path + "404.ejs");
})
global.choiceConnect = function () {
  let connect2 = {
    // Database GỐC
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connect_timeout: 30000,
    connectionLimit: 8,
    idleTimeoutMillis: 30000,
    multipleStatements: true,
  }

  let connect = __dbConnect // Nếu đã đăng nhập thì set New
  if (connect && connect.database) {
    connect2.host = connect.host
    connect2.user = connect.username
    connect2.password = connect.password
    connect2.database = connect.database
    connect2.port = connect.port
  }
  console.log('Connect >> ' + connect2.database, connect2.user)
  return connect2
}

global.createConnect = function (req, res) {
  let connectOpt = choiceConnect()
  return mysql.createConnection(connectOpt)
}

// global.runQuery = function (query, fromtodate, req, res, fn) {
//   var mysqlConnection = createConnect(req, res)
//   mysqlConnection.connect((err) => {
//     if (!err) {
//       mysqlConnection.query(query, fromtodate, (err, rows, fields) => {
//         mysqlConnection.destroy()
//         fn(rows)
//       })
//     } else {
//       console.log(
//         'DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2),
//       )
//       //process.kill(__process_pid);
//       fn([])
//       //throw new Error('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
//     }
//   })
// }

global.runQuerySyncOld = async function (query, params, req, res) {
  var mysqlConnection = createConnect(req, res)
  mysqlConnection.connect((err) => {
    if (err) {
      console.log('Error: ' + err.message)
    }
  })
  try {
    const response = await new Promise((resolve, reject) => {
      mysqlConnection.query(query, params, (err, results) => {
        mysqlConnection.destroy()
        if (err) reject(err)
        resolve(results)
      })
    })
    return response
  } catch (err) {
    console.log(500, err)
  }
}

global.runQuerySql = async function (query, req, res) {
  // console.log(1,'Hàm này LUÔN LUÔN Chạy Database Gốc MỚI CÓ THÔNG TIN user & connect')
  console.log('ConnectS >> ' + process.env.DB_DATABASE, process.env.DB_USERNAME)
  // Database GỐC
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  })

  //const connection = createConnect(req, res);
  connection.connect((err) => {
    if (err) {
      console.log('Error: ' + err.message)
    }
  })
  try {
    const response = await new Promise((resolve, reject) => {
      connection.query(query, [], (err, results) => {
        connection.destroy()
        if (err) reject(err)
        resolve(results)
      })
    })
    return response
  } catch (error) {
    console.log(500, error)
  }
}

global.runQuerySync = async function (query, params) {
  if (!__poolmysql) __poolmysql = mysql.createPool(choiceConnect())
  const resp = await new Promise((resolve, reject) => {
    __poolmysql.getConnection(async function (err, connection) {
      if (err) throw err // not connected!
      // Use the connection
      try {
        const response = await new Promise((resolve, reject) => {
          connection.query(query, params, function (err, results, fields) {
            connection.release()
            if (err) reject(err)
            resolve(results)
            // Handle error after the release.
            // Don't use the connection here, it has been returned to the pool.
          })
        })
        //console.log('response & host:', response.length, choiceConnect())
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  })
  return resp
}
