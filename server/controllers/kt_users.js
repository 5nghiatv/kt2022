const bcrypt = require('bcryptjs')
// Get all users
exports.getAllUserSql = async function (req, res) {
  let query = `SELECT * FROM users`
  let kq = await runQuerySql(query, req, res)
  if (typeof kq != 'undefined' && kq != []) {
    return res.status(200).json({
      success: true,
      message: 'Mongodb not Connect, use MySQL Database...getAllUsers',
      usersqls: kq,
    })
  } else {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: '',
    })
  }
}

// get single users
exports.getSingleUserSql = async function (req, res) {
  var query = 'SELECT * FROM users WHERE id = ' + req.params.id
  let kq = await runQuerySql(query, req, res)
  if (typeof kq != 'undefined' && kq != []) {
    return res.status(200).json({
      success: true,
      message: 'Mongodb not Connect, use MySQL Database...getOneUser',
      User: kq[0],
      usersql: kq[0], // Tương thích
    })
  } else {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: '',
    })
  }
}

exports.findOneUserSql = async function (req, res) {
  var query = `SELECT * FROM users WHERE email = "` + req.params.email + `"`
  let kq = await runQuerySql(query, req, res)
  if (typeof kq != 'undefined' && kq != []) {
    return res.status(200).json({
      success: true,
      message: 'Mongodb not Connect, use MySQL Database...getOneUser',
      User: kq[0],
      usersql: kq[0], // Tương thích
    })
  } else {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: '',
    })
  }
}

// Create users
exports.createUserSql = async function (req, res) {
  req.body.password = req.body.password
    ? await bcrypt.hash(req.body.password, 10)
    : ''
  let query =
    'INSERT INTO users (`id`, `email`, `username`, `password`, `datalist`, `address`, `position`,`gender`, `image`, `mobile`, `dob`) ' +
    'VALUES (null,"' +
    req.body.email +
    '","' +
    req.body.username +
    '","' +
    req.body.password +
    '","' +
    req.body.datalist +
    '","' +
    req.body.address +
    '","' +
    req.body.position +
    '","' +
    req.body.gender +
    '","' +
    req.body.image +
    '","' +
    req.body.mobile +
    '","' +
    req.body.dob +
    '")'
  //console.log(query)
  let kq = await runQuerySql(query, req, res)
  if (typeof kq != 'undefined' && kq != []) {
    req.body.id = kq.insertId
    res.status(201).json({
      success: true,
      message: 'Mongodb not Connect, use MySQL Database...CreateUser',
      usersql: req.body,
    })
  } else {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: '',
    })
  }
}

// update users
exports.updateUserSql = async function (req, res) {
  if (req.body.newPassword) {
    req.body.password = await bcrypt.hash(req.body.newPassword, 10)
    //console.log('newpas:',req.body.newPassword)
    // Cập nhật cả password nếu có req.body.newPassword
  }

  let query =
    'UPDATE users SET email = "' +
    req.body.email +
    '", position = "' +
    req.body.position +
    '", address = "' +
    req.body.address +
    '", gender = "' +
    req.body.gender +
    '", image = "' +
    req.body.image +
    '", username = "' +
    req.body.username +
    '", password = "' +
    req.body.password +
    '", datalist = "' +
    req.body.datalist +
    '", mobile = "' +
    req.body.mobile +
    '", dob = "' +
    req.body.dob +
    '" WHERE id=' +
    req.body.id
  //console.log(query)

  let kq = await runQuerySql(query, req, res)
  if (typeof kq != 'undefined' && kq != []) {
    return res.status(200).json({
      success: true,
      message: 'Mongodb not Connect, use MySQL Database...UpdateUser',
      usersql: kq,
    })
  } else {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: '',
    })
  }
}

// delete a users
exports.deleteUserSql = async function (req, res) {
  let query = 'DELETE FROM users WHERE id = ' + req.params.id
  let kq = await runQuerySql(query, req, res)
  if (typeof kq != 'undefined' && kq != []) {
    return res.status(204).json({
      success: true,
      message: 'Mongodb not Connect, use MySQL Database...DeleteUser',
      usersql: kq,
    })
  } else {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: '',
    })
  }
}
