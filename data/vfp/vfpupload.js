const dotenv = require('dotenv')
dotenv.config()
const fs = require('fs')
const moment = require('moment')
const iconv = require('iconv-lite')
const _ = require('lodash')
const { readFile, connection, query, dbConfig } = require('../connect/expAsync')
dbConfig.database = process.env.DB_DATABASE_
const { DBFFile } = require('./dbffile/dbf-file')
if (!String.prototype.hasOwnProperty('addSlashes')) {
  String.prototype.addSlashes = function () {
    return this.replace(/'/g, '').replace(/"/g, '').replace(/\\/g, '')
  }
}

function ErrNum(num) {
  return num || 0
}
function iconv1252(str) {
  str = str.addSlashes()
  var buf = iconv.encode(str, 'cp1252')
  return iconv.decode(Buffer.from(buf), 'cp1258')
}

exports.vfpUpload = async function (req, res) {
  var dir = req.body.path
  var firstYear = req.body.firstYear
  var instline = 500
  // async function uploadVfp(dir, instline = 500){
  var conn = await connection(dbConfig)
  if (!conn) {
    console.log('==== Error Connect Database...')
    return res.status(500).json({ message: '==== Error Connect Database...' })
  }

  if (firstYear)
    var result = await query(
      conn,
      'SET GLOBAL sql_mode = `NO_ENGINE_SUBSTITUTION`;SET FOREIGN_KEY_CHECKS=0; TRUNCATE `chitiet`; TRUNCATE `ctuvattu`; TRUNCATE `hoadon`; TRUNCATE `ctuktoan`; TRUNCATE `dmkhohag`; TRUNCATE `dmsodutk`; TRUNCATE `dmtkhoan`; TRUNCATE `dmtiente`; TRUNCATE `tenhang`; TRUNCATE `dmtenkho`; TRUNCATE `customer`; TRUNCATE `quanlykt`; TRUNCATE `dmsodutk`; TRUNCATE `dmkhohag`; SET FOREIGN_KEY_CHECKS=1; ',
    )
  // firstYear is : Xóa hết danh mục

  var cfileCheck = `${dir}/ctuktoan.dbf`
  if (!fs.existsSync(cfileCheck) || (firstYear && result.length !== 17)) {
    conn.destroy()
    var mess =
      firstYear && result.length !== 16
        ? 'Chuẩn bị danh mục kế toán (del-ins) để upload không thành công. '
        : 'Chuẩn bị Danh mục thành công (del), nhưng file dữ liệu không tồn tại : ' +
          cfileCheck
    console.log(0, mess, 1, 'Database được Xóa rỗng.')
    return res.status(218).json({ message: mess })
  }
  var command = '',
    command_ = ''
  try {
    console.log('<=== Begin Upload ===>')
    console.log('Upload First: ==> ' + (firstYear ? 'Yes' : 'No'))
    // firstYear == Yes ? Add số dư ( dmsodutk & dmkhohag) : Không Add

    var dbf = await DBFFile.open(`${dir}/ctuktoan.dbf`)
    var records = await dbf.readRecords(1)
    var namnay =
      records.length > 0 ? moment(records[0].NGAY).format('YYYY-MM-DD') : ''
    namnay = namnay.substring(0, 4)
    //===========================
    dbf = await DBFFile.open(`${dir}/quanlykt.dbf`)
    records = await dbf.readRecords()
    command = firstYear
      ? ''
      : 'SET FOREIGN_KEY_CHECKS=0; TRUNCATE `quanlykt`;SET FOREIGN_KEY_CHECKS=1;'
    await records.forEach((record, index) => {
      command +=
        "INSERT INTO quanlykt (`numid`,`tentaptin`) VALUES ('" +
        iconv1252(record.NUMID) +
        "','" +
        iconv1252(record.TENTAPTIN) +
        "'); "
    })
    if (command) await query(conn, command)
    console.log('quanlykt:', records.length)
    //===========================
    dbf = await DBFFile.open(`${dir}/dmtenkho.dbf`)
    records = await dbf.readRecords()
    command = ''
    await records.forEach((record, index) => {
      command +=
        "INSERT INTO `dmtenkho` (makho, tengoi, diachi) SELECT * FROM (SELECT '" +
        iconv1252(record.MAKHO) +
        "' as makho,'" +
        iconv1252(record.TENGOI) +
        "' as tengoi,'" +
        iconv1252(record.DIACHI) +
        "' as diachi) AS tmp WHERE NOT EXISTS ( SELECT makho FROM `dmtenkho` WHERE makho = '" +
        iconv1252(record.MAKHO) +
        "') LIMIT 1;"
    })
    if (command) await query(conn, command)
    console.log('dmtenkho:', records.length)
    //===========================
    dbf = await DBFFile.open(`${dir}/dmtiente.dbf`)
    records = await dbf.readRecords()
    command = ''
    await records.forEach((record, index) => {
      command +=
        "INSERT INTO dmtiente (`loaitien`,`tengoi`,`viettat`,`tygia`) SELECT * FROM (SELECT '" +
        iconv1252(record.LOAITIEN) +
        "' as loaitien,'" +
        iconv1252(record.TENGOI) +
        "' as tengoi,'" +
        iconv1252(record.VIETTAT) +
        "' as viettat," +
        ErrNum(record.TYGIA) +
        " as tygia) AS tmp WHERE NOT EXISTS ( SELECT loaitien FROM `dmtiente` WHERE loaitien = '" +
        iconv1252(record.LOAITIEN) +
        "') LIMIT 1;"
    })
    if (command) await query(conn, command)
    console.log('dmttiente:', records.length)
    //===========================
    dbf = await DBFFile.open(`${dir}/dmtkhoan.dbf`)
    records = await dbf.readRecords()
    ;(command = ''), (command_ = '')
    await records.forEach((record, index) => {
      command +=
        "INSERT INTO dmtkhoan (`sotk`,`tentk`) SELECT * FROM (SELECT '" +
        iconv1252(record.SOTK) +
        "' as sotk,'" +
        iconv1252(record.TENTK) +
        "' as tentk) AS tmp WHERE NOT EXISTS ( SELECT sotk FROM `dmtkhoan` WHERE sotk = '" +
        iconv1252(record.SOTK) +
        "') LIMIT 1;"
      if (record.NODN + record.CODN !== 0)
        command_ +=
          "INSERT INTO dmsodutk (`nam`,`sotk`,`tentk`,`nodn`,`codn`) SELECT * FROM (SELECT '" +
          namnay +
          "' as nam,'" +
          iconv1252(record.SOTK) +
          "' as sotk,'" +
          iconv1252(record.TENTK) +
          "' as tentk," +
          ErrNum(record.NODN) +
          ' as nodn,' +
          ErrNum(record.CODN) +
          " as codn) AS tmp WHERE NOT EXISTS ( SELECT '" +
          namnay +
          "'+sotk FROM `dmsodutk` WHERE '" +
          namnay +
          "'+sotk = '" +
          iconv1252(namnay + record.SOTK) +
          "') LIMIT 1;"
      if ((index + 1) % instline == 0) {
        query(conn, command)
        command = ''
      }
    })
    if (command) await query(conn, command)
    console.log('dmtkhoan:', records.length)
    //=========================== dmsodutk
    if (namnay && command_) {
      await query(conn, command_)
      console.log('dmsodutk:', records.length)
    } // sau dmtkhoan
    //===========================
    dbf = await DBFFile.open(`${dir}/tenhang.dbf`)
    records = await dbf.readRecords()
    command = ''
    await records.forEach((record, index) => {
      command +=
        "INSERT INTO tenhang (`mahang`,`tenhang`,`donvi`) SELECT * FROM (SELECT '" +
        iconv1252(record.MAHANG) +
        "' as mahang,'" +
        iconv1252(record.TENHANG) +
        "' as tenhang,'" +
        iconv1252(record.DONVI) +
        "' as donvi) AS tmp WHERE NOT EXISTS ( SELECT mahang FROM `tenhang` WHERE mahang = '" +
        iconv1252(record.MAHANG) +
        "') LIMIT 1;"
      if ((index + 1) % instline == 0) {
        query(conn, command)
        command = ''
      }
    })
    if (command) await query(conn, command)
    console.log('tenhang:', records.length)
    //===========================
    dbf = await DBFFile.open(`${dir}/dmkhohag.dbf`)
    records = await dbf.readRecords()
    command = ''
    await records.forEach((record, index) => {
      if (record.LUONGDN + record.TIENDN !== 0)
        command +=
          "INSERT INTO dmkhohag (`nam`,`mahang`,`makho`,`luongdn`,`tiendn`) SELECT * FROM (SELECT '" +
          namnay +
          "','" +
          iconv1252(record.MAHANG) +
          "' as mahang,'" +
          iconv1252(record.MAKHO) +
          "' as makho," +
          ErrNum(record.LUONGDN) +
          ' as luongdn,' +
          ErrNum(record.TIENDN) +
          " as tiendn) AS tmp WHERE NOT EXISTS ( SELECT '" +
          namnay +
          "'+mahang FROM `dmkhohag` WHERE '" +
          namnay +
          "'+mahang = '" +
          iconv1252(namnay + record.MAHANG) +
          "') LIMIT 1;"
    })
    if (namnay && command) {
      await query(conn, command)
      console.log('dmkhohag:', records.length)
    }
    //===========================
    dbf = await DBFFile.open(`${dir}/ctuktoan.dbf`)
    records = await dbf.readRecords()
    command = ''
    await records.forEach((record, index) => {
      command +=
        "INSERT INTO ctuktoan (`ctid`,`soct`,`ngay`,`diengiai`,`tkno`,`tkco`,`loaitien`,`sotien`) VALUES ('" +
        namnay.substr(-1) +
        record.CTID +
        "','" +
        iconv1252(record.SOCT) +
        "','" +
        moment(record.NGAY).format('YYYY-MM-DD') +
        "','" +
        iconv1252(record.DIENGIAI) +
        "','" +
        iconv1252(record.TKNO) +
        "','" +
        iconv1252(record.TKCO) +
        "','" +
        iconv1252(record.LOAITIEN) +
        "'," +
        ErrNum(record.SOTIEN) +
        '); '
      if ((index + 1) % instline == 0) {
        query(conn, command)
        command = ''
      }
    })
    if (command) await query(conn, command)
    console.log('ctuktoan:', records.length)
    //===========================
    dbf = await DBFFile.open(`${dir}/chitiet.dbf`)
    records = await dbf.readRecords()
    command = ''
    await records.forEach((record, index) => {
      command +=
        "INSERT INTO chitiet (`ctid`,`diengiai`,`tkno`,`tkco`,`sotien`) VALUES ('" +
        namnay.substr(-1) +
        record.CTID +
        "','" +
        iconv1252(record.DIENGIAI) +
        "','" +
        iconv1252(record.TKNO) +
        "','" +
        iconv1252(record.TKCO) +
        "'," +
        ErrNum(record.SOTIEN) +
        '); '
      if ((index + 1) % instline == 0) {
        query(conn, command)
        command = ''
      }
    })
    if (command) await query(conn, command)
    console.log('chitiet:', records.length)
    //===========================
    dbf = await DBFFile.open(`${dir}/ctuvattu.dbf`)
    records = await dbf.readRecords()
    command = ''
    await records.forEach((record, index) => {
      command +=
        "INSERT INTO ctuvattu (`ctid`, `mahang`, `makho`, `soluong`, `sotien`) VALUES ('" +
        namnay.substr(-1) +
        record.CTID +
        "','" +
        iconv1252(record.MAHANG) +
        "','" +
        iconv1252(record.MAKHO) +
        "'," +
        ErrNum(record.SOLUONG) +
        ',' +
        ErrNum(record.SOTIEN) +
        '); '
      if ((index + 1) % instline == 0) {
        query(conn, command)
        command = ''
      }
    })
    if (command) await query(conn, command)
    console.log('ctuvattu:', records.length)
    //===========================
    var custList = [] // Dành riêng gán cho hoadon.masothue
    if (fs.existsSync(`${dir}/customer.dbf`)) {
      dbf = await DBFFile.open(`${dir}/customer.dbf`)
      records = await dbf.readRecords()
      custList = records
      command = ''
      await records.forEach((record, index) => {
        command +=
          "INSERT INTO customer (`company`, `address`,`ghichu`,`maso`) SELECT * FROM (SELECT '" +
          iconv1252(record.COMPANY) +
          "' as company,'" +
          iconv1252(record.ADDRESS) +
          "' as address,'" +
          iconv1252(record.GHICHU) +
          "' as ghichu,'" +
          iconv1252(record.MASO) +
          "' as maso) AS tmp WHERE NOT EXISTS ( SELECT maso FROM `customer` WHERE maso = '" +
          iconv1252(record.MASO) +
          "') LIMIT 1;"
        if ((index + 1) % instline == 0) {
          query(conn, command)
          command = ''
        }
      })
      if (command) await query(conn, command)
      console.log('customer:', records.length)
    } else console.log('customer:', 0, 'Không tồn tại trong thư mục.')
    //===========================
    dbf = await DBFFile.open(`${dir}/hoadon.dbf`)
    records = await dbf.readRecords()
    command = ''
    try {
      await records.forEach((record, index) => {
        var masothue = ''
        if (custList.length > 0) {
          var indexof = _.findIndex(custList, function (o) {
            return o.COMPANY == record.DIENGIAI
          })
          masothue = indexof >= 0 ? custList[indexof].MASO : ''
        }
        command +=
          "INSERT INTO hoadon (`ctid`,`sohd`,`ngay`,`diengiai`,`masothue`,`thuesuat`,`giaban`,`thuegtgt`) VALUES ('" +
          namnay.substr(-1) +
          record.CTID +
          "','" +
          iconv1252(record.SOHD) +
          "','" +
          moment(record.NGAY).format('YYYY-MM-DD') +
          "','" +
          iconv1252(record.DIENGIAI) +
          "','" +
          iconv1252(masothue) +
          "','" +
          iconv1252(record.THUESUAT) +
          "'," +
          ErrNum(record.GIABAN) +
          ',' +
          ErrNum(record.THUEGTGT) +
          '); '
        if ((index + 1) % instline == 0) {
          query(conn, command)
          command = ''
        }
      })
      if (command) await query(conn, command)
      console.log('hoadon:', records.length)
    } catch (error) {
      console.log('hoadon:', records.length, '===> Not 100%')
    }
    //===========================
    command =
      "UPDATE quanlykt SET numid = (select MAX(ctid) from ctuktoan) WHERE tentaptin ='CTUKTOAN' "
    await query(conn, command)
    conn.destroy()
    console.log('Vfp upload thành công...')
    return res
      .status(200)
      .json({ success: true, message: 'Vfp upload thành công...' })
  } catch (error) {
    conn.destroy()
    console.log(error)
    return res.status(500).json({ error: error, command: command })
  }
}

//==== run: node data/vfp/vfpupload
// uploadVfp("./data/vfp/dataxx");

// INSERT INTO `dmtenkho` (makho,tengoi,diachi)
// SELECT * FROM (SELECT '002','Kho công ty','118/63') AS tmp
// WHERE NOT EXISTS ( SELECT makho FROM `dmtenkho` WHERE makho = '002') LIMIT 1;
