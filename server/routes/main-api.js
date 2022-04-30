const express = require('express')
const fs = require('fs')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../configs/auth-api')
const { User } = require('../models/User')
const request = require('request')
const dotenv = require('dotenv')
dotenv.config()

const {
  createConnectSql,
  getAllConnectSql,
  getFilterConnectSql,
  getSingleConnectSql,
  updateConnectSql,
  deleteConnectSql,
} = require('../controllers/kt_connect')
const {
  createUserSql,
  getAllUserSql,
  getSingleUserSql,
  updateUserSql,
  deleteUserSql,
  findOneUserSql,
} = require('../controllers/kt_users')
const {
  createConnect,
  getAllConnect,
  getFilterConnect,
  getSingleConnect,
  updateConnect,
  deleteConnect,
} = require('../controllers/connect')
const {
  createUser,
  getAllUser,
  getSingleUser,
  getUserEmail,
  updateUser,
  deleteUser,
} = require('../controllers/user')
const {
  createEmployee,
  getAllEmployee,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employee')
const {
  createCustomer,
  getAllCustomer,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customer')

//const { get } = require('core-js/fn/dict');
const {
  createCustomer_,
  getAllCustomer_,
  getSingleCustomer_,
  getCusTaxcode,
  updateCustomer_,
  deleteCustomer_,
} = require('../controllers/kt_customer')
const {
  createChungtu,
  getAllChungtu,
  getSingleChungtu,
  updateChungtu,
  deleteChungtu,
} = require('../controllers/kt_chungtu')
const {
  createDmtkhoan,
  getAllDmtkhoan,
  getSingleDmtkhoan,
  updateDmtkhoan,
  deleteDmtkhoan,
} = require('../controllers/kt_dmtkhoan')
const {
  createDmtiente,
  getAllDmtiente,
  getSingleDmtiente,
  updateDmtiente,
  deleteDmtiente,
} = require('../controllers/kt_dmtiente')
const {
  createDmtenkho,
  getAllDmtenkho,
  getSingleDmtenkho,
  updateDmtenkho,
  deleteDmtenkho,
} = require('../controllers/kt_dmtenkho')
const {
  createTenhang,
  getAllTenhang,
  getSingleTenhang,
  updateTenhang,
  deleteTenhang,
} = require('../controllers/kt_tenhang')

const {
  createChitiet,
  getAllChitiet,
  getChitiet,
  getSingleChitiet,
  updateChitiet,
  deleteChitiet,
} = require('../controllers/kt_chitiet')
const {
  createCtuvattu,
  getAllCtuvattu,
  getCtuvattu,
  getSingleCtuvattu,
  updateCtuvattu,
  deleteCtuvattu,
} = require('../controllers/kt_ctuvattu')
const {
  createHoadon,
  getAllHoadon,
  getHoadon,
  getSingleHoadon,
  updateHoadon,
  deleteHoadon,
} = require('../controllers/kt_hoadon')

const {
  uynhiemchi,
  sendmail,
  restoreData,
  getInhoadon,
  tatoansodutk,
  getCtuvattus,
  getCtuktoans,
  getVnDong,
  dmketoanXLSX,
  getenv,
  backupData,
  backupTable,
  thuegtgtXLSX,
  candoihhXLSX,
  candoipsXLSX,
  sonhatky,
  sonhatkyhh,
  test,
  invoice,
  BaocaoBctcXML,
  BaocaoBctcXLSX,
  BaocaoTndn,
  BaocaoThuegtgt,
  BaocaoHoadon,
  query,
  chuyensoduhang,
  chuyensodutk,
  tinhcandoihang,
  tinhcandoips,
  cdketoan,
  ketquakd,
  lctiente,
  dmsodutks,
  dmkhohags,
} = require('../controllers/kt_tinhtoan')

const { vfpUpload } = require('../../data/vfp/vfpupload')

// ============== TẮT sẽ tạm thời Tắt Đăng Nhập ==========
router.use(auth, function (req, res, next) {
  next()
})

//router.get('/users/:filename', (req, res) => {
// products dùng trong e-commerce/productApi

router.post('/vfpupload', vfpUpload)

router.post('/sendmail', sendmail)
router.get('/restoreData/:filedropbox', restoreData)
router.post('/getInhoadon', getInhoadon)
router.post('/tatoansodutk', tatoansodutk)
router.post('/getCtuvattu', getCtuvattus)
router.post('/getCtuktoan', getCtuktoans)
router.get('/getVnDong/:num', getVnDong)
router.get('/getenv/:env', getenv)
router.get('/backupData', backupData)
router.get('/backupTable', backupTable)
router.get('/dmketoanXLSX', dmketoanXLSX)
router.get('/thuegtgtXLSX', thuegtgtXLSX)
router.get('/candoihhXLSX', candoihhXLSX)
router.get('/candoipsXLSX', candoipsXLSX)
router.get('/uynhiemchi', uynhiemchi)
router.get('/sonhatky', sonhatky)
router.get('/sonhatkyhh', sonhatkyhh)
router.get('/baocaotc', (req, res) => {
  //res.send(req.body)

  if (req.query.filename.toUpperCase().includes('KK-HOADON-BC26'))
    return BaocaoHoadon(req, res)
  if (req.query.filename.toUpperCase().includes('KK_01_GTGT'))
    return BaocaoThuegtgt(req, res)
  if (req.query.filename.toUpperCase().includes('KK-03-TNDN'))
    return BaocaoTndn(req, res)
  if (req.query.filename.toUpperCase().includes('KK-BC-TAICHINH.XML'))
    return BaocaoBctcXML(req, res)
  if (req.query.filename.toUpperCase().includes('TM-BC-TAICHINH.XLSX'))
    return BaocaoBctcXLSX(req, res)

  res.status(200).json({
    success: true,
    message: 'Chưa thiết kế !!',
    filename: '',
  })
})
router.get('/download/:filename', (req, res) => {
  //res.send(req.body)
  var path = 'public/download/down-temp/' + req.params.filename
  try {
    if (fs.existsSync(path)) {
      res.download(path)
    }
  } catch (err) {
    console.error(err)
  }
})
router.get('/setcolor/:filename', (req, res) => {
  // res.send(req.params.filename);
  fs.readFile(
    'src/assets/scss/' + req.params.filename,
    'utf-8',
    (err, content) => {
      if (err) {
        throw err
      }
      fs.writeFileSync('src/assets/scss/_variables.scss', content)
      console.log(111, 'Ok, SetColor : ' + req.params.filename)
      res
        .status(200)
        .json({
          message: 'setColor successFully...',
          filename: req.params.filename,
        })
        .end()
    },
  )
})
// router.get('/test/:filedropbox',(req, res) => {
//   console.log(req.params)
//   test(req, res);
// });
router.get('/test', test)
router.get('/invoice', invoice)

router.get('/testdb', async (req, res) => {
  let query = `SELECT * FROM users LIMIT 1 OFFSET 1`
  let query2 =
    `SELECT ROUTINE_NAME FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_SCHEMA = "` +
    process.env.DB_DATABASE +
    `" AND ROUTINE_TYPE = "PROCEDURE"`
  let kq = await runQuerySql(query, req, res)
  let kq2 = await runQuerySql(query2, req, res)
  let kq1 = await runQuerySync(`SELECT * FROM connect LIMIT 1 OFFSET 1`, req, res)
  let connect_Option = __dbConnect // JSON.parse(process.env.DB_CONNECT)
  return res.status(200).json({
    APP_URL: process.env.APP_URL,
    sqlCheck: query,
    connect_Default: {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
    },
    logged: connect_Option.username && connect_Option.password ? true : false,
    mongodb: __mongodb,
    connect_Option: connect_Option,
    getUsers: kq
      ? kq
      : 'Run Sql ERROR : Check info connect Database & getUser... ',
    connect_upload: kq1
      ? kq1
      : 'Run Sql ERROR : Check info connect Database & getUser_upload... ',
    getProcedures: kq2
      ? kq2
      : 'Run Sql ERROR : Check info connect Database & Procedure... ',
  })
})

router.post('/query', query)

router.post('/connects', getFilterConnect)
router.get('/connects', getAllConnect)
router.put('/connects', getAllConnect)
router.get('/connect/:id', getSingleConnect)
router.post('/connect', createConnect)
router.patch('/connect/:id', updateConnect)
router.delete('/connect/:id', deleteConnect)
router.post('/connect/:id', deleteConnect)

router.post('/connectsqls', getFilterConnectSql)
router.get('/connectsqls', getAllConnectSql)
router.put('/connectsqls', getAllConnectSql)
router.get('/connectsql/:id', getSingleConnectSql)
router.post('/connectsql', createConnectSql)
router.patch('/connectsql/:id', updateConnectSql)
router.delete('/connectsql/:id', deleteConnectSql)
router.post('/connectsql/:id', deleteConnectSql)

router.post('/tinhcandoips', tinhcandoips)
router.post('/tinhcandoihang', tinhcandoihang)
router.post('/chuyensodutk', chuyensodutk)
router.post('/chuyensoduhang', chuyensoduhang)

router.post('/dmsodutks', dmsodutks)
router.post('/dmkhohags', dmkhohags)
//router.get('/dmkhohag/:nam', dmkhohag );
//router.get('/dmsodutk/:nam', dmsodutk );
router.post('/cdketoan', cdketoan)
router.post('/ketquakd', ketquakd)
router.post('/lctiente', lctiente)

router.post('/hoadon', createHoadon)
router.get('/hoadons', getAllHoadon)
router.get('/hoadons/:ctid', getHoadon)
router.get('/hoadon/:id', getSingleHoadon)
router.patch('/hoadon/:id', updateHoadon)
router.delete('/hoadon/:id', deleteHoadon)
router.post('/hoadon/:id', deleteHoadon)

router.post('/ctuvattu', createCtuvattu)
router.get('/ctuvattus', getAllCtuvattu)
router.get('/ctuvattus/:ctid', getCtuvattu)
router.get('/ctuvattu/:id', getSingleCtuvattu)
router.patch('/ctuvattu/:id', updateCtuvattu)
router.delete('/ctuvattu/:id', deleteCtuvattu)
router.post('/ctuvattu/:id', deleteCtuvattu)

router.post('/chitiet', createChitiet)
router.get('/chitiets', getAllChitiet)
router.get('/chitiets/:ctid', getChitiet)
router.get('/chitiet/:id', getSingleChitiet)
router.patch('/chitiet/:id', updateChitiet)
router.delete('/chitiet/:id', deleteChitiet)
router.post('/chitiet/:id', deleteChitiet)

router.post('/tenhang', createTenhang)
router.get('/tenhangs', getAllTenhang)
router.get('/tenhang/:id', getSingleTenhang)
router.patch('/tenhang/:id', updateTenhang)
router.delete('/tenhang/:id', deleteTenhang)
router.post('/tenhang/:id', deleteTenhang)

router.post('/dmtenkho', createDmtenkho)
router.get('/dmtenkhos', getAllDmtenkho)
router.get('/dmtenkho/:id', getSingleDmtenkho)
router.patch('/dmtenkho/:id', updateDmtenkho)
router.delete('/dmtenkho/:id', deleteDmtenkho)
router.post('/dmtenkho/:id', deleteDmtenkho)

router.post('/dmtiente', createDmtiente)
router.get('/dmtientes', getAllDmtiente)
router.get('/dmtiente/:id', getSingleDmtiente)
router.patch('/dmtiente/:id', updateDmtiente)
router.delete('/dmtiente/:id', deleteDmtiente)
router.post('/dmtiente/:id', deleteDmtiente)

router.post('/dmtkhoan', createDmtkhoan)
router.get('/dmtkhoans', getAllDmtkhoan)
router.get('/dmtkhoan/:id', getSingleDmtkhoan)
router.patch('/dmtkhoan/:id', updateDmtkhoan)
router.delete('/dmtkhoan/:id', deleteDmtkhoan)
router.post('/dmtkhoan/:id', deleteDmtkhoan)

router.post('/chungtu', createChungtu)
router.post('/chungtus', getAllChungtu)
router.get('/chungtu/:id', getSingleChungtu)
router.patch('/chungtu/:id', updateChungtu)
router.delete('/chungtu/:id', deleteChungtu)
router.post('/chungtu/:id', deleteChungtu)

router.post('/customer_', createCustomer_)
router.get('/customers_', getAllCustomer_)
router.get('/customer_/:id', getSingleCustomer_)
router.get('/custaxcode/:id', getCusTaxcode)
router.patch('/customer_/:id', updateCustomer_)
router.delete('/customer_/:id', deleteCustomer_)
router.post('/customer_/:id', deleteCustomer_)

// router.get('/user') - router.post('/login') - router.delete('/logout') - router.post('/register')
// Ở BÊN DƯỚI

router.post('/usersql', createUserSql)
router.get('/usersqls', getAllUserSql)
router.get('/usersql', findOneUserSql)
router.get('/usersql/:id', getSingleUserSql)
router.patch('/usersql/:id', updateUserSql)
router.delete('/usersql/:id', deleteUserSql)
router.post('/usersql/:id', deleteUserSql)

router.post('/user', createUser)
router.get('/users', getAllUser)
router.get('/user/:id', getSingleUser)
router.get('/useremail/:email', getUserEmail)
router.patch('/user/:id', updateUser)
router.delete('/user/:id', deleteUser)
router.post('/user/:id', deleteUser)

router.post('/employee', createEmployee)
router.get('/employees', getAllEmployee)
router.get('/employee/:id', getSingleEmployee)
router.patch('/employee/:id', updateEmployee)
router.delete('/employee/:id', deleteEmployee)
router.post('/employee/:id', deleteEmployee)

router.post('/customer', createCustomer)
router.get('/customers', getAllCustomer)
router.get('/customer/:id', getSingleCustomer)
router.patch('/customer/:id', updateCustomer)
router.delete('/customer/:id', deleteCustomer)
router.post('/customer/:id', deleteCustomer)

//---------------------------
// FOR CALL API
//---------------------------

router.get('/user', async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user)
})

router.post('/register', async (req, res) => {
  //find an existing user

  //__mongodb = false;   // test ==============================

  let user = [],
    token = '',
    query = ''
  let pasw = await bcrypt.hash(req.body.password, 10)
  if (__mongodb) {
    user = await User.findOne({ email: req.body.email })
    if (user)
      return res
        .status(400)
        .json({ success: false, message: 'User already registered !!' })
    user = new User({
      name: req.body.name,
      password: pasw,
      email: req.body.email,
    })
    //user.password = await bcrypt.hash(user.password, 10);
    await user.save()
    //token = user.generateAuthToken();
  } else {
    user = {
      _id: '',
      name: req.body.name,
      password: pasw,
      email: req.body.email,
    }
    query = `SELECT * FROM users WHERE email = "` + req.body.email + `"`
    let chkuser = await runQuerySql(query)
    if (chkuser.length > 0) {
      return res.status(400).send('User already registered.')
    }

    query =
      'INSERT INTO users (`id`,`username`,`name`,`email`,`password` ) ' +
      'VALUES (null,"' +
      user.name +
      '","' +
      user.name +
      '","' +
      user.email +
      '","' +
      user.password +
      '")'
    let kq = await runQuerySql(query)
    //console.log(kq);
    user._id = kq.insertId
  }
  //console.log(user);
  token = __mongodb
    ? await user.generateAuthToken()
    : generateAuthTokenSql(user)

  res.header('x-auth-token', token).send({
    _id: user._id,
    name: user.name,
    email: user.email,
  })
})

router.delete('/logout', (req, res) => {
  //refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

router.post('/login', async (req, res) => {
  //find an existing user
  //__connects.push(req.body);
  // global.__connects[req.body.email] = req.body.connect;
  // global.__connects['email'] = req.body.email;
  // global.__connects['loginPre'] = req.body.connect;

  //console.log('login: ',4,__connects)  // email: '123456@gmail.com',  password: '123456',  datalogin_id: '5f9008650bf2002cc8f28857'

  let user = ''
  if (__mongodb) {
    user = await User.findOne({ email: req.body.email })
  } else {
    const query = `SELECT * FROM users WHERE email = "` + req.body.email + `"`
    user = await runQuerySql(query, req, res)
    if (user.length > 0) {
      user = user[0]
    } else {
      user = ''
    }
  }
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: 'This user is not registered ...' })

  const bool = bcrypt.compareSync(req.body.password, user.password)
  if (!bool)
    return res.status(401).json({
      success: false,
      message: 'Access denied, Incorrect username or password ...',
    })
  //throw new Error('Access denied, Incorrect username or password ...');
  const getToken = __mongodb
    ? await user.generateAuthToken()
    : generateAuthTokenSql(user)
  //console.log(user.verify(getToken.token).user)
  // API return affter login successfully
  const response = {
    Token: getToken.token,
    RefreshToken: getToken.refreshtoken,
    expiresIn: getToken.expiresIn,
    user: user,
  }

  req.session.refreshtoken = getToken.refreshtoken
  __dbConnect = req.body.connect
  __poolmysql = null // Sẽ buộc tạo pool mới ( Nếu có đổi Database)

  res.header('Authorization', getToken.token).send(response)
})

router.post('/refreshtoken', async (req, res) => {
  const { RefreshToken } = req.body
  if (req.session.refreshtoken != RefreshToken) {
    console.log('refreshToken KHÔNG có trong session...')
    return res.status(401).send('Access denied. No token provided.')
  }
  console.log('refreshToken có trong session & cấp lại token...')

  const decode = jwt.verify(RefreshToken, process.env.PRIVATE_KEY)
  const user = await User.findOne({ email: decode.user.email })
  //console.log(444, user)
  const getToken = __mongodb
    ? await user.generateAuthToken()
    : generateAuthTokenSql(user)
  //console.log(user.verify(getToken.token).user)
  // API return affter login successfully
  console.log('Đã refreshToken sau : ' + getToken.expiresIn)
  const response = {
    Token: getToken.token,
    RefreshToken: getToken.refreshtoken,
    expiresIn: getToken.expiresIn,
    user: user,
  }
  res.header('Authorization', getToken.token).send(response)
})

function generateAuthTokenSql(user) {
  const expire = `${process.env.TOKENLIFE}`
  const token = jwt.sign(
    { _id: user.id, isAdmin: user.admin, user: user },
    process.env.PRIVATE_KEY,
    { expiresIn: expire },
  )
  const refreshtoken = jwt.sign(
    { _id: user.id, isAdmin: user.admin, user: user },
    process.env.PRIVATE_KEY,
    { expiresIn: `${process.env.REFRESHTOKENLIFE}` },
  )

  //get the private key from the config file -> environment variable
  //console.log(jwt.verify(token, process.env.PRIVATE_KEY) )
  return { token: token, refreshtoken: refreshtoken, expiresIn: expire }
}

module.exports = router
