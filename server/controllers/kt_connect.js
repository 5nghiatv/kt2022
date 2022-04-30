const mysql = require('mysql')
// Get all Connects
exports.getFilterConnectSql = async function (req, res) {
  const { email } = req.body // Lấy biến email trong body
  let query = "SELECT * FROM users WHERE email =  '" + email + "'"
  let singleUser = await runQuerySql(query, req, res)
  let databases = ''
  if (singleUser.length > 0) databases = singleUser[0].datalist
  let allConnect = await runQuerySql('SELECT * FROM connect', req, res)
  //console.log(1,singleUser, 2,databases,3,'allConnect' )
  //throw new Error('Đang test, tạm dừng ..........');
  var confilter = [] // Lọc và chọn Database
  var ncount = 0

  var result = new Promise((resolve, reject) => {
    if (singleUser.length == 0 || !databases) resolve(confilter)
    allConnect.forEach((kq, index, array) => {
      //console.log(index,kq.host,kq.username,kq.dataname,kq.password)
      const retcon = mysql.createConnection({
        host: kq.host,
        user: kq.username,
        password: kq.password,
        database: kq.dataname,
      })
      retcon.connect(function (err) {
        // The server is either down
        retcon.query(
          'SELECT MIN(ngay) AS fromdate ,MAX(ngay) AS todate FROM ctuktoan',
          (err, rows, fields) => {
            retcon.destroy()
            ncount++
            if (!err) {
              var conn = allConnect[index]
              conn['fromdate'] = rows[0].fromdate
              conn['todate'] = rows[0].todate
              conn['_id'] = kq.id // Tương thích mongodb
              conn['database'] = kq.dataname // Tương thích mongodb
              if (databases.includes(kq.dataname)) confilter.push(conn)
            }
            if (ncount === array.length) resolve(confilter)
          },
        )
      }) //  retcon.connect()
    }) // allConnect.forEach()
  }) // result = new Promise()
  result.then((ret) => {
    return res
      .status(200)
      .json({
        success: true,
        message: 'A list of all Connect OK',
        connects: ret,
        mongodb: __mongodb,
      })
  })
}
exports.getAllConnectSql = async function (req, res) {
  let query = `SELECT * FROM connect`
  let kq = await runQuerySql(query, req, res)
  if (typeof kq != 'undefined' && kq != []) {
    return res.status(200).json({
      success: true,
      message: 'Mongodb not Connect, use MySQL Database...getAllConnect',
      connectsqls: kq,
    })
  } else {
    res
      .status(500)
      .json({
        success: false,
        message: 'Server error. Please try again.',
        error: '',
      })
  }
}

// get single Connects
exports.getSingleConnectSql = function (req, res) {
  var query = 'SELECT * FROM connect WHERE id = ' + req.params.id
  var mysqlConnection = createConnect(req, res)
  mysqlConnection.connect((err) => {
    if (!err) {
      mysqlConnection.query(query, (err, rows, fields) => {
        mysqlConnection.destroy()
        if (!err) {
          //res.send(rows);
          return res.status(200).json({
            success: true,
            message: `More on: Connects`,
            connectsql: rows,
          })
        } else {
          res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: err.message,
          })
        }
      })
    } else {
      console.log(
        'DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2),
      )
    }
  })
}

exports.findOneConnectSql = function (req, res) {
  var query = `SELECT * FROM connect WHERE email = "` + req.body.email + `"`
  var mysqlConnection = createConnect(req, res)
  mysqlConnection.connect((err) => {
    if (!err) {
      mysqlConnection.query(query, (err, rows, fields) => {
        mysqlConnection.destroy()
        if (!err) {
          //res.send(rows);
          return res.status(200).json({
            success: true,
            message: `More on: Connects`,
            connectsql: rows,
          })
        } else {
          res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: err.message,
          })
        }
      })
    } else {
      console.log(
        'DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2),
      )
    }
  })
}

// Create Connects
exports.createConnectSql = async function (req, res) {
  var query =
    'INSERT INTO connect (`id`, `company`, `taxcode`, `address`, `host`,`dataname`, `username`, `password`, `port`) ' +
    'VALUES (null,"' +
    req.body.company +
    '","' +
    req.body.taxcode +
    '","' +
    req.body.address +
    '","' +
    req.body.host +
    '","' +
    req.body.dataname +
    '","' +
    req.body.Connectname +
    '","' +
    req.body.password +
    '","' +
    req.body.port +
    '")'
  let kq = await runQuerySql(query, req, res)
  if (typeof kq != 'undefined' && kq != []) {
    req.body.id = kq.insertId
    //console.log(req.body)
    res.status(201).json({
      success: true,
      message: 'Mongodb not Connect, use MySQL Database...CreateConnect',
      connectsql: req.body,
    })
  } else {
    res
      .status(500)
      .json({
        success: false,
        message: 'Server error. Please try again.',
        error: '',
      })
  }
}

// update Connects
exports.updateConnectSql = async function (req, res) {
  //company`, `taxcode`, `address`, `host`,`dataname`, `username`, `password`, `port`
  let query =
    'UPDATE connect SET company = "' +
    req.body.company +
    '", taxcode = "' +
    req.body.taxcode +
    '", address = "' +
    req.body.address +
    '", host = "' +
    req.body.host +
    '", dataname = "' +
    req.body.dataname +
    '", username = "' +
    req.body.username +
    '", password = "' +
    req.body.password +
    '", port = "' +
    req.body.port +
    '" WHERE id=' +
    req.body.id
  let kq = await runQuerySql(query, req, res)
  if (typeof kq != 'undefined' && kq != []) {
    return res.status(200).json({
      success: true,
      message: 'Mongodb not Connect, use MySQL Database...UpdateConnect',
      connectsql: kq,
    })
  } else {
    res
      .status(500)
      .json({
        success: false,
        message: 'Server error. Please try again.',
        error: '',
      })
  }
}

// delete a Connects
exports.deleteConnectSql = async function (req, res) {
  let query = 'DELETE FROM connect WHERE id = ' + req.params.id
  let kq = await runQuerySql(query, req, res)
  if (typeof kq != 'undefined' && kq != []) {
    return res.status(204).json({
      success: true,
      message: 'Mongodb not Connect, use MySQL Database...DeleteConnect',
      connectsql: kq,
    })
  } else {
    res
      .status(500)
      .json({
        success: false,
        message: 'Server error. Please try again.',
        error: '',
      })
  }
}
