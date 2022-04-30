const { ensureAuthenticated, forwardAuthenticated } = require('../configs/auth')
const express = require('express')
const router = express.Router()
var mongoose = require('mongoose'),
  Admin = mongoose.mongo.Admin,
  mongoclient = require('mongodb').MongoClient
var fastcsv = require('fast-csv')
var fs = require('fs')
const dotenv = require('dotenv').config()
var dbName = 'ketoan'
// var dbName = 'test';
var ur5 = process.env.MONGODB_URL_KETOAN
//"mongodb+srv://nghiatv:Tranmeji1@cluster0-ql9ch.mongodb.net/"+ dbName +"?retryWrites=true&w=majority";

const Employee = require('../models/employee')
const Customer = require('../models/customer')
// Riêng User PHẢI KHÁC do ??????? { user }
const { User } = require('../models/User')

// ==============  Disabled tạm thời
router.use(ensureAuthenticated, function (req, res, next) {
  next()
})

// set up route- index page || Welcome Page
router.get('/', forwardAuthenticated, (req, res) =>
  res.render('pages/dashboard', {}),
)
// Dashboard
router.get('/dashboard', (req, res) => res.render('pages/dashboard', {}))

// about page
router.get('/about', (req, res) =>
  res.render('pages/about', {
    //user: req.user,
    //isDisabled: 'Disabled'
  }),
)

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
router.get('/getdb', (req, res) => {
  // create a connection to the DB & get AllDatabase
  var conn = mongoose.createConnection(ur5)
  conn.on('open', function () {
    // connection established
    new Admin(conn.db).listDatabases(function (err, result) {
      if (err) throw err
      console.log('listDatabases succeeded')
      // database list stored in result.databases
      var Dbs = result.databases
      console.log(Dbs)
      var strdb = 'List Database : '
      Dbs.forEach((element) => {
        strdb = strdb + '  &#8226;  ' + element.name
      })
      res.status(200).json({ success: strdb })
    })
  })
  conn.close()
})

//---------------------------------
router.get('/backupdb', async (req, res) => {
  const client = await mongoclient.connect(ur5, {})
  const myDB = client.db(dbName)
  const listColls = await myDB.listCollections().toArray()
  let listbk = 'List backup: '
  // await listColls.forEach( async (item, index) => {
  for (let index = 0; index < listColls.length; index++) {
    const itemname = listColls[index].name
    const myCollDat = await myDB.collection(itemname).find({}).toArray()
    const ws = await fs.createWriteStream(
      __dirname + '/../backup/' + itemname + '.csv',
    )
    if (!itemname.includes('.')) {
      listbk = listbk + '  &#8226;  ' + itemname
      await fastcsv
        .write(myCollDat, { headers: true })
        .on('finish', function () {
          console.log(index + 1, itemname + '.csv')
        })
        .pipe(ws)
    }

    if (listColls.length - 1 == index + 1) {
      client.close()
      console.log(`Đã sao lưu ${index + 1}/${listColls.length - 1} collection.`)
      res.status(200).json({ success: listbk })
    }
  }
  // close connection
  if (listColls.length == 0) client.close()
})

//----------------------------------------
router.get('/importcust', async function (req, res) {
  //---------------------------------
  let clname = 'customers'
  const client = await mongoclient.connect(ur5, {})
  const myDB = client.db(dbName)
  deleteCollection(client, clname, res)

  let stream = fs.createReadStream(__dirname + '/../backup/' + clname + '.csv')
  // console.log(stream);
  let csvData = []
  let csvStream = fastcsv
    .parse()
    .on('data', function (data) {
      var str = data[1]
      acc = str.replace('[, ]', '').replace('[', '').replace(']', '')

      var item = new Customer({
        accounts: Array.from(acc.split(','), Number),
        fullname: data[2],
        email: data[3],
        mobile: data[4],
        address: data[5],
        birthdate: data[6],
        taxcode: data[7],
        active: data[8],
      })
      csvData.push(item)
    })
    .on('end', async function () {
      // remove the first line: header
      csvData.shift()
      //console.log(csvData);
      const resCollct = await myDB.collection(clname).insertMany(csvData)
      if (resCollct) {
        console.log(`Inserted: ${resCollct.insertedCount} rows`)
        client.close()
        res.status(200).json({
          success: 'Collection [' + clname + '] RESTORE Succesfully !!',
        })
      } else {
        console.log(clname + ' data exported to <' + ur5 + '> ERROR !!')
        res
          .status(200)
          .json({ success: 'Collection [' + clname + '] ERROR !!' })
      }
    })
  stream.pipe(csvStream)
  //res.json({success : clname+" data exported to <"+ ur5 +"> Successfully.", status : 200});
})

//----------------------------------------
router.get('/importempl', async function (req, res) {
  //---------------------------------
  let clname = 'employees'
  const client = await mongoclient.connect(ur5, {})
  const myDB = client.db(dbName)
  deleteCollection(client, clname, res)

  let stream = fs.createReadStream(__dirname + '/../backup/' + clname + '.csv')
  let csvData = []
  let csvStream = fastcsv
    .parse()
    .on('data', function (data) {
      var item = new Employee({
        fullName: data[1],
        email: data[2],
        mobile: data[3],
        city: data[4],
        dofbirth: data[5],
        salary: data[6],
      })
      csvData.push(item)
    })
    .on('end', async function () {
      // remove the first line: header
      csvData.shift()
      //console.log(csvData);
      const resCollct = await myDB.collection(clname).insertMany(csvData)
      if (resCollct) {
        console.log(`Inserted: ${resCollct.insertedCount} rows`)
        client.close()
        res.status(200).json({
          success: 'Collection [' + clname + '] RESTORE Succesfully !!',
        })
      } else {
        console.log(clname + ' data exported to <' + ur5 + '> ERROR !!')
        res
          .status(200)
          .json({ success: 'Collection [' + clname + '] ERROR !!' })
      }
    })
  stream.pipe(csvStream)
  //res.json({success : clname+" data exported to <"+ ur5 +"> Successfully.", status : 200});
})

//----------------------------------------
router.get('/importuser', async function (req, res) {
  //---------------------------------
  let clname = 'users'
  const client = await mongoclient.connect(ur5, {})
  const myDB = client.db(dbName)
  deleteCollection(client, clname, res)

  let stream = fs.createReadStream(__dirname + '/../backup/' + clname + '.csv')
  let csvData = []
  let csvStream = fastcsv
    .parse()
    .on('data', function (data) {
      // username_1,role_2,status_3,admin_4,databases_5,socialId_6,image_7,name_8,email_9,password_10,registered11
      // Cần xem lại cấu trúc file users.csv để sửa thứ tự
      var item = new User({
        username: data[1],
        role: data[2],
        status: data[3],
        admin: data[4],
        databases: data[5],
        socialId: data[6],
        image: data[7],
        name: data[8],
        email: data[9],
        password: data[10],
        registered: data[11],
      })
      csvData.push(item)
    })
    .on('end', async function () {
      // remove the first line: header
      csvData.shift()
      //console.log(csvData);
      const resCollct = await myDB.collection(clname).insertMany(csvData)
      if (resCollct) {
        console.log(`Inserted: ${resCollct.insertedCount} rows`)
        client.close()
        res.status(200).json({
          success: 'Collection [' + clname + '] RESTORE Succesfully !!',
        })
      } else {
        console.log(clname + ' data exported to <' + ur5 + '> ERROR !!')
        res
          .status(200)
          .json({ success: 'Collection [' + clname + '] ERROR !!' })
      }
    })
  stream.pipe(csvStream)
  //res.json({success : clname+" data exported to <"+ ur5 +"> Successfully.", status : 200});
})
//---------------------------------
async function deleteCollection(client, clname, res) {
  const myDB = client.db(dbName)
  const collections = await client.db().listCollections().toArray()
  const collectionNames = collections.map((c) => c.name)
  const retname = await collectionNames.filter((name) => {
    return name == clname
  })
  const ret = true
  if (retname.length > 0) {
    const ret = await myDB.collection(clname).drop() // có await AND successfully return true
    if (!ret)
      res.status(200).json({
        success: 'Collection [' + clname + '] DELETE failed !!',
      })
    // Xóa xong collection --> Tiếp tục import
  }
  return ret
}

//---------------------------------
router.get('/drop/:collect', async (req, res) => {
  var collect = req.path.replace('/drop/', '')
  const client = await mongoclient.connect(ur5, {})
  const ret = deleteCollection(client, collect, res)
  if (ret)
    return res.status(200).json({
      success: 'Collection [' + collect + '] DELETE Succesfully !!',
    })

  if (!ret)
    return res.status(200).json({
      success: 'Collection [' + collect + '] DELETE failed !!',
    })
  client.close()

  // const client = await mongoclient.connect(ur5, {})
  // const myDB = client.db(dbName)
  // const listColls = await myDB.listCollections().toArray()
  // let collexist = false
  // // await listColls.forEach( async (item, index) => {
  // for (let index = 0; index < listColls.length; index++) {
  //   if (listColls[index].name == collect) {
  //     collexist = true
  //     myDB.collection(collect).drop(function (err, delOK) {
  //       client.close()
  //       if (!err) {
  //         return res.status(200).json({
  //           success: 'Collection [' + collect + '] DELETE Succesfully !!',
  //         })
  //       } else {
  //         return res
  //           .status(200)
  //           .json({ success: 'Collection [' + collect + '] Delete ERROR !!' })
  //       }
  //     })
  //   }

  //   if (listColls.length == index + 1 && !collexist) {
  //     client.close()
  //     return res.status(200).json({
  //       success: 'Collection [' + collect + '] Not exist. Please RESTORE... ',
  //     })
  //   }
  // }
})

//---------------------------------
router.get('/listcollct', (req, res) => {
  //----------------------------
  var cfile = 'Database [ ' + dbName + ' ] include list collection : '
  mongoclient.connect(ur5, function (err, client) {
    //create client by providing database name
    const db = client.db(dbName)
    db.listCollections().toArray(function (err, collections) {
      if (err) console.log(err)
      //iterate to each collection detail and push just name in array
      collections.forEach((item) => {
        cfile = cfile + ' &#8226 ' + item.name
        // &#187; &#8226;
      })
      //close client
      client.close()
      res.status(200).json({ success: cfile })
    })
  })
})
//-----------------------------
router.get('/test', (req, res) => {
  //----------------------------
  var data = new Array({ 0: 10, 1: 11, 2: 12 })
  res.send(data)

  new Promise((resolve) => {
    console.log('Init')
    resolve()
  })
    .then(() => {
      console.log('Do this')
    })
    .catch(() => {
      console.log('Do that')
    })
    .then(() => {
      console.log('Do this, no matter when happened')
    })
})

module.exports = router
