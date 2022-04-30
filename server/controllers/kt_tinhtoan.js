const mysql = require('mysql')
//const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const fs = require('fs')
var request = require('request')
const path = require('path')
const xml2js = require('xml2js')
const moment = require('moment')
const axios = require('axios')
const Excel = require('exceljs')
const JSZip = require('jszip')
//const os = require('os') //console.log("Platform: " + os.platform(), "Architecture: " + os.arch());
const tmp = require('tmp')
//const iconv = require('iconv-lite')

global.cookie = { kytruoc: 0, kynay: 0 }
const waitFor = (ms) => new Promise((r) => setTimeout(r, ms))
if (!String.prototype.hasOwnProperty('addSlashes')) {
  String.prototype.addSlashes = function () {
    return this.replace(/'/g, '').replace(/"/g, '').replace(/\\/g, '')
  }

  // return this.replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
  //      .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
  //      .replace(/"/g, '&quot;')
  //      .replace(/\\/g, '\\\\')
  //      .replace(/</g, '&lt;')
  //      .replace(/>/g, '&gt;').replace(/\u0000/g, '\\0');
  // }
}

//============================  BaocaoBctc
exports.BaocaoBctcXML = async function (req, res) {
  req.query.fromtodate = JSON.parse(req.query.fromtodate)
  req.query.company = JSON.parse(req.query.company)
  req.query.filename = req.query.company.dnlon
    ? 'KK-BCTC-TT200.xml'
    : 'KK-BCTC-TT133.xml'

  req.body = req.query // Tương thích
  fs.readFile('public/download/' + req.query.filename, 'utf-8', (err, data) => {
    if (err) {
      throw err
    }
    // convert XML data to JSON object
    xml2js.parseString(data, async (err, result) => {
      if (err) {
        throw err
      }
      var pd_fromdate = moment(req.query.fromtodate.pd_fromdate).format(
        'DD-MM-YYYY',
      )
      var pd_todate = moment(req.query.fromtodate.pd_todate).format(
        'DD-MM-YYYY',
      )
      if (
        (req.query.company.dnlon == false) &
        (pd_fromdate.substr(6, 4) < '2017')
      ) {
        var pd_fromdate = moment('2017-01-01').format('DD-MM-YYYY')
        var pd_todate = moment('2017-12-31').format('DD-MM-YYYY')
      }
      var TTinChung = result.HSoThueDTu.HSoKhaiThue[0].TTinChung
      TTinChung[0].TTinTKhaiThue[0].NNT[0].mst = req.query.company.masothue
      TTinChung[0].TTinTKhaiThue[0].NNT[0].tenNNT = ''
      TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kyKKhai =
        pd_fromdate.substr(6, 4) > '2016' ? pd_fromdate.substr(6, 4) : '2017'
      TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kyKKhaiTuNgay =
        moment(pd_fromdate, 'DD-MM-YYYY').format('DD/MM/YYYY')
      TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kyKKhaiDenNgay =
        moment(pd_todate, 'DD-MM-YYYY').format('DD/MM/YYYY')
      TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].ngayLapTKhai = moment(
        pd_todate,
        'DD-MM-YYYY',
      )
        .add('days', 2)
        .format('YYYY-MM-DD')
      TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].ngayKy = moment(
        pd_todate,
        'DD-MM-YYYY',
      )
        .add('days', 2)
        .format('YYYY-MM-DD')
      TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].nguoiKy = 'Trần Văn Nghĩa'

      // ===================================
      let retKequakd = await tinh_ketquakd(req, res)
      let retLctiente = await tinh_lctiente(req, res)
      let retCdketoan = await tinh_cdketoan(req, res)
      //=============== TÍNH PL_Ketquakd

      //response.data.ketquakd.forEach((kq ,index) => { console.log(index, kq['maso'],kq['chitieu'],kq['kynay'],kq['kytruoc']) })
      //     result.HSoThueDTu.HSoKhaiThue[0].PLuc[0].PL_KQHDSXKD[0].PhanKy[0].ngayLap = moment(pd_todate,'DD-MM-YYYY').add( 'days',2).format('YYYY-MM-DD');
      var cdtk = result.HSoThueDTu.HSoKhaiThue[0].PLuc[0].PL_KQHDSXKD[0].NamNay //PL_LCTTGT //PL_KQHDSXKD
      var cdtk_ =
        result.HSoThueDTu.HSoKhaiThue[0].PLuc[0].PL_KQHDSXKD[0].NamTruoc //PL_LCTTGT //PL_KQHDSXKD
      Object.keys(cdtk[0]).forEach((ctma, index) => {
        var maso = ctma.substr(2, 2) // Tách ct01 => 01 lấy trị kynay của ketquakd có kyhieu1 = 01
        //response.data.ketquakd.forEach((kq, index) => {
        retKequakd.forEach((kq, index) => {
          if (kq.maso == maso) {
            // console.log(ctma,kq.maso,kq.kynay)
            cdtk[0][ctma] = kq.kynay // Năm Nay
            cdtk_[0][ctma] = kq.kytruoc // Năm Trước
          }
        })
      })
      //============= TÍNH PL_LCTTGT
      var cdtk = result.HSoThueDTu.HSoKhaiThue[0].PLuc[0].PL_LCTTGT[0].NamNay //PL_LCTTGT //PL_KQHDSXKD
      var cdtk_ = result.HSoThueDTu.HSoKhaiThue[0].PLuc[0].PL_LCTTGT[0].NamTruoc //PL_LCTTGT //PL_KQHDSXKD
      Object.keys(cdtk[0]).forEach((ctma, index) => {
        var maso = ctma.substr(2, 2) // Tách ct01 => 01 lấy trị kynay của ketquakd có kyhieu1 = 01
        retLctiente.forEach((kq, index) => {
          if (kq.maso == maso) {
            // console.log(ctma,kq.maso,kq.kynay)
            cdtk[0][ctma] = kq.kynay // Năm Nay
            cdtk_[0][ctma] = kq.kytruoc // Năm Trước
          }
        })
      })
      //============= TÍNH PL_LCTTGT
      if (req.query.company.dnlon == false) {
        var m_xml = result.HSoThueDTu.HSoKhaiThue[0].CTieuTKhaiChinh
      } else {
        var m_xml =
          result.HSoThueDTu.HSoKhaiThue[0].CTieuTKhaiChinh[0]
            .CDKT_HoatDongLienTuc
      }
      m_xml[0].ngayLap = moment(pd_todate, 'DD-MM-YYYY')
        .add('days', 2)
        .format('YYYY-MM-DD')
      var cdtk = m_xml[0].SoCuoiNam
      var cdtk_ = m_xml[0].SoDauNam
      //console.log(m_xml[0]);

      Object.keys(cdtk[0]).forEach((ctma, index) => {
        var maso = ctma.substr(2) // Tách ct01 => 01 lấy trị kynay của ketquakd có kyhieu1 = 01
        retCdketoan.forEach((kq, index) => {
          if (kq.masc.includes(maso)) {
            //console.log(maso,ctma,kq.masc,kq.tscc)
            cdtk[0][ctma] = kq.tscc
            cdtk_[0][ctma] = kq.tscd
            maso = '1oncly' // Chỉ 1 lần bên Nợ hoặc Có
          }
          if (kq.masn.includes(maso)) {
            //console.log(maso,ctma,kq.masc,kq.tscc)
            cdtk[0][ctma] = kq.tsnc
            cdtk_[0][ctma] = kq.tsnd
            maso = '1oncly' // Chỉ 1 lần bên Nợ hoặc Có
          }
        })
      })
      //console.log(cdtk[0] , cdtk_[0])
      //========= TÍNH PL_CDTK__ Thông tư 200 không có
      const cdps = await runQuerySync(
        `CALL TinhCanDoiTaiKhoan2(?,?,?)`,
        [req.query.fromtodate.pd_fromdate, req.query.fromtodate.pd_todate, ''],
        req,
        res,
      )

      //console.log(result.HSoThueDTu.HSoKhaiThue[0].PLuc[0].PL_CDTK[0].SoDuDauKy[0].No );
      var xml_cdkt = result.HSoThueDTu.HSoKhaiThue[0].PLuc[0].PL_CDTK
      if (req.query.company.dnlon == false) {
        var cdtk =
          result.HSoThueDTu.HSoKhaiThue[0].PLuc[0].PL_CDTK[0].SoDuDauKy[0].No
        var znodk = 0,
          zcodk = 0,
          zpsno = 0,
          zpsco = 0,
          znock = 0,
          zcock = 0
        Object.keys(cdtk[0]).forEach((ctma, index) => {
          if (ctma.substr(0, 2) == 'ct') {
            var sotk = ctma.substr(2)
            var lensotk = sotk.length
            // Theo TT133 tk 641-> 6421 == 642-> 6422
            if (sotk == '6421') {
              sotk = '641'
              lensotk = 3
            }
            if (sotk == '6422') {
              sotk = '642'
              lensotk = 3
            }
            //echo sotk. ' - '. lensotk .'<br>';
            var nodk = 0,
              codk = 0,
              psno = 0,
              psco = 0,
              nock = 0,
              cock = 0
            cdps[0].forEach((kq, index) => {
              if (kq.sotk.substr(0, lensotk) == sotk) {
                nodk = nodk + kq.nodk
                codk = codk + kq.codk
                psno = psno + kq.psno
                psco = psco + kq.psco
                nock = nock + kq.nock
                cock = cock + kq.cock
                if (lensotk == 3) {
                  // Tính tổng cộng
                  znodk = znodk + kq.nodk
                  zcodk = zcodk + kq.codk
                  zpsno = zpsno + kq.psno
                  zpsco = zpsco + kq.psco
                  znock = znock + kq.nock
                  zcock = zcock + kq.cock
                }
              }
            }) //cdps[0].forEach((kq ,index)
            xml_cdkt[0].SoDuDauKy[0].No[0][ctma] = nodk
            xml_cdkt[0].SoDuDauKy[0].Co[0][ctma] = codk
            xml_cdkt[0].SoPhatSinhTrongKy[0].No[0][ctma] = psno
            xml_cdkt[0].SoPhatSinhTrongKy[0].Co[0][ctma] = psco
            xml_cdkt[0].SoDuCuoiKy[0].No[0][ctma] = nock
            xml_cdkt[0].SoDuCuoiKy[0].Co[0][ctma] = cock
          } else {
            if (ctma == 'tongCong') {
              xml_cdkt[0].SoDuDauKy[0].No[0][ctma] = znodk
              xml_cdkt[0].SoDuDauKy[0].Co[0][ctma] = zcodk
              xml_cdkt[0].SoPhatSinhTrongKy[0].No[0][ctma] = zpsno
              xml_cdkt[0].SoPhatSinhTrongKy[0].Co[0][ctma] = zpsco
              xml_cdkt[0].SoDuCuoiKy[0].No[0][ctma] = znock
              xml_cdkt[0].SoDuCuoiKy[0].Co[0][ctma] = zcock
            }
          }
        }) // Object.keys(cdtk[0]).forEach
      }
      //cdps[0].forEach((kq ,index) => { console.log(index, kq['sotk'],kq['nodk'],kq['codk'],kq['psno'],kq['psco'],kq['nock'],kq['cock']) })
      // convert SJON objec to XML
      const builder = new xml2js.Builder()
      const xml = builder.buildObject(result)
      res.set(
        'Content-Disposition',
        'attachment; filename=' + req.query.filename,
      )
      res.set('Content-Type', 'text/xml')
      res.send(xml)
      res.status(200).end()
    }) //xml2js.parseString
  }) // fs.readFile
}
//============================  BaocaoBctc
exports.BaocaoBctcXLSX = async function (req, res) {
  req.query.fromtodate = JSON.parse(req.query.fromtodate)
  req.query.company = JSON.parse(req.query.company)
  req.query.filename = req.query.company.dnlon
    ? 'TM-BCTC-TT200.xlsx'
    : 'TM-BCTC-TT133.xlsx'

  req.body = req.query // Tương thích
  var file1 = 'public/download/' + req.query.filename
  //var file2 = 'public/download/down-temp/'+req.query.filename;
  const cdps = await runQuerySync(
    `CALL TinhCanDoiTaiKhoan2(?,?,?)`,
    [req.query.fromtodate.pd_fromdate, req.query.fromtodate.pd_todate, ''],
    req,
    res,
  )

  const wb = new Excel.Workbook()
  wb.xlsx.readFile(file1).then(async function () {
    var ws = wb.getWorksheet('Thuyết Minh')
    ws.getCell('A2').value = req.query.company.company
    ws.getCell('A3').value = req.query.company.address
    ws.getCell('A9').value = getfromtodate(
      req.query.fromtodate.pd_fromdate,
      req.query.fromtodate.pd_todate,
    )

    ws = wb.getWorksheet('Cân đối Tài khoản')
    var sott = 7 // Dòng dữ liệu đầu tiên
    ws.getCell('A3').value = getfromtodate(
      req.query.fromtodate.pd_fromdate,
      req.query.fromtodate.pd_todate,
    )
    cdps[0].forEach((kq, index) => {
      if (kq.nodk + kq.codk + kq.psno + kq.psco + kq.nock + kq.cock != 0) {
        ws.duplicateRow(sott, 1, true)
        ws.getCell('A' + sott).value = kq.sotk
        ws.getCell('B' + sott).value = kq.tentk
        ws.getCell('C' + sott).value = kq.nodk
        ws.getCell('D' + sott).value = kq.codk
        ws.getCell('E' + sott).value = kq.psno
        ws.getCell('F' + sott).value = kq.psco
        ws.getCell('G' + sott).value = kq.nock
        ws.getCell('H' + sott).value = kq.cock
        ;[
          'A' + sott,
          'B' + sott,
          'C' + sott,
          'D' + sott,
          'E' + sott,
          'F' + sott,
          'G' + sott,
          'H' + sott,
        ].map((key) => {
          // ws.getCell(key ).fill = {
          //     type: 'pattern',
          //     pattern:'solid',
          //     fgColor:{argb:'ebedef'}
          // };
          ws.getCell(key).border = {
            top: { style: 'hair' },
            left: { style: 'thin' },
            bottom: { style: 'hair' },
            right: { style: 'thin' },
          }
        })
        sott++
      }
    }) // cdps[0].forEach
    const lastR = ws.rowCount - 1
    ws.getCell('C' + lastR).value = {
      formula: 'SUM(C7:C' + (lastR - 1) + ')',
    }
    ws.getCell('D' + lastR).value = {
      formula: 'SUM(D7:D' + (lastR - 1) + ')',
    }
    ws.getCell('E' + lastR).value = {
      formula: 'SUM(E7:E' + (lastR - 1) + ')',
    }
    ws.getCell('F' + lastR).value = {
      formula: 'SUM(F7:F' + (lastR - 1) + ')',
    }
    ws.getCell('G' + lastR).value = {
      formula: 'SUM(G7:G' + (lastR - 1) + ')',
    }
    ws.getCell('H' + lastR).value = {
      formula: 'SUM(H7:H' + (lastR - 1) + ')',
    }
    // ===================================
    let retKequakd = await tinh_ketquakd(req, res)
    let retLctiente = await tinh_lctiente(req, res)
    let retCdketoan = await tinh_cdketoan(req, res)
    // ==========================ketquakd

    var ws = wb.getWorksheet('Kết quả Kinh doanh')
    var sott = 7 // Dòng dữ liệu đầu tiên
    ws.getCell('A3').value = getfromtodate(
      req.query.fromtodate.pd_fromdate,
      req.query.fromtodate.pd_todate,
    )
    retKequakd.forEach((kq, index) => {
      ws.duplicateRow(sott, 1, true)
      ws.getCell('A' + sott).value = kq.chitieu
      ws.getCell('B' + sott).value = kq.maso
      ws.getCell('C' + sott).value = kq.tminh
      ws.getCell('D' + sott).value = kq.kynay
      ws.getCell('E' + sott).value = kq.kytruoc
      sott++
    })
    // ===================lctiente============
    var ws = wb.getWorksheet('Lưu chuyển Tiền tệ')
    var sott = 7 // Dòng dữ liệu đầu tiên
    ws.getCell('A3').value = getfromtodate(
      req.query.fromtodate.pd_fromdate,
      req.query.fromtodate.pd_todate,
    )
    retLctiente.forEach((kq, index) => {
      ws.duplicateRow(sott, 1, true)
      ws.getCell('A' + sott).value = kq.chitieu
      ws.getCell('B' + sott).value = kq.maso
      ws.getCell('C' + sott).value = kq.tminh
      ws.getCell('D' + sott).value = kq.kynay
      ws.getCell('E' + sott).value = kq.kytruoc
      sott++
    })

    // =================cdketoan===============
    var ws = wb.getWorksheet('Cân đối Kế toán')
    var sott = 8 // Dòng dữ liệu đầu tiên
    ws.getCell('A3').value = getfromtodate(
      req.query.fromtodate.pd_fromdate,
      req.query.fromtodate.pd_todate,
    )
    retCdketoan.forEach((kq, index) => {
      ws.duplicateRow(sott, 1, true)
      ws.getCell('A' + sott).value = kq.tentsc
      ws.getCell('B' + sott).value = kq.masc
      ws.getCell('C' + sott).value = kq.tmtsc
      ws.getCell('D' + sott).value = kq.tscc
      ws.getCell('E' + sott).value = kq.tscd
      ws.getCell('F' + sott).value = kq.tentsn
      ws.getCell('G' + sott).value = kq.masn
      ws.getCell('H' + sott).value = kq.tmtsn
      ws.getCell('I' + sott).value = kq.tsnc
      ws.getCell('J' + sott).value = kq.tsnd
      if (kq.masc.includes('200')) {
        // ['A'+sott, 'B'+sott, 'C'+sott, 'D'+sott, 'E'+sott].map(key => {
        //   console.log(key);
        //   ws.getCell(key).font = { bold: true };
        // });
        //ws.getCell('A35').font = { bold: true };
      }
      // if(kq.masn.includes('500')){
      //   ['F'+sott, 'G'+sott, 'H'+sott, 'I'+sott, 'J'+sott].map(key => {
      //     ws.getCell(key).font = { bold: true };
      //   });
      // }

      sott++
    })
    // ==========================
    // ws = wb.addWorksheet('New Nghia');
    // addTable(ws);
    // ========================== Tính Thuyết Minh
    var ws_cdkt = wb.getWorksheet('Cân đối Kế toán')
    var ws_kqkd = wb.getWorksheet('Kết quả Kinh doanh')
    var ws_lctt = wb.getWorksheet('Lưu chuyển Tiền tệ')
    var ws_cdtk = wb.getWorksheet('Cân đối Tài khoản')
    var ws_tminh = wb.getWorksheet('Thuyết Minh')
    var colTM = req.query.company.dnlon ? ['BF', 'BG', 'BH'] : ['L', 'M', 'N']
    var colKQ = req.query.company.dnlon ? ['AG', 'AV'] : ['H', 'J']
    ws_tminh.eachRow(function (row, rowNumber) {
      if (
        row.getCell(colTM[0]).value != null &&
        row.getCell(colTM[1]).value != null &&
        row.getCell(colTM[2]).value != null
      ) {
        if (row.getCell(colTM[0]).value == 'kqkd') {
          ws_kqkd.eachRow(function (rowkq, rowNumberkq) {
            if (row.getCell(colTM[1]).value === rowkq.getCell('B').value) {
              if (rowkq.getCell('D').value != 0)
                row.getCell(colKQ[0]).value = rowkq.getCell('D').value
              if (rowkq.getCell('E').value != 0)
                row.getCell(colKQ[1]).value = rowkq.getCell('E').value
            }
          })
        } else {
          var colL = row.getCell(colTM[0]).value.replace(/"/g, '').split(';')
          var colM = row.getCell(colTM[1]).value.replace(/"/g, '').split(';')
          var colN = row.getCell(colTM[2]).value.replace(/"/g, '').split(';')
          for (var k = 0; k < colL.length - 1; k++) {
            //console.log(colL[k],colM[k], colN[k])
            var strfor = colM[k]
            var nlen = strfor.length
            if (strfor.indexOf(',') > -1) {
              nlen = strfor.split(',')[0].length
            }
            var sotien = 0
            cdps[0].forEach((kq, index) => {
              if (strfor.includes(kq.sotk.substr(0, nlen)))
                sotien += kq[colL[k]]
            })
            //console.log(colL[k],nlen,strfor, colN[k],0,sotien)
            if (sotien != 0) row.getCell(colN[k]).value = sotien
          }
          //console.log(rowNumber, row.getCell('L').value, row.getCell('M').value, row.getCell('N').value);
        }
      }
    }) // ws_tminh.eachRow
    // wb.xlsx.writeFile(file2)
    // .then(()=> {
    //   console.log(1,'File is written cdTaikhoan có :',lastR,' dòng');
    //   res.status(200).json({
    //     success: true,
    //     message: 'Báo cáo Tài chính xlsx THÀNH CÔNG !!',
    //     filename: req.query.filename
    //   });
    // });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + req.query.filename,
    )

    return wb.xlsx.write(res).then(function () {
      console.log('successFully !!')
      res.status(200).end()
    })
  }) // wb.xlsx.readFile
  //},
  //) // CALL TinhCanDoiTaiKhoan2 =======================
}
//============================  BaocaoTndn
exports.BaocaoTndn = async function (req, res) {
  req.query.fromtodate = JSON.parse(req.query.fromtodate)
  req.query.company = JSON.parse(req.query.company)
  req.body = req.query // Tương thích

  fs.readFile('public/download/' + req.query.filename, 'utf-8', (err, data) => {
    if (err) {
      throw err
    }
    // convert XML data to JSON object
    xml2js.parseString(data, async (err, result) => {
      if (err) {
        throw err
      }

      var pd_fromdate = moment(req.query.fromtodate.pd_fromdate).format(
        'DD-MM-YYYY',
      )
      var pd_todate = moment(req.query.fromtodate.pd_todate).format(
        'DD-MM-YYYY',
      )

      var TTinChung = result.HSoThueDTu.HSoKhaiThue[0].TTinChung
      TTinChung[0].TTinTKhaiThue[0].NNT[0].mst = req.query.company.masothue
      TTinChung[0].TTinTKhaiThue[0].NNT[0].tenNNT = ''
      TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kieuKy =
        getkykekhai('1', pd_fromdate, pd_todate)
      TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kyKKhai =
        getkykekhai('', pd_fromdate, pd_todate)
      TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kyKKhaiTuNgay =
        moment(pd_fromdate, 'DD-MM-YYYY').format('DD/MM/YYYY')
      TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kyKKhaiDenNgay =
        moment(pd_todate, 'DD-MM-YYYY').format('DD/MM/YYYY')
      TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].ngayLapTKhai = moment(
        pd_todate,
        'DD-MM-YYYY',
      )
        .add('days', 2)
        .format('YYYY-MM-DD')
      TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].ngayKy = moment(
        pd_todate,
        'DD-MM-YYYY',
      )
        .add('days', 2)
        .format('YYYY-MM-DD')
      TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].nguoiKy = 'Trần Văn Nghĩa'

      //var cdtk = result.HSoThueDTu.HSoKhaiThue[0].PLuc[0].PL03_1A_TNDN
      // Thay PL03_1A_TNDN => PLuc_03_1A_TNDN
      var cdtk = result.HSoThueDTu.HSoKhaiThue[0].PLuc[0].PLuc_03_1A_TNDN

      let retKequakd = await tinh_ketquakd(req, res)

      //console.log(req.query);
      //retKequakd.forEach((kq ,index) => { console.log(index, kq['kyhieu1'],kq['chitieu'],kq['kynay'],kq['kytruoc']) })
      Object.keys(cdtk[0]).forEach((ctma, index) => {
        var maso = ctma.substr(2, 2) // Tách ct01 => 01 lấy trị kynay của ketquakd có kyhieu1 = 01
        retKequakd.forEach((kq, index) => {
          let masokq = kq.kyhieu1,
            masolai = '19'

          // Xử lý mã số chênh lệch 3 số
          masolai = '22'
          masokq = '0' + (parseInt(masokq) + 3).toString()
          masokq = masokq.substring(masokq.length - 2)
          //=============================

          if (masokq == maso) {
            //console.log(kq.kyhieu1,kq.kynay)
            cdtk[0][ctma] = kq.kynay
            if (maso == masolai) {
              // Tổng lãi mã 19 hoặc 22
              result.HSoThueDTu.HSoKhaiThue[0].CTieuTKhaiChinh[0].ctA1 =
                kq.kynay
            }
          }
        })
      })
      //console.log(cdtk[0])

      // convert SJON objec to XML
      const builder = new xml2js.Builder()
      const xml = builder.buildObject(result)
      res.set(
        'Content-Disposition',
        'attachment; filename=' + req.query.filename,
      )
      res.set('Content-Type', 'text/xml')
      res.send(xml)
      res.status(200).end()
    }) //xml2js.parseString
  }) // fs.readFile
}

//============================  BaocaoThuegtgt
exports.BaocaoThuegtgt = async function (req, res) {
  req.query.fromtodate = JSON.parse(req.query.fromtodate)
  req.query.company = JSON.parse(req.query.company)
  //console.log(req.query.filename, req.query.fromtodate)

  var maso = '10',
    order = 'sohd'
  GetThuegtgt(req.query.fromtodate, maso, order, req, res, function (vatzdat) {
    //console.log(vatzdat.length)
    var tienmua = 0,
      thuemua = 0
    if (vatzdat.length > 0) {
      vatzdat[0].forEach((item, index) => {
        tienmua += item.sotien
        thuemua += item.thuegtgt
      })
    }
    maso = '20'
    GetThuegtgt(
      req.query.fromtodate,
      maso,
      order,
      req,
      res,
      function (vatzdat20) {
        //console.log(vatzdat20)
        var tien = 0,
          tien0 = 0,
          tien5 = 0,
          thue5 = 0,
          tien10 = 0,
          thue10 = 0
        if (vatzdat20.length > 0) {
          vatzdat20[0].forEach((item, index) => {
            var thuesuat = item.thuesuat.trim()
            switch (thuesuat) {
              case '10%':
                ;(tien10 += item.sotien), (thue10 += item.thuegtgt)
                break
              case '5%':
                ;(tien5 += item.sotien), (thue5 += item.thuegtgt)
                break
              case '0%':
                tien0 += item.sotien
                break
              default:
                tien += item.sotien
            }
          })
        }
        //console.log(tienmua, thuemua, tien ,tien0 ,tien5 , thue5, tien10, thue10)
        fs.readFile(
          'public/download/' + req.query.filename,
          'utf-8',
          (err, data) => {
            if (err) {
              throw err
            }

            // convert XML data to JSON object
            xml2js.parseString(data, (err, result) => {
              if (err) {
                throw err
              }
              var pd_fromdate = moment(req.query.fromtodate.pd_fromdate).format(
                'DD-MM-YYYY',
              )
              var pd_todate = moment(req.query.fromtodate.pd_todate).format(
                'DD-MM-YYYY',
              )

              var TTinChung = result.HSoThueDTu.HSoKhaiThue[0].TTinChung
              TTinChung[0].TTinTKhaiThue[0].NNT[0].mst =
                req.query.company.masothue
              TTinChung[0].TTinTKhaiThue[0].NNT[0].tenNNT = ''
              TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kieuKy =
                getkykekhai('1', pd_fromdate, pd_todate)
              TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kyKKhai =
                getkykekhai('', pd_fromdate, pd_todate)
              TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kyKKhaiTuNgay =
                moment(pd_fromdate, 'DD-MM-YYYY').format('DD/MM/YYYY')
              TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kyKKhaiDenNgay =
                moment(pd_todate, 'DD-MM-YYYY').format('DD/MM/YYYY')
              TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].ngayLapTKhai = moment(
                pd_todate,
                'DD-MM-YYYY',
              )
                .add('days', 2)
                .format('YYYY-MM-DD')
              TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].ngayKy = moment(
                pd_todate,
                'DD-MM-YYYY',
              )
                .add('days', 2)
                .format('YYYY-MM-DD')
              TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].nguoiKy =
                'Trần Văn Nghĩa'
              //------------------ Phần tính toán
              var m_xml = result.HSoThueDTu.HSoKhaiThue[0].CTieuTKhaiChinh[0]
              var node = m_xml.GiaTriVaThueGTGTHHDVMuaVao[0]
              node.ct23 = tienmua // Giá trị và thuế GTGT của hàng hoá, dịch vụ mua vào
              node.ct24 = thuemua // VAT
              m_xml.ct25 = thuemua
              m_xml.ct26 = tien // Hàng hóa, dịch vụ bán ra không chịu thuế GTGT
              m_xml.ct29 = tien0 // VAT 0%
              node = m_xml.HHDVBRaChiuTSuat5[0]
              node.ct30 = tien5 // VAT 5%
              node.ct31 = thue5
              node = m_xml.HHDVBRaChiuTSuat10[0]
              node.ct32 = tien10 // VAT 10%
              node.ct33 = thue10
              //m_xml.HHDVBRaKhongTinhThue[0].ct32a = 0
              m_xml.ct32a = 0
              m_xml.HHDVBRaChiuThueGTGT[0].ct27 = tien0 + tien5 + tien10 + 0
              m_xml.HHDVBRaChiuThueGTGT[0].ct28 = thue5 + thue10

              // convert SJON objec to XML
              const builder = new xml2js.Builder()
              const xml = builder.buildObject(result)
              res.set(
                'Content-Disposition',
                'attachment; filename=' + req.query.filename,
              )
              res.set('Content-Type', 'text/xml')
              res.send(xml)
              res.status(200).end()
            })
          },
        )
      },
    ) //GetThuegtgt20
  }) //GetThuegtgt10
}

//============================  baocaohoadon
exports.BaocaoHoadon = function (req, res) {
  req.query.fromtodate = JSON.parse(req.query.fromtodate)
  req.query.company = JSON.parse(req.query.company)

  TinhHoadonSudung(req.query.fromtodate, req, res, function (xmlData) {
    fs.readFile(
      'public/download/' + req.query.filename,
      'utf-8',
      (err, data) => {
        if (err) {
          throw err
        }

        // convert XML data to JSON object
        xml2js.parseString(data, (err, result) => {
          if (err) {
            throw err
          }
          var pd_fromdate = moment(req.query.fromtodate.pd_fromdate).format(
            'DD-MM-YYYY',
          )
          var pd_todate = moment(req.query.fromtodate.pd_todate).format(
            'DD-MM-YYYY',
          )

          var TTinChung = result.HSoThueDTu.HSoKhaiThue[0].TTinChung
          TTinChung[0].TTinTKhaiThue[0].NNT[0].mst = req.query.company.masothue
          TTinChung[0].TTinTKhaiThue[0].NNT[0].tenNNT = ''
          TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kieuKy =
            getkykekhai('1', pd_fromdate, pd_todate)
          TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kyKKhai =
            getkykekhai('', pd_fromdate, pd_todate)
          TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kyKKhaiTuNgay =
            moment(pd_fromdate, 'DD-MM-YYYY').format('DD/MM/YYYY')
          TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].KyKKhaiThue[0].kyKKhaiDenNgay =
            moment(pd_todate, 'DD-MM-YYYY').format('DD/MM/YYYY')
          TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].ngayLapTKhai = moment(
            pd_todate,
            'DD-MM-YYYY',
          )
            .add('days', 2)
            .format('YYYY-MM-DD')
          TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].ngayKy = moment(
            pd_todate,
            'DD-MM-YYYY',
          )
            .add('days', 2)
            .format('YYYY-MM-DD')
          TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].nguoiKy = 'Trần Văn Nghĩa'
          TTinChung[0].TTinTKhaiThue[0].TKhaiThue[0].maTKhai =
            getkykekhai('1', pd_fromdate, pd_todate) == 'Q' ? '102' : '131'
          result.HSoThueDTu.HSoKhaiThue[0].CTieuTKhaiChinh[0].ngayBCao = moment(
            pd_todate,
            'DD-MM-YYYY',
          )
            .add('days', 2)
            .format('YYYY-MM-DD')
          result.HSoThueDTu.HSoKhaiThue[0].CTieuTKhaiChinh[0].ngayDauKyBC =
            moment(pd_fromdate, 'DD-MM-YYYY').format('YYYY-MM-DD')
          result.HSoThueDTu.HSoKhaiThue[0].CTieuTKhaiChinh[0].ngayCuoiKyBC =
            moment(pd_todate, 'DD-MM-YYYY').format('YYYY-MM-DD')

          const xmlChitiet = {
            maHoaDon: '01GTKT',
            tenHDon: 'Hóa đơn giá trị gia tăng',
            kHieuMauHDon: '01GTKT3/001',
            kHieuHDon: 'NM/11P',
            soTonMuaTrKy_tongSo: 0,
            soTonDauKy_tuSo: '',
            soTonDauKy_denSo: '',
            muaTrongKy_tuSo: '',
            muaTrongKy_denSo: '',
            tongSoSuDung_tuSo: '',
            tongSoSuDung_denSo: '',
            tongSoSuDung_cong: 0,
            soDaSDung: 0,
            xoaBo_soLuong: 0,
            xoaBo_so: '',
            mat_soLuong: 0,
            mat_so: '',
            huy_soLuong: 0,
            huy_so: '',
            tonCuoiKy_tuSo: '',
            tonCuoiKy_denSo: '',
            tonCuoiKy_soLuong: 0,
          }

          var addChitiet = { ChiTiet: [] }
          var count, DauKy_denSo, toncuoikyso
          for (var key = 0; key < xmlData.length; key++) {
            addChitiet.ChiTiet.push(xmlChitiet)
            count = xmlData[key]['sohd_end']
            while (count % 500 != 0) {
              count++
            }

            DauKy_denSo = ('0000' + count).substr(-7)
            toncuoikyso = xmlData[key]['sohd_end'] + 1

            addChitiet.ChiTiet[key].kHieuHDon = xmlData[key]['mauhd']
            addChitiet.ChiTiet[key].soTonDauKy_tuSo = xmlData[key]['sohd_begin']
            addChitiet.ChiTiet[key].soTonDauKy_denSo = DauKy_denSo
            addChitiet.ChiTiet[key].tongSoSuDung_tuSo =
              xmlData[key]['sohd_begin']
            addChitiet.ChiTiet[key].soTonMuaTrKy_tongSo =
              DauKy_denSo - xmlData[key]['sohd_begin'] + 1
            addChitiet.ChiTiet[key].soDaSDung = xmlData[key]['soluong_sd']
            addChitiet.ChiTiet[key].tongSoSuDung_denSo =
              xmlData[key]['sohd_end']
            addChitiet.ChiTiet[key].tongSoSuDung_cong = xmlData[key]['tongdung']
            addChitiet.ChiTiet[key].huy_soLuong = xmlData[key]['soluong_huy']
            addChitiet.ChiTiet[key].tonCuoiKy_denSo = DauKy_denSo
            addChitiet.ChiTiet[key].tonCuoiKy_tuSo = (
              '0000' + toncuoikyso
            ).substr(-7)
            addChitiet.ChiTiet[key].tonCuoiKy_soLuong =
              DauKy_denSo - xmlData[key]['sohd_end']
            addChitiet.ChiTiet[key] = JSON.stringify(addChitiet.ChiTiet[key])
            addChitiet.ChiTiet[key] = JSON.parse(addChitiet.ChiTiet[key])
            //result.HSoThueDTu.HSoKhaiThue[0].CTieuTKhaiChinh[0].HoaDon.push(addChitiet.ChiTiet[key])
          }
          result.HSoThueDTu.HSoKhaiThue[0].CTieuTKhaiChinh[0].HoaDon.push(
            addChitiet,
          )
          delete result.HSoThueDTu.HSoKhaiThue[0].CTieuTKhaiChinh[0].HoaDon[0]
          // convert SJON objec to XML
          const builder = new xml2js.Builder()
          const xml = builder.buildObject(result)
          res.set(
            'Content-Disposition',
            'attachment; filename=' + req.query.filename,
          )
          res.set('Content-Type', 'text/xml')
          res.send(xml)
          res.status(200).end()
        })
      },
    )
  }) // sudung hoadon
}

//============================  query
exports.query = async function (req, res) {
  var query = req.body.query
  var params = typeof req.body.params != 'undefined' ? req.body.params : ''
  // "query": "CALL DelChungtuNam('2016-01-01')"
  try {
    let retQuery = await runQuerySync(query, params, req, res)
    return res.status(200).json({
      success: true,
      message: 'Run Query thành công !!',
      query: retQuery,
    })
  } catch (error) {
    return res.status(500).json({ error: error })
  }

  // var mysqlConnection = createConnect(req, res)
  // mysqlConnection.connect((err) => {
  //   if (!err) {
  //     // if(query.includes('?')) mysqlConnection.query(query,params ,(err, rows, fields) => {
  //     // else  mysqlConnection.query(query, (err, rows, fields) => {
  //     mysqlConnection.query(query, params, (err, rows, fields) => {
  //       //console.log(query);
  //       mysqlConnection.destroy()
  //       if (!err) {
  //         // res.send(rows);
  //         return res.status(200).json({
  //           success: true,
  //           message: 'Run Query thành công !!',
  //           query: rows,
  //         })
  //       } else {
  //         res.status(500).json({
  //           success: false,
  //           message: 'Server error. Please try again.',
  //           error: err.message,
  //         })
  //       }
  //     })
  //   } else {
  //     console.log(
  //       'DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2),
  //     )
  //   }
  // })
}

//============================  tinhcandoips
exports.tinhcandoips = async function (req, res) {
  var query = `CALL TinhCanDoiTaiKhoan(?,?)`
  var tudengay = [req.body.pd_fromdate, req.body.pd_todate]
  try {
    let retQuery = await runQuerySync(query, tudengay, req, res)
    retQuery['tudengay'] = tudengay
    return res.status(200).json({
      success: true,
      message: 'Tính Cân đối Phát sinh thành công !!',
      tinhcandoips: retQuery,
    })
  } catch (error) {
    return res.status(500).json({ error: error })
  }

  // var mysqlConnection = createConnect(req, res)
  // mysqlConnection.connect((err) => {
  //   if (!err) {
  //     mysqlConnection.query(query, tudengay, (err, rows, fields) => {
  //       mysqlConnection.destroy()
  //       if (!err) {
  //         // res.send(rows);
  //         rows.tudengay = tudengay
  //         return res.status(200).json({
  //           success: true,
  //           message: 'Tính Cân đối Phát sinh thành công !!',
  //           tinhcandoips: rows,
  //         })
  //       } else {
  //         res.status(500).json({
  //           success: false,
  //           message: 'Server error. Please try again.',
  //           error: err.message,
  //         })
  //       }
  //     })
  //   } else {
  //     console.log(
  //       'DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2),
  //     )
  //   }
  // })
}
//============================  tinhcandoihang
exports.tinhcandoihang = async function (req, res) {
  var query = `CALL TinhCanDoiHangHoa(?,?)`
  var tudengay = [req.body.pd_fromdate, req.body.pd_todate]
  try {
    let retQuery = await runQuerySync(query, tudengay, req, res)
    retQuery['tudengay'] = tudengay
    return res.status(200).json({
      success: true,
      message: 'Tính Cân đối Hàng hóa thành công !!',
      tinhcandoihang: retQuery,
    })
  } catch (error) {
    return res.status(500).json({ error: error })
  }

  // var mysqlConnection = createConnect(req, res)
  // mysqlConnection.connect((err) => {
  //   if (!err) {
  //     mysqlConnection.query(query, tudengay, (err, rows, fields) => {
  //       mysqlConnection.destroy()
  //       if (!err) {
  //         // res.send(rows);
  //         rows.tudengay = tudengay
  //         return res.status(200).json({
  //           success: true,
  //           message: 'Tính Cân đối Hàng hóa thành công !!',
  //           tinhcandoihang: rows,
  //         })
  //       } else {
  //         res.status(500).json({
  //           success: false,
  //           message: 'Server error. Please try again.',
  //           error: err.message,
  //         })
  //       }
  //     })
  //   } else {
  //     console.log(
  //       'DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2),
  //     )
  //   }
  // })
}
//============================  chuyensodutk
exports.chuyensodutk = async function (req, res) {
  var tudengay_nn = [req.body.pd_fromdate, req.body.pd_todate]
  var tudengay_nt = [
    req.body.pd_fromdate.substr(0, 4) - 1 + '-01-01',
    req.body.pd_fromdate.substr(0, 4) - 1 + '-12-31',
  ]
  var tudengay_nn1 = [req.body.pd_fromdate, req.body.pd_todate, 1]
  var tudengay_nn2 = [req.body.pd_fromdate, req.body.pd_todate, 2] // 1 lần cho para nlan=0 để test

  if (!__poolmysql) __poolmysql = mysql.createPool(choiceConnect())
  __poolmysql.getConnection(async function (err, mysqlConnection) {
    //var mysqlConnection = createConnect(req, res)
    //mysqlConnection.connect((err) => {
    if (!err) {
      // Tính cho cdps Kỳ trước để lấy số dư cuối kỳ  - query1
      var query1 = `CALL TinhCanDoiTaiKhoan(?,?)`
      mysqlConnection.query(query1, tudengay_nt, (err, rows, fields) => {
        if (!err) {
          // Lần 1: Bổ sung mã có Năm trước nhưng chưa có Năm nay (query2)
          var query2 = 'CALL ChuyenSoDuTaiKhoan(?,?,?)'
          mysqlConnection.query(query2, tudengay_nn1, (err, rows, fields) => {
            if (!err) {
              // Lần 2: Chuyển số dư Cuối kỳ Năm trước sang Đầu Năm Nay (query2)
              mysqlConnection.query(
                query2,
                tudengay_nn2,
                (err, rows, fields) => {
                  if (!err) {
                    // Tính cho Kỳ này ( Phải có ) - query1
                    mysqlConnection.query(
                      query1,
                      tudengay_nn,
                      (err, rows, fields) => {
                        mysqlConnection.destroy()
                        if (!err) {
                          rows.tudengay = tudengay_nn
                          return res.status(200).json({
                            chuyensodutk: {
                              success: true,
                              message: 'Chuyển số dư Tài khoản THÀNH CÔNG !!',
                              data: rows,
                            },
                          })
                        } else {
                          res.status(500).json({
                            success: false,
                            message: 'Server error. Please try again.',
                            error: err.message,
                          })
                        }
                      },
                    )
                  }
                },
              )
            }
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

//============================  chuyensoduhang
exports.chuyensoduhang = async function (req, res) {
  var tudengay_nn = [req.body.pd_fromdate, req.body.pd_todate]
  var tudengay_nt = [
    req.body.pd_fromdate.substr(0, 4) - 1 + '-01-01',
    req.body.pd_fromdate.substr(0, 4) - 1 + '-12-31',
  ]
  var tudengay_nn1 = [req.body.pd_fromdate, req.body.pd_todate, 1]
  var tudengay_nn2 = [req.body.pd_fromdate, req.body.pd_todate, 2] // 1 lần cho para nlan=0 để test

  if (!__poolmysql) __poolmysql = mysql.createPool(choiceConnect())
  __poolmysql.getConnection(async function (err, mysqlConnection) {
    // var mysqlConnection = createConnect(req, res)
    // mysqlConnection.connect((err) => {
    if (!err) {
      // Tính cho cdps Kỳ trước
      var query1 = `CALL TinhCanDoiHangHoa(?,?)`
      mysqlConnection.query(query1, tudengay_nt, (err, rows, fields) => {
        if (!err) {
          // Lần 1: Bổ sung mã có Năm trước nhưng chưa có Năm nay
          var query2 = 'CALL ChuyenSoDuHangHoa(?,?,?)'
          mysqlConnection.query(query2, tudengay_nn1, (err, rows, fields) => {
            if (!err) {
              // Lần 2: Chuyển số dư Cuối kỳ Năm trước sang Đầu Năm Nay
              mysqlConnection.query(
                query2,
                tudengay_nn2,
                (err, rows, fields) => {
                  if (!err) {
                    // Tính cho Kỳ này ( Phải có )
                    mysqlConnection.query(
                      query1,
                      tudengay_nn,
                      (err, rows, fields) => {
                        mysqlConnection.destroy()
                        if (!err) {
                          rows.tudengay = tudengay_nn
                          return res.status(200).json({
                            chuyensoduhang: {
                              success: true,
                              message: 'Chuyển số dư Hàng hóa THÀNH CÔNG !!',
                              data: rows,
                            },
                          })
                        } else {
                          res.status(500).json({
                            success: false,
                            message: 'Server error. Please try again.',
                            error: err.message,
                          })
                        }
                      },
                    )
                  }
                },
              )
            }
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

//============================  dmsodutks
exports.dmsodutks = async function (req, res) {
  try {
    let cdps = await runQuerySync(
      `CALL TinhCanDoiTaiKhoan2(?,?,?)`,
      [req.body.fromtodate.pd_fromdate, req.body.fromtodate.pd_todate, ''],
      req,
      res,
    )
    return res.status(200).json({
      success: true,
      message: 'Cân đối Phát sinh Tài khoản',
      dmsodutks: cdps[0],
    })
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}

exports.dmkhohags = async function (req, res) {
  //req.query = req.body;   // For requests.rest
  // req.query.fromtodate = JSON.parse(req.query.fromtodate);
  // req.query.company = JSON.parse(req.query.company);
  // ================ For App ( Tắt dòng dưới --> Mở 2 dòng trên & Ngược lại)
  //console.log([req.body.fromtodate.pd_fromdate, req.body.fromtodate.pd_todate, ''])

  try {
    let cdps = await runQuerySync(
      `CALL TinhCanDoiHangHoa2(?,?,?)`,
      [req.body.fromtodate.pd_fromdate, req.body.fromtodate.pd_todate, ''],
      req,
      res,
    )
    return res.status(200).json({
      success: true,
      message: 'Cân đối Phát sinh Hàng hóa',
      dmkhohags: cdps[0],
    })
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}

//============================  cdketoan
exports.cdketoan = async function (req, res) {
  let cdketoan = await tinh_cdketoan(req, res)
  return res.status(200).json({
    success: true,
    message: 'A list of all Cân đối Kế toán',
    cdketoan: cdketoan,
  })
}
async function tinh_cdketoan(req, res) {
  var company = req.body.company // [company,masothue,dnlon]
  var dnlon = req.body.company.dnlon
  var chedokt = dnlon ? 'DNL' : 'DNN'
  var pd_fromdate = req.body.fromtodate.pd_fromdate
  var pd_todate = req.body.fromtodate.pd_todate
  var dfromt = pd_todate.substr(5, 2) - pd_fromdate.substr(5, 2) + 1 // Mấy tháng
  dfromt = moment(pd_fromdate).subtract(dfromt, 'M')
  var dtot = moment(pd_fromdate).subtract(1, 'd')
  dfromt = moment(dfromt).format('YYYY-MM-DD')
  dtot = moment(dtot).format('YYYY-MM-DD')
  var namnay = pd_todate.substr(0, 4)
  var locyear = '1988'
  switch (true) {
    case namnay <= '1998':
      locyear = '98'
      break
    case namnay < '2005':
      locyear = '99'
      break
    case namnay <= '2010':
      locyear = '05'
      break
    case namnay <= '2015':
      locyear = '10'
      break
    case namnay > '2015':
      locyear = '15'
  }

  //console.log(pd_fromdate,pd_todate,dfromt,dtot);

  const cdketoan = await runQuerySync(
    `SELECT id,masc,tentsc,tmtsc,tk1,tscc,tscd,masn,tentsn,tmtsn,tk2,tsnc,tsnd FROM cdketoan WHERE chedokt = '` +
      chedokt +
      `' AND kyhieu='` +
      locyear +
      `'  `,
    [pd_fromdate, pd_todate],
    req,
    res,
  )
  //function (cdketoan) {
  let cdps = await runQuerySync(
    `CALL TinhCanDoiTaiKhoan2(?,?,?)`,
    [pd_fromdate, pd_todate, ''],
    req,
    res,
  )
  // function (cdps) {
  if (!cdps)
    return res
      .status(503)
      .json({ success: false, error: '503 Service Unavailable...' })
  //console.log(Tinhcdketoan('1-129-139-159,3-331','nodn'))
  var field = 'nodn'
  for (var k = 0; k < cdketoan.length; k++) {
    if (
      cdketoan[k].tk1.indexOf('*') != -1 ||
      cdketoan[k].tk1.indexOf('+') != -1 ||
      cdketoan[k].tk1 != ''
    ) {
      cdketoan[k].tscd = Tinhcdketoan(cdketoan[k].tk1, field, cdps[0])
    }
  }
  var field = 'nock'
  for (var k = 0; k < cdketoan.length; k++) {
    if (
      cdketoan[k].tk1.indexOf('*') != -1 ||
      cdketoan[k].tk1.indexOf('+') != -1 ||
      cdketoan[k].tk1 != ''
    ) {
      cdketoan[k].tscc = Tinhcdketoan(cdketoan[k].tk1, field, cdps[0])
    }
  }
  var field = 'codn'
  for (var k = 0; k < cdketoan.length; k++) {
    if (
      cdketoan[k].tk2.indexOf('*') != -1 ||
      cdketoan[k].tk2.indexOf('+') != -1 ||
      cdketoan[k].tk2 != ''
    ) {
      cdketoan[k].tsnd = Tinhcdketoan(cdketoan[k].tk2, field, cdps[0])
    }
  }
  var field = 'cock'
  for (var k = 0; k < cdketoan.length; k++) {
    if (
      cdketoan[k].tk2.indexOf('*') != -1 ||
      cdketoan[k].tk2.indexOf('+') != -1 ||
      cdketoan[k].tk2 != ''
    ) {
      cdketoan[k].tsnc = Tinhcdketoan(cdketoan[k].tk2, field, cdps[0])
    }
  }
  // Tính tổng cho tsCÓ - tk1
  for (var i = 0; i <= 1; i++) {
    var dausao = i == 0 ? '*' : i == 1 ? '**' : '***'
    for (var key = 0; key < cdketoan.length; key++) {
      if (
        (cdketoan[key].masc.indexOf(dausao) > -1) &
        cdketoan[key].tk1.includes('+')
      ) {
        var zkycuoi = 0,
          zkydau = 0,
          strcachtinh = cdketoan[key].tk1.replace(' ', '')
        //console.log(dausao,strcachtinh)
        for (var k = 0; k < cdketoan.length; k++) {
          if (strcachtinh.includes(cdketoan[k].masc.substr(0, 3))) {
            //if( strcachtinh.includes(cdketoan[k].masc.replace('*',''))){
            zkycuoi += cdketoan[k].tscc
            zkydau += cdketoan[k].tscd
          }
        }
        ;(cdketoan[key].tscc = zkycuoi), (cdketoan[key].tscd = zkydau)
      }
    }
  }
  // Tính cho tsNỢ -tk2- NGUỒN VỐN
  for (var i = 0; i <= 2; i++) {
    var dausao = i == 0 ? '*' : i == 1 ? '**' : '***'
    for (var key = 0; key < cdketoan.length; key++) {
      if (
        (cdketoan[key].masn.indexOf(dausao) > -1) &
        cdketoan[key].tk2.includes('+')
      ) {
        var zkycuoi = 0,
          zkydau = 0,
          strcachtinh = cdketoan[key].tk2.replace(' ', '')
        for (var k = 0; k < cdketoan.length; k++) {
          if (
            strcachtinh.includes(cdketoan[k].masn.substr(0, 3)) &
            (cdketoan[k].masn != '')
          ) {
            if ((cdketoan[k].masn != '421a') & (cdketoan[k].masn != '421b')) {
              zkycuoi += cdketoan[k].tsnc
              zkydau += cdketoan[k].tsnd
            }
          }
        }
        ;(cdketoan[key].tsnc = zkycuoi), (cdketoan[key].tsnd = zkydau)
      }
    }
  }
  //cdketoan.forEach((kq ,index) => { console.log(index, kq['masc'],kq['tk1'],kq['tscc'],kq['tscd'],'<===>',kq['tsnc'],kq['tsnd']) })
  cdketoan.forEach((kq, index) => {
    kq['masc'] = kq['masc'].substr(0, 3)
    kq['masn'] = kq['masn'].substr(0, 3)
  })
  return cdketoan
}

//============================  lctiente
exports.lctiente = async function (req, res) {
  let lctiente = await tinh_lctiente(req, res)
  return res.status(200).json({
    success: true,
    message: 'A list of all Lưu chuyển tiền tệ',
    lctiente: lctiente,
  })
}
async function tinh_lctiente(req, res) {
  var company = req.body.company // [company,masothue,dnlon]
  var dnlon = req.body.company.dnlon
  var chedokt = dnlon ? 'DNL' : 'DNN'
  var pd_fromdate = req.body.fromtodate.pd_fromdate
  var pd_todate = req.body.fromtodate.pd_todate
  var dfromt = pd_todate.substr(5, 2) - pd_fromdate.substr(5, 2) + 1 // Mấy tháng
  dfromt = moment(pd_fromdate).subtract(dfromt, 'M')
  var dtot = moment(pd_fromdate).subtract(1, 'd')
  dfromt = moment(dfromt).format('YYYY-MM-DD')
  dtot = moment(dtot).format('YYYY-MM-DD')
  var namnay = pd_todate.substr(0, 4)
  var locyear = namnay >= '2005' ? '15' : '05'
  //console.log(pd_fromdate,pd_todate,dfromt,dtot);

  let lctiente = await runQuerySync(
    `SELECT id,maso,chitieu,dau,tminh,cachtinh,kynay,kytruoc FROM lctiente WHERE chedokt = '` +
      chedokt +
      `' AND kyhieu='` +
      locyear +
      `' AND swt LIKE 'GT%' `,
    [dfromt, dtot],
    req,
    res,
  )
  // function (lctiente) {
  let cdpsnn = await runQuerySync(
    `CALL TinhCanDoiTaiKhoan2(?,?,?)`,
    [pd_fromdate, pd_todate, ''],
    req,
    res,
  )
  // function (cdpsnn) {
  let cdpsnt = await runQuerySync(
    `CALL TinhCanDoiTaiKhoan2(?,?,?)`,
    [dfromt, dtot, ''],
    req,
    res,
  )
  // function (cdpsnt) {
  let datann = await runQuerySync(
    'call Create_Ctuketoan_Rg(?,?)',
    [pd_fromdate, pd_todate],
    req,
    res,
  )
  // function (datann) {
  let datant = await runQuerySync(
    'call Create_Ctuketoan_Rg(?,?)',
    [dfromt, dtot],
    req,
    res,
  )
  // function (datant) {
  if (!datant || !datann || !cdpsnn || !cdpsnt) {
    return res.status(503).json({
      success: false,
      error: '503 Service Unavailable...',
    })
  }
  //console.log(cdpsnn[0][0].sotk ,cdpsnt[0].length)
  //dmsodutk.forEach((dat ,index) => { console.log(index, dat['sotk'],dat['nodk'],dat['codk'],dat['nock'],dat['cock']) })
  for (var i = 0; i <= 1; i++) {
    //let result = (async () => await waitFor(1000) )();
    var data = i == 1 ? datann[0] : datant[0]
    var cdps = i == 1 ? cdpsnn[0] : cdpsnt[0] // runQuerySync('Call') phải thêm [0]
    for (var k = 0; k < lctiente.length; k++) {
      var congtien = TinhCDtaikhoan(lctiente[k].cachtinh, i, cdps) // i: la cua nam nao
      //result = (async () => await TinhCDtaikhoan(lctiente[k].cachtinh,i,cdps) )();
      //var congtien = global.cookie.congtien;
      if (congtien == 0) {
        for (var zz = 0; zz < data.length; zz++) {
          if (
            Check_psnoco(lctiente[k].cachtinh, data[zz].tkno, data[zz].tkco) ==
            2
          ) {
            congtien += data[zz].sotien
          }
          if (lctiente[k].maso.indexOf('01') > -1) {
            if (Check_psnoco('421/911', data[zz].tkno, data[zz].tkco) == 2) {
              congtien -= data[zz].sotien //Tính Lỗ trừ ra
            }
          }
        }
      }
      if (i == 1) {
        lctiente[k].kynay = congtien * lctiente[k].dau
      } else {
        lctiente[k].kytruoc = congtien * lctiente[k].dau
      }
      //lctiente[k].tminh = lctiente[k].tminh.trim()+' +'+ i+'-'+k+'-'+congtien;
    }
  } //lctiente

  // Tinh Tong cho tung NHOM
  //Tinhtongnhom(lctiente)
  let result = (async () => await Tinhtongnhom(lctiente))()
  // Điều chỉnh chỉ tiêu thu chi khác
  var mathu = '- Tiền thu khác'
  var machi = '- Tiền chi khác'
  for (var k = 0; k < lctiente.length; k++) {
    if (lctiente[k].maso == '50') {
      global.cookie.kytruoc = global.cookie.kytruoc - lctiente[k].kytruoc
      global.cookie.kynay = global.cookie.kynay - lctiente[k].kynay
    }
  }

  for (var k = 0; k < lctiente.length; k++) {
    if (
      (lctiente[k].chitieu.indexOf(mathu) > -1) &
      (global.cookie.kytruoc > 0)
    ) {
      lctiente[k].kytruoc = global.cookie.kytruoc + lctiente[k].kytruoc
    }
    if ((lctiente[k].chitieu.indexOf(mathu) > -1) & (global.cookie.kynay > 0)) {
      lctiente[k].kynay = global.cookie.kynay + lctiente[k].kynay
    }
    // machi
    if (
      (lctiente[k].chitieu.indexOf(machi) > -1) &
      (global.cookie.kytruoc < 0)
    ) {
      lctiente[k].kytruoc = global.cookie.kytruoc + lctiente[k].kytruoc
    }
    if ((lctiente[k].chitieu.indexOf(machi) > -1) & (global.cookie.kynay < 0)) {
      lctiente[k].kynay = global.cookie.kynay + lctiente[k].kynay
    }
  }

  // Tinh LAI Tong cho tung NHOM
  //Tinhtongnhom(lctiente)
  result = (async () => await Tinhtongnhom(lctiente))()
  //lctiente[42].tminh = ' - nn: '+datann[0].length +' - nt: '+ datant[0].length +' ['+dfromt+'/'+dtot+']'
  //lctiente.forEach((kq ,index) => { console.log(index,kq.maso, kq['chitieu'],kq['tminh'],kq['kynay'],kq['kytruoc']) })
  return lctiente
}

//============================  Ketquakd
exports.ketquakd = async function (req, res) {
  let ketqua = await tinh_ketquakd(req, res)
  return res.status(200).json({
    success: true,
    message: 'A list of all Kết quả Kinh Doanh',
    ketquakd: ketqua,
  })
}
async function tinh_ketquakd(req, res) {
  var company = req.body.company // [company,masothue,dnlon]
  var dnlon = req.body.company.dnlon
  var chedokt = dnlon ? 'DNL' : 'DNN'
  var pd_fromdate = req.body.fromtodate.pd_fromdate
  var pd_todate = req.body.fromtodate.pd_todate
  var dfromt = pd_todate.substr(5, 2) - pd_fromdate.substr(5, 2) + 1 // Mấy tháng
  dfromt = moment(pd_fromdate).subtract(dfromt, 'M')
  var dtot = moment(pd_fromdate).subtract(1, 'd')
  dfromt = moment(dfromt).format('YYYY-MM-DD')
  dtot = moment(dtot).format('YYYY-MM-DD')
  var namnay = pd_todate.substr(0, 4)
  var locyear = '99'
  switch (true) {
    case namnay <= '2002':
      locyear = '99'
    case namnay < '2015':
      locyear = '02'
    case namnay >= '2015':
      locyear = '15'
  }

  let ketqua = await runQuerySync(
    `SELECT id,maso,chitieu,tminh,cachtinh,kynay,kytruoc,kyhieu1 FROM ketquakd WHERE chedokt = '` +
      chedokt +
      `' AND kyhieu='` +
      locyear +
      `' AND swt LIKE 'KQ%' `,
    [dfromt, dtot],
    req,
    res,
  )
  // function (ketqua) {
  // console.log(ketqua)
  let datant = await runQuerySync(
    'call Create_Ctuketoan_Rg(?,?)',
    [dfromt, dtot],
    req,
    res,
  )
  // function (datant) {
  //console.log(datant)
  let datann = await runQuerySync(
    'call Create_Ctuketoan_Rg(?,?)',
    [pd_fromdate, pd_todate],
    req,
    res,
  )
  // function (datann) {
  //console.log(datann)
  for (var i = 0; i <= 1; i++) {
    data = i == 1 ? datann : datant
    ketqua.forEach((kq, index) => {
      var congtien = 0 // Tinh tung dong duyet qua het data
      data[0].forEach((item, index2) => {
        if (Check_psnoco(kq.cachtinh, item.tkno, item.tkco) == 2) {
          congtien += item.sotien
        }
      })
      if (i == 1) {
        kq['kynay'] = congtien
      } else {
        kq['kytruoc'] = congtien
      }
      //if(i==1) console.log(index, kq['chitieu'],kq['kynay'],kq['kytruoc'])
    })
  } //ketqua

  await Tinhtongnhom(ketqua)
  // ketqua.forEach((kq ,index) => { console.log(index, kq['chitieu'],kq['kynay'],kq['kytruoc']) })
  return ketqua
}

//==================================================
function getkykekhai(opt = '', pd_fromdate, pd_todate) {
  var namnay = pd_todate.substr(6, 4)
  var qui = 'X'
  if (pd_fromdate.substr(3, 2) == '01' && pd_todate.substr(3, 2) == '03')
    qui = '1'
  if (pd_fromdate.substr(3, 2) == '04' && pd_todate.substr(3, 2) == '06')
    qui = '2'
  if (pd_fromdate.substr(3, 2) == '07' && pd_todate.substr(3, 2) == '09')
    qui = '3'
  if (pd_fromdate.substr(3, 2) == '10' && pd_todate.substr(3, 2) == '12')
    qui = '4'

  if (pd_fromdate.substr(3, 2) == pd_todate.substr(3, 2))
    return opt ? 'M' : pd_todate.substr(3, 2) + '/' + namnay
  if (pd_fromdate.substr(3, 2) == '01' && pd_todate.substr(3, 2) == '12')
    return opt ? 'Y' : namnay
  return opt ? 'Q' : qui + '/' + namnay
}

function getfromtodate(pd_fromdate, pd_todate) {
  pd_fromdate = moment(pd_fromdate).format('DD-MM-YYYY')
  pd_todate = moment(pd_todate).format('DD-MM-YYYY')
  var namnay = pd_todate.substr(6, 4)
  var qui = ''
  if ((pd_fromdate.substr(3, 2) == '01') & (pd_todate.substr(3, 2) == '03'))
    qui = '1'
  if ((pd_fromdate.substr(3, 2) == '04') & (pd_todate.substr(3, 2) == '03'))
    qui = '2'
  if ((pd_fromdate.substr(3, 2) == '07') & (pd_todate.substr(3, 2) == '09'))
    qui = '3'
  if ((pd_fromdate.substr(3, 2) == '10') & (pd_todate.substr(3, 2) == '12'))
    qui = '4'

  if (qui) return 'Quí ' + qui + '/' + namnay
  if ((pd_fromdate.substr(3, 2) == '01') & (pd_todate.substr(3, 2) == '12'))
    return 'Năm ' + namnay
  if (pd_fromdate.substr(3, 2) == pd_todate.substr(3, 2))
    return 'Tháng ' + pd_todate.substr(3, 2) + '/' + namnay

  return 'Từ ' + pd_fromdate.substr(0, 5) + '/' + pd_todate
}

//==================================================
async function TinhHoadonSudung(fromtodate, req, res, fn) {
  var query = `CALL getHoadon(?,?,?,?,?)`
  var tudengay = [
    fromtodate.pd_fromdate,
    fromtodate.pd_todate,
    '20',
    'sohd',
    '',
  ]

  let rows = await runQuerySync(query, tudengay, req, res)

  // var mysqlConnection = createConnect(req, res)
  // mysqlConnection.connect((err) => {
  //   if (!err) {
  //     mysqlConnection.query(query, tudengay, (err, rows, fields) => {
  var dataz = []
  //mysqlConnection.destroy()
  if (rows) {
    var ncnt = 0
    sohd_luu = null
    mauhd_luu = null
    for (var i = 0; i < rows[0].length; i++) {
      //console.log(i,rows[0][i]['sohd'] , rows[0][i]['soct'], rows[0][i]['sotien'])
      var strhd = rows[0][i]['sohd']
      // Tách số hóa đơn
      var sohd = strhd.substring(strhd.indexOf('-') + 1)
      var mauhd = strhd.substring(0, strhd.indexOf('-'))
      if (!sohd || !mauhd) break
      if (mauhd_luu != mauhd) {
        dataz[ncnt] = {
          mauhd: '',
          sohd_begin: '',
          soluong_sd: 0,
          sohd_end: '',
          soluong_sd: 0,
          tongdung: 0,
          soluong_huy: 0,
        }
        dataz[ncnt]['mauhd'] = mauhd
        dataz[ncnt]['sohd_begin'] = sohd
        dataz[ncnt]['soluong_sd'] = ncnt + 1
        ncnt++
      } else {
        dataz[ncnt - 1]['sohd_end'] = sohd
        dataz[ncnt - 1]['soluong_sd'] = dataz[ncnt - 1]['soluong_sd'] + 1
      }
      sohd_luu = sohd
      mauhd_luu = mauhd
    }
    for (var key = 0; key < dataz.length; key++) {
      if (!dataz[key]['sohd_end'])
        dataz[key]['sohd_end'] = dataz[key]['sohd_begin']
      dataz[key]['tongdung'] =
        dataz[key]['sohd_end'] - dataz[key]['sohd_begin'] + 1
      if (dataz[key]['soluong_sd'] > dataz[key]['tongdung']) {
        dataz[key]['soluong_sd'] = dataz[key]['tongdung']
      } // Trên là xử lý trường hợp trùng hóa đơn
      dataz[key]['soluong_huy'] =
        dataz[key]['tongdung'] - dataz[key]['soluong_sd']
    }
    // rows.forEach(element =>
    // );
  } else {
    console.log(
      'DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2),
    )
  }

  //console.table(dataz)
  //return dataz
  fn(dataz)
  //     })
  //   } else {
  //     console.log(
  //       'DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2),
  //     )
  //   }
  // })
}

//==================================================
async function GetThuegtgt(fromtodate, maso, order, req, res, fn) {
  var query = `CALL getHoadon(?,?,?,?,?)`
  var tudengay = [fromtodate.pd_fromdate, fromtodate.pd_todate, maso, order, '']
  try {
    let retQuery = await runQuerySync(query, tudengay, req, res)
    fn(retQuery)
  } catch (err) {
    return res.status(500).json({ error: err })
  }

  // var mysqlConnection = createConnect(req, res)
  // mysqlConnection.connect((err) => {
  //   if (!err) {
  //     var dataz = []
  //     mysqlConnection.query(query, tudengay, (err, rows, fields) => {
  //       mysqlConnection.destroy()
  //       dataz = rows
  //       if (!err) {
  //       } else {
  //         console.log(
  //           'DB connection failed \n Error : ' +
  //             JSON.stringify(err, undefined, 2),
  //         )
  //       }
  //       fn(dataz)
  //     })
  //   } else {
  //     console.log(
  //       'DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2),
  //     )
  //   }
  // })
}

//==================================================
function Check_psnoco(str_kq, tkno, tkco) {
  //==================================================
  var found = 0
  if (str_kq.indexOf('/') > -1) {
    // Tach chuoi
    var str_tk = str_kq.split('/')
    var str_no = str_tk[0].split(',')
    var str_co = str_tk[1].split(',')
    var len_arrno = str_no.length
    var len_arrco = str_co.length
    for (i = 0; i < len_arrno; i++) {
      var lenstr = str_no[i].length
      //console.log(str_no[i], tkno.substr(0,lenstr))
      if (str_no[i] === tkno.substr(0, lenstr)) {
        found++
        break
      }
    }
    for (i = 0; i < len_arrco; i++) {
      var lenstr = str_co[i].length
      if (str_co[i] === tkco.substr(0, lenstr)) {
        found++
        break
      }
    }
  }
  return found // if = 2 is OK
}
//==================================================
function TinhCDtaikhoan(cachtinh, kynao, dat) {
  // Tính CUỐI KỲ-ĐẦU KỲ tài khoản
  //==================================================
  if (cachtinh.indexOf('C-D') > -1) {
    var strfor = cachtinh.replace('C-D', '')
    // Xử lý cùng lúc cho Cuốikỳ & Đầukỳ
    if (strfor.indexOf(',') > -1) {
      var arrstrfors = strfor.split(',')
    } else {
      var arrstrfors = [strfor]
    }
    var znodk = 0,
      zcodk = 0,
      znock = 0,
      zcock = 0
    for (var k = 0; k < arrstrfors.length; k++) {
      for (var key = 0; key < dat.length; key++) {
        var csotk = arrstrfors[k].trim()
        var nlen = csotk.length
        if (csotk == dat[key].sotk.substr(0, nlen)) {
          znodk += dat[key].nodk
          zcodk += dat[key].codk
          znock += dat[key].nock
          zcock += dat[key].cock
        }
      }
    }
    //console.log( znodk, zcodk, znock, zcock) ;
    var congtien = znock - zcock - (znodk - zcodk)
    if (strfor.trim() == '11') {
      // Lưu Phát sinh 11 để điều chỉnh
      if (kynao == 0) {
        global.cookie.kytruoc = congtien
      } else {
        global.cookie.kynay = congtien
      }

      global.cookie.congtien = znodk - zcodk
      return znodk - zcodk // Mã 60 = Tiền và tương đương tiền đầu kỳ
    } else {
      global.cookie.congtien = znock - zcock - (znodk - zcodk)
      return znock - zcock - (znodk - zcodk)
    }
  } else {
    global.cookie.congtien = 0
    return 0 // Không phải C-D
  }
}

//==================================================
function Tinhtongnhom(dtable) {
  //==================================================
  for (var key = 0; key < dtable.length; key++) {
    if (dtable[key].cachtinh.indexOf('Z') > -1) {
      var zkynay = 0,
        zkytruoc = 0,
        strcachtinh = dtable[key].cachtinh.replace(' ', '')
      for (var k = 0; k < dtable.length; k++) {
        if (
          strcachtinh.includes(dtable[k].maso) &
          (dtable[k].maso != dtable[key].maso)
        ) {
          if (strcachtinh.includes('-' + dtable[k].maso)) {
            zkynay -= dtable[k].kynay
            zkytruoc -= dtable[k].kytruoc
          } else {
            zkynay += dtable[k].kynay
            zkytruoc += dtable[k].kytruoc
          }
        }
      }
      ;(dtable[key].kynay = zkynay), (dtable[key].kytruoc = zkytruoc)
    }
  }
  // dtable.forEach((kq ,index) => { console.log(index, kq['chitieu'],kq['kynay'],kq['kytruoc']) })
}

//==================================================
function Tinhcdketoan(strfors, field, cdps) {
  // tk1,nodn
  //==================================================
  var tongcong = 0
  if (strfors.indexOf(',') > -1) {
    var strfors_ = strfors.split(',')
  } else {
    var strfors_ = [strfors]
  }
  for (var k = 0; k < strfors_.length; k++) {
    if (strfors_[k].indexOf('-') > -1) {
      var strfors_k = strfors_[k].split('-')
    } else {
      var strfors_k = [strfors_[k]]
    }
    for (var kk = 0; kk < strfors_k.length; kk++) {
      var dautruoc = strfors.substr(strfors.indexOf(strfors_k[kk]) - 1, 1)
      if (dautruoc == '-') {
        // Đầu tiên trong nhóm
        var cong = Tinhcdkt(strfors_k[kk], field, cdps)
        tongcong -= cong
      } else {
        var cong = Tinhcdkt(strfors_k[kk], field, cdps)
        tongcong += cong
      }
    }
  }
  // console.log(strfors,tongcong)
  // return process.abort();
  return tongcong
}

//==================================================
function Tinhcdkt(sotk, field, cdps) {
  //==================================================
  sotk = sotk.trim()
  var nlen = sotk.length
  var zcong = 0
  for (var k = 0; k < cdps.length; k++) {
    if (cdps[k].sotk.substr(0, nlen) == sotk) {
      var strtest = '214,129,139,159,229,412,413,421,431,419,461,353'
      if ((nlen >= 3) & (strtest.indexOf(sotk.substr(0, 3)) > -1)) {
        //console.log(sotk)
        switch (field) {
          case 'nodn':
            zcong += cdps[k].nodn - cdps[k].codn
            break
          case 'nock':
            zcong += cdps[k].nock - cdps[k].cock
            break
          case 'codn':
            zcong += cdps[k].codn - cdps[k].nodn
            break
          case 'cock':
            zcong += cdps[k].cock - cdps[k].nock
            break
        }
      } else {
        switch (field) {
          case 'nodn':
            zcong += cdps[k].nodn
            break
          case 'nock':
            zcong += cdps[k].nock
            break
          case 'codn':
            zcong += cdps[k].codn
            break
          case 'cock':
            zcong += cdps[k].cock
            break
        }
      }
    }
  }
  return zcong
}

//==================================================
exports.sonhatkyhh = async function (req, res) {
  //==================================================
  var fromtodate = JSON.parse(req.query.fromtodate) // ERROR khi: JSON.parse(req.query.fromtodate.pd_fromdate);
  var pd_fromdate = fromtodate.pd_fromdate
  var pd_todate = fromtodate.pd_todate
  var vn_todate = moment(pd_todate).format('DD-MM-YYYY')
  var str_hanghoa = "'151','152','153','155','156','157','158','002','003'"
  var file1 = 'public/download/TM-BCKT-TEMPLATE.xlsx'

  let datann = await runQuerySync(
    'call Create_Ctuvattu2(?,?,?,?)',
    [pd_fromdate, pd_todate, '', ''],
    req,
    res,
  )
  // function (datann) {
  const wb1 = new Excel.Workbook()
  wb1.xlsx.readFile(file1).then(async function () {
    var ws_snk = wb1.getWorksheet('Sổ nhật ký Hàng hóa')
    var ws_ct = wb1.getWorksheet('Chi tiết Hàng hóa')
    const wb = new Excel.Workbook()

    //========= Sổ Nhật Ký ==============
    if (req.query.patern.includes('+')) {
      let ws = wb.addWorksheet() // Sổ nhật ký
      ws.model = ws_snk.model
      req.query.patern = req.query.patern.replace('+', '')
      var sott = 5 // Dòng dữ liệu đầu tiên
      ws.getCell('D2').value = getfromtodate(pd_fromdate, pd_todate)
      if (datann) {
        datann[0].forEach((kq, index) => {
          ws.duplicateRow(sott, 1, true)
          ws.getCell('B' + sott).value = kq.soct
          ws.getCell('C' + sott).value = moment(kq.ngay).format('DD/MM/YYYY')
          ws.getCell('D' + sott).value = kq.diengiai
          ws.getCell('E' + sott).value = kq.tkno
          ws.getCell('F' + sott).value = kq.tkco
          ws.getCell('G' + sott).value = kq.mahang
          ws.getCell('H' + sott).value = kq.makho
          ws.getCell('I' + sott).value = kq.tenhang
          ws.getCell('J' + sott).value = kq.donvi
          ws.getCell('K' + sott).value = kq.soluong
          ws.getCell('L' + sott).value = kq.sotien
          sott++
        }) //datann[0].forEach
      } else {
        req.query.patern = ''
      }
      const lastR = ws.rowCount
      ws.getCell('K' + lastR).value = {
        formula: 'SUM(K5:K' + (lastR - 1) + ')',
      }
      ws.getCell('L' + lastR).value = {
        formula: 'SUM(L5:L' + (lastR - 1) + ')',
      }
      ws.mergeCells('D1:K1')
      ws.mergeCells('D2:K2')
    } //=======================

    //========= Sổ Chi tiết ==============
    if (req.query.patern) {
      let cdps = await runQuerySync(
        `CALL TinhCanDoiHangHoa2(?,?,?)`,
        [pd_fromdate, pd_todate, ''],
        req,
        res,
      )
      // function (cdps) {
      var nlen = req.query.patern.length
      var mahang_patern = req.query.patern
      cdps = cdps[0]
      //console.log(req.query.patern,cdps)
      for (var k = 0; k < cdps.length; k++) {
        var cosodu =
          cdps[k].luongdk +
            cdps[k].tiendk +
            cdps[k].luongnhap +
            cdps[k].tiennhap +
            cdps[k].luongxuat +
            cdps[k].tienxuat +
            cdps[k].luongck +
            cdps[k].tienck !=
          0
        if (
          cosodu &&
          (cdps[k].mahang.substr(0, nlen) == mahang_patern ||
            mahang_patern.includes('*'))
        ) {
          let ws1 = wb.addWorksheet() // Chi tiết 1
          ws1.model = ws_ct.model
          ws1.name = 'mh_' + cdps[k].mahang
          //console.log(k,req.query.patern,cdps[k].mahang,ws1.name)
          var sott = 7 // Dòng dữ liệu đầu tiên
          var luongck = cdps[k].luongdk
          var tienck = cdps[k].tiendk
          ws1.getCell('D2').value =
            'Tên hàng : ' + cdps[k].tenhang + ' ( ' + cdps[k].mahang + ' )'
          ws1.getCell('K1').value = '??'
          ws1.getCell('K2').value = cdps[k].donvi
          ws1.getCell('D3').value = getfromtodate(pd_fromdate, pd_todate)
          ws1.getCell('K3').value = luongck
          ws1.getCell('L3').value = tienck
          datann[0].forEach((kq, index) => {
            if (kq.mahang + kq.makho == cdps[k].mahang + cdps[k].makho) {
              ws1.getCell('K1').value = kq.tengoi // Mặc kệ khi gán nhiều lần
              ws1.duplicateRow(sott, 1, true)
              ws1.getCell('B' + sott).value = kq.soct
              ws1.getCell('C' + sott).value = moment(kq.ngay).format(
                'DD/MM/YYYY',
              )
              ws1.getCell('D' + sott).value = kq.diengiai
              if (str_hanghoa.includes(kq.tkno.substr(0, 3))) {
                // Là Nhập
                ws1.getCell('E' + sott).value = kq.tkco
                ws1.getCell('G' + sott).value = kq.soluong
                ws1.getCell('H' + sott).value = kq.sotien
                luongck = luongck + kq.soluong
                tienck = tienck + kq.sotien
              } else {
                ws1.getCell('E' + sott).value = kq.tkno
                ws1.getCell('I' + sott).value = kq.soluong
                ws1.getCell('J' + sott).value = kq.sotien
                luongck = luongck - kq.soluong
                tienck = tienck - kq.sotien
              }
              ws1.getCell('F' + sott).value =
                kq.soluong != 0 ? kq.sotien / kq.soluong : 0
              ws1.getCell('K' + sott).value = luongck
              ws1.getCell('L' + sott).value = tienck
              sott++
            }
          }) //datann[0].forEach
          const lastR = ws1.rowCount
          ws1.getCell('G' + lastR).value = {
            formula: 'SUM(G7:G' + (lastR - 1) + ')',
          }
          ws1.getCell('H' + lastR).value = {
            formula: 'SUM(H7:H' + (lastR - 1) + ')',
          }
          ws1.getCell('I' + lastR).value = {
            formula: 'SUM(I7:I' + (lastR - 1) + ')',
          }
          ws1.getCell('J' + lastR).value = {
            formula: 'SUM(J7:J' + (lastR - 1) + ')',
          }
          ws1.getCell('K' + lastR).value = cdps[k].luongck
          ws1.getCell('L' + lastR).value = cdps[k].tienck
          ws1.mergeCells('D1:I1')
          ws1.mergeCells('D2:I2')
          ws1.mergeCells('D3:I3')
          ws1.mergeCells('B5:C5')
          ws1.mergeCells('D5:D6')
          ws1.mergeCells('F5:F6')
          ws1.mergeCells('G5:H5')
          ws1.mergeCells('I5:J5')
          ws1.mergeCells('K1:L1')
          ws1.mergeCells('K5:L5')
        }
      }

      res.set(
        'Content-Disposition',
        'attachment; filename=' + req.query.filename,
      )
      res.set(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
      //return wb.xlsx.writeFile(res).then(function () {
      // For Test  =============  res = "public/download/TEMPLATE.xlsx";
      return wb.xlsx.write(res).then(function () {
        if (wb.worksheets.length == 0) console.log('Data is Empty !!')
        else console.log('successFully !!')
        res.status(200).end()
      })
    } else {
      console.log('Data is Empty !!')
      res.status(200).end()
    } //=======================
  }) // wb.xlsx.readFile
  //},
  //) // call Create_Ctuketoan
  //=============================   Sonhatkyhh
}
//==================================================
exports.sonhatky = async function (req, res) {
  //==================================================
  req.query.fromtodate = JSON.parse(req.query.fromtodate)
  req.query.company = JSON.parse(req.query.company)
  // For App ( Tắt dòng dưới --> Mở 2 dòng trên & Ngược lại)
  //req.query = req.body;   // For requests.rest

  var file1 = 'public/download/TM-BCKT-TEMPLATE.xlsx'

  let datann = await runQuerySync(
    'call Create_Ctuketoan(?,?)',
    [req.query.fromtodate.pd_fromdate, req.query.fromtodate.pd_todate],
    req,
    res,
  )
  // function (datann) {
  const wb1 = new Excel.Workbook()
  wb1.xlsx.readFile(file1).then(async function () {
    var ws_snk = wb1.getWorksheet('Sổ nhật ký')
    var ws_ct = wb1.getWorksheet('Chi tiết')
    const wb = new Excel.Workbook()

    //========= Sổ Nhật Ký ==============
    if (req.query.patern.includes('+')) {
      let ws = wb.addWorksheet() // Sổ nhật ký
      ws.model = ws_snk.model
      req.query.patern = req.query.patern.replace('+', '')
      var sott = 5 // Dòng dữ liệu đầu tiên
      ws.getCell('D2').value = getfromtodate(
        req.query.fromtodate.pd_fromdate,
        req.query.fromtodate.pd_todate,
      )
      datann[0].forEach((kq, index) => {
        ws.duplicateRow(sott, 1, true)
        ws.getCell('B' + sott).value = kq.soct
        ws.getCell('C' + sott).value = moment(kq.ngay).format('DD/MM/YYYY')
        ws.getCell('D' + sott).value = kq.diengiai
        ws.getCell('E' + sott).value = kq.tkno
        ws.getCell('F' + sott).value = kq.tkco
        ws.getCell('G' + sott).value = kq.sotien
        sott++
      }) //datann[0].forEach
      const lastR = ws.rowCount
      ws.getCell('G' + lastR).value = {
        formula: 'SUM(G5:G' + (lastR - 1) + ')',
      }
    } //=======================

    //========= Sổ Chi tiết ==============
    if (req.query.patern) {
      let cdps = await runQuerySync(
        `CALL TinhCanDoiTaiKhoan2(?,?,?)`,
        [req.query.fromtodate.pd_fromdate, req.query.fromtodate.pd_todate, ''],
        req,
        res,
      )
      // function (cdps) {
      var nlen = req.query.patern.length
      var sotk_patern = req.query.patern
      cdps = cdps[0]
      //console.log(req.query.patern,cdps)
      for (var k = 0; k < cdps.length; k++) {
        if (
          (cdps[k].nodk +
            cdps[k].codk +
            cdps[k].psno +
            cdps[k].psco +
            cdps[k].nock +
            cdps[k].cock !=
            0) &
          (cdps[k].sotk.substr(0, nlen) == sotk_patern ||
            sotk_patern.includes('*'))
        ) {
          let ws1 = wb.addWorksheet() // Chi tiết 1
          ws1.model = ws_ct.model
          ws1.name = 'TK_' + cdps[k].sotk
          //console.log(k,req.query.patern,cdps[k].sotk,ws1.name)
          var sott = 6 // Dòng dữ liệu đầu tiên
          datann[0].forEach((kq, index) => {
            if (kq.tkno == cdps[k].sotk || kq.tkco == cdps[k].sotk) {
              ws1.duplicateRow(sott, 1, true)
              ws1.getCell('B' + sott).value = kq.soct
              ws1.getCell('C' + sott).value = moment(kq.ngay).format(
                'DD/MM/YYYY',
              )
              ws1.getCell('D' + sott).value = kq.diengiai
              ws1.getCell('E' + sott).value = kq.tkno
              ws1.getCell('F' + sott).value = kq.tkco
              ws1.getCell('G' + sott).value = kq.sotien
              if (kq.tkno == cdps[k].sotk)
                ws1.getCell('H' + sott).value = kq.sotien
              if (kq.tkco == cdps[k].sotk)
                ws1.getCell('I' + sott).value = kq.sotien
              sott++
            }
          }) //datann[0].forEach
          ws1.getCell('D2').value = '[ ' + cdps[k].tentk + ' ]'
          ws1.getCell('D3').value = getfromtodate(
            req.query.fromtodate.pd_fromdate,
            req.query.fromtodate.pd_todate,
          )
          ws1.getCell('E1').value = cdps[k].sotk
          ws1.getCell('H1').value = cdps[k].nodk
          ws1.getCell('I1').value = cdps[k].codk
          ws1.getCell('H2').value = cdps[k].psno
          ws1.getCell('I2').value = cdps[k].psco
          ws1.getCell('H3').value = cdps[k].nock
          ws1.getCell('I3').value = cdps[k].cock
          const lastR = ws1.rowCount
          ws1.getCell('H' + lastR).value = {
            formula: 'SUM(H5:H' + (lastR - 1) + ')',
          }
          ws1.getCell('I' + lastR).value = {
            formula: 'SUM(I5:I' + (lastR - 1) + ')',
          }
        }
      }
      res.set(
        'Content-Disposition',
        'attachment; filename=' + req.query.filename,
      )
      res.set(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
      return wb.xlsx.write(res).then(function () {
        if (wb.worksheets.length == 0) console.log('Data is Empty !!')
        else console.log('successFully !!')
        res.status(200).end()
      })
    } //=======================
  }) // wb.xlsx.readFile
  //},
  //) // call Create_Ctuketoan
  //=============================   Sonhatky
}

//==================================================
exports.candoipsXLSX = async function (req, res) {
  //==================================================
  //req.query = req.body;   // For requests.rest
  req.query.fromtodate = JSON.parse(req.query.fromtodate)
  req.query.company = JSON.parse(req.query.company)
  // ================ For App ( Tắt dòng dưới --> Mở 2 dòng trên & Ngược lại)

  //paternOptions: ['1- Có số dư & Phát sinh','2- Chỉ có Số dư','3- Chỉ có Phát sinh', '4- Không phát sinh', '5- Số dư Không hợp lệ', '6- Toàn bộ danh mục'],
  var cfilter = 'kq.sotk'
  switch (true) {
    case req.query.patern.includes('1'):
      cfilter =
        'kq.nodk +kq.codk !==0 || kq.nock +kq.cock !== 0 || kq.psno +kq.psco !==0'
      break
    case req.query.patern.includes('2'):
      cfilter = 'kq.nodk +kq.codk !== 0 || kq.nock +kq.cock !== 0'
      break
    case req.query.patern.includes('3'):
      cfilter = 'kq.psno +kq.psco !== 0'
      break
    case req.query.patern.includes('4'):
      cfilter = 'kq.psno +kq.psco == 0'
      break
    case req.query.patern.includes('5'):
      cfilter = "kq.sotk.substr(0,1) > '4' & kq.nock +kq.cock !== 0"
      break
    default:
      cfilter = 'kq.sotk'
      break
  }
  //console.log(cfilter)
  var template =
    'public/download/' +
    (req.query.company.dnlon ? 'TM-BCTC-TT200.xlsx' : 'TM-BCTC-TT133.xlsx')
  let cdps = await runQuerySync(
    `CALL TinhCanDoiTaiKhoan2(?,?,?)`,
    [req.query.fromtodate.pd_fromdate, req.query.fromtodate.pd_todate, ''],
    req,
    res,
  )
  // function (cdps) {
  const wb_tpl = new Excel.Workbook()
  wb_tpl.xlsx.readFile(template).then(function () {
    const ws_tpl = wb_tpl.getWorksheet('Cân đối Tài khoản')
    const wb = new Excel.Workbook()
    let ws = wb.addWorksheet()
    ws.model = ws_tpl.model
    var sott = 7 // Dòng dữ liệu đầu tiên
    ws.getCell('A3').value = getfromtodate(
      req.query.fromtodate.pd_fromdate,
      req.query.fromtodate.pd_todate,
    )
    cdps[0].forEach((kq, index) => {
      if (eval(cfilter)) {
        ws.duplicateRow(sott, 1, true)
        ws.getCell('A' + sott).value = kq.sotk
        ws.getCell('B' + sott).value = kq.tentk
        ws.getCell('C' + sott).value = kq.nodk
        ws.getCell('D' + sott).value = kq.codk
        ws.getCell('E' + sott).value = kq.psno
        ws.getCell('F' + sott).value = kq.psco
        ws.getCell('G' + sott).value = kq.nock
        ws.getCell('H' + sott).value = kq.cock
        ;[
          'A' + sott,
          'B' + sott,
          'C' + sott,
          'D' + sott,
          'E' + sott,
          'F' + sott,
          'G' + sott,
          'H' + sott,
        ].map((key) => {
          // ws.getCell(key ).fill = {
          //     type: 'pattern',
          //     pattern:'solid',
          //     fgColor:{argb:'ebedef'}
          // };
          ws.getCell(key).border = {
            top: { style: 'hair' },
            left: { style: 'thin' },
            bottom: { style: 'hair' },
            right: { style: 'thin' },
          }
        })
        sott++
      }
    }) // cdps[0].forEach
    const lastR = ws.rowCount - 1
    ws.getCell('C' + lastR).value = {
      formula: 'SUM(C7:C' + (lastR - 1) + ')',
    }
    ws.getCell('D' + lastR).value = {
      formula: 'SUM(D7:D' + (lastR - 1) + ')',
    }
    ws.getCell('E' + lastR).value = {
      formula: 'SUM(E7:E' + (lastR - 1) + ')',
    }
    ws.getCell('F' + lastR).value = {
      formula: 'SUM(F7:F' + (lastR - 1) + ')',
    }
    ws.getCell('G' + lastR).value = {
      formula: 'SUM(G7:G' + (lastR - 1) + ')',
    }
    ws.getCell('H' + lastR).value = {
      formula: 'SUM(H7:H' + (lastR - 1) + ')',
    }
    ws.mergeCells('G1:H3')
    ws.mergeCells('A2:F2')
    ws.mergeCells('A3:F3')

    res.set('Content-Disposition', 'attachment; filename=' + req.query.filename)
    res.set(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    return wb.xlsx.write(res).then(function () {
      if (wb.worksheets.length == 0) console.log('Data is Empty !!')
      else console.log('successFully !!')
      res.status(200).end()
    })
  }) // wb.xlsx.readFile
}

//==================================================
exports.candoihhXLSX = async function (req, res) {
  //==================================================
  //req.query = req.body;   // For requests.rest
  req.query.fromtodate = JSON.parse(req.query.fromtodate)
  req.query.company = JSON.parse(req.query.company)
  // ================ For App ( Tắt dòng dưới --> Mở 2 dòng trên & Ngược lại)
  //paternOptions: ['1- Có số dư & Phát sinh','2- Chỉ có Số dư','3- Chỉ có Phát sinh', '4- Không phát sinh', '5- Số dư Không hợp lệ', '6- Toàn bộ danh mục'],
  var cfilter = 'kq.mahang'
  switch (true) {
    case req.query.patern.includes('1'):
      cfilter = 'kq.luongnhap !== 0 || kq.luongxuat !== 0 || kq.luongck !== 0'
      break
    case req.query.patern.includes('2'):
      cfilter = 'kq.luongck !== 0'
      break
    case req.query.patern.includes('3'):
      cfilter = 'kq.luongnhap !== 0 || kq.luongxuat !== 0'
      break
    case req.query.patern.includes('4'):
      cfilter = 'kq.luongnhap == 0 && kq.luongxuat == 0'
      break
    case req.query.patern.includes('5'):
      cfilter = 'kq.luongck < 0 || kq.tienck < 0 '
      break
    default:
      cfilter = 'kq.mahang'
      break
  }
  //console.log(cfilter)
  //  protected $fillable = ['mahang','makho','luongdn','tiendn','luongdk','tiendk','luongnhap','tiennhap','luongxuat','tienxuat','luongck','tienck' ];

  var template = 'public/download/TM-BCKT-TEMPLATE.xlsx'
  let cdps = await runQuerySync(
    `CALL TinhCanDoiHangHoa2(?,?,?)`,
    [req.query.fromtodate.pd_fromdate, req.query.fromtodate.pd_todate, ''],
    req,
    res,
  )
  // function (cdps) {
  const wb_tpl = new Excel.Workbook()
  wb_tpl.xlsx.readFile(template).then(function () {
    const ws_tpl = wb_tpl.getWorksheet('Nhập xuất tồn kho')
    const wb = new Excel.Workbook()
    let ws = wb.addWorksheet()
    ws.model = ws_tpl.model
    var sott = 5,
      begin = sott // Dòng dữ liệu đầu tiên
    ws.getCell('E2').value = getfromtodate(
      req.query.fromtodate.pd_fromdate,
      req.query.fromtodate.pd_todate,
    )
    if (cdps) {
      cdps[0].forEach((kq, index) => {
        if (eval(cfilter)) {
          ws.duplicateRow(sott, 1, true)
          ws.getCell('B' + sott).value = index + 1
          ws.getCell('C' + sott).value = kq.mahang
          ws.getCell('D' + sott).value = kq.makho
          ws.getCell('E' + sott).value = kq.tenhang
          ws.getCell('F' + sott).value = kq.donvi
          ws.getCell('G' + sott).value = kq.luongdk
          ws.getCell('H' + sott).value = kq.tiendk
          ws.getCell('I' + sott).value = kq.luongnhap
          ws.getCell('J' + sott).value = kq.tiennhap
          ws.getCell('K' + sott).value = kq.luongxuat
          ws.getCell('L' + sott).value = kq.tienxuat
          ws.getCell('M' + sott).value = kq.luongck
          ws.getCell('N' + sott).value = kq.tienck
          ;[
            'B' + sott,
            'C' + sott,
            'D' + sott,
            'E' + sott,
            'F' + sott,
            'G' + sott,
            'H' + sott,
            'I' + sott,
            'J' + sott,
            'K' + sott,
            'L' + sott,
            'M' + sott,
            'N' + sott,
          ].map((key) => {
            // ws.getCell(key ).fill = {
            //     type: 'pattern',
            //     pattern:'solid',
            //     fgColor:{argb:'ebedef'}
            // };
            ws.getCell(key).border = {
              top: { style: 'hair' },
              left: { style: 'thin' },
              right: { style: 'thin' },
              bottom: { style: 'hair' },
            }
          })
          //ws.getRow(sott).commit();
          sott++
        }
      }) // cdps[0].forEach
    }
    const lastR = ws.rowCount
    ws.getCell('G' + lastR).value = {
      formula: 'SUM(G' + begin + ':G' + (lastR - 1) + ')',
    }
    ws.getCell('H' + lastR).value = {
      formula: 'SUM(H' + begin + ':H' + (lastR - 1) + ')',
    }
    ws.getCell('I' + lastR).value = {
      formula: 'SUM(I' + begin + ':I' + (lastR - 1) + ')',
    }
    ws.getCell('J' + lastR).value = {
      formula: 'SUM(J' + begin + ':J' + (lastR - 1) + ')',
    }
    ws.getCell('K' + lastR).value = {
      formula: 'SUM(K' + begin + ':K' + (lastR - 1) + ')',
    }
    ws.getCell('L' + lastR).value = {
      formula: 'SUM(L' + begin + ':L' + (lastR - 1) + ')',
    }
    ws.getCell('M' + lastR).value = {
      formula: 'SUM(M' + begin + ':M' + (lastR - 1) + ')',
    }
    ws.getCell('N' + lastR).value = {
      formula: 'SUM(N' + begin + ':N' + (lastR - 1) + ')',
    }

    ws.mergeCells('E1:J1')
    ws.mergeCells('E2:J2')

    res.set('Content-Disposition', 'attachment; filename=' + req.query.filename)
    res.set(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    return wb.xlsx.write(res).then(function () {
      if (wb.worksheets.length == 0) console.log('Data is Empty !!')
      else console.log('successFully Created: ' + req.query.filename)
      res.status(200).end()
    })
  }) // wb.xlsx.readFile
}

//==================================================
async function dulieuHoaDon(req, res, ctitle) {
  //==================================================
  //testRunEnv( req, res);  // test ONCLY
  // 2 dòng dưới Đã chạy rồi
  //req.query.fromtodate = JSON.parse(req.query.fromtodate);
  //req.query.company = JSON.parse(req.query.company);

  //paternOptions: [10,11,20,21]: 1-Vào 2-Ra (0-1: có thuế hoặc không)
  sort = 'thuesuat'
  var query = `CALL getHoadon(?,?,?,?,?)`
  //SET @p0='2020-01-01'; SET @p1='2020-03-31'; SET @p2='10'; SET @p3='thuesuat'; SET @p4=''; CALL `getHoadon`(@p0, @p1, @p2, @p3, @p4);

  var params = [
    req.query.fromtodate.pd_fromdate,
    req.query.fromtodate.pd_todate,
    req.query.patern,
    sort,
    '',
  ]
  var template = 'public/download/TM-BCKT-TEMPLATE.xlsx'
  let cdps = await runQuerySync(query, params, req, res) //function (cdps) {
  const wb_tpl = new Excel.Workbook()
  wb_tpl.xlsx.readFile(template).then(function () {
    const ws_tpl = wb_tpl.getWorksheet('BangKeBanRa')
    const wb = new Excel.Workbook()
    wb.creator = 'Trần Văn Nghĩa'
    let ws = wb.addWorksheet()
    ws.model = ws_tpl.model
    ws.name = 'Dữ liệu Hóa đơn'
    var nbegin = 22,
      sott = nbegin,
      rowPlus = 0,
      lerror = 0,
      stt = 0,
      stt0 = 0,
      stt5 = 0,
      stt10 = 0,
      zgiaban = 0,
      zthue = 0 // Dòng dữ liệu đầu tiên
    ws.getCell('C17:D18').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' },
    }
    ws.getCell('E7').value = ctitle
    ws.getCell('F10').value = getfromtodate(
      req.query.fromtodate.pd_fromdate,
      req.query.fromtodate.pd_todate,
    )
    ws.getCell('E12').value = req.query.company.company
    ws.getCell('E13').value = req.query.company.masothue
    ws.mergeCells('E3:G3')
    ws.mergeCells('E4:G4')
    ws.mergeCells('E6:G6')
    ws.mergeCells('E7:G7')
    ws.mergeCells('H3:I3')
    ws.mergeCells('H15:I15')
    ws.mergeCells('B17:B19')
    ws.mergeCells('C17:D18')
    ws.mergeCells('E17:E19')
    ws.mergeCells('F17:F19')
    ws.mergeCells('G17:G19')
    ws.mergeCells('H17:H19')
    ws.mergeCells('I17:I19')
    ws.mergeCells('B21:I21')
    ws.getCell('B21:I21').border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    }
    ws.getCell('B24:I24').border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    }
    ws.getCell('B27:I27').border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    }
    ws.getCell('B30:I30').border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    }

    cdps[0].forEach((kq, index) => {
      kq.thuesuat = kq.thuesuat.trim()
      if ('0% 5% 10%'.includes(kq.thuesuat)) {
        switch (kq.thuesuat) {
          case '10%':
            rowPlus = 9
            stt10++
            break
          case '5%':
            rowPlus = 6
            stt5++
            break
          case '0%':
            rowPlus = 3
            stt0++
            break
          default:
            rowPlus = 0
            stt++
            break
        }
        ws.duplicateRow(sott + rowPlus, 1, true)
        ws.getCell('B' + (sott + rowPlus)).value = index + 1
        ws.getCell('C' + (sott + rowPlus)).value = kq.sohd
        ws.getCell('D' + (sott + rowPlus)).value = moment(kq.ngay).format(
          'DD-MM-YYYY',
        )
        ws.getCell('E' + (sott + rowPlus)).value = kq.company
        ws.getCell('F' + (sott + rowPlus)).value = kq.maso
        ws.getCell('G' + (sott + rowPlus)).value = kq.sotien
        ws.getCell('H' + (sott + rowPlus)).value = kq.thuegtgt
        ws.getCell('I' + (sott + rowPlus)).value =
          kq.soct + ' - ' + moment(kq.ngayct).format('DD/MM')
        //ws.getCell('I'+(sott + rowPlus)).value = kq.soct+" - "+ kq.thuesuat;
        zgiaban = zgiaban + kq.sotien
        zthue = zthue + kq.thuegtgt
        sott++
      } else {
        if (lerror == 0) {
          ws.getCell('J19').value = '* Lãi suất không hợp lệ'
          ws.getColumn('J').width = 15
          ws.getCell('J19').font = { color: { argb: 'FF0A0A' } }
          ws.mergeCells('J19:K19')
          //let ws2 = wb.addWorksheet('LS không hợp lệ'); ws2.model = ws_tpl.model;
        }
        ws.getCell('J' + (22 + lerror)).value =
          ' * ' + kq.soct + ' - ' + moment(kq.ngayct).format('DD/MM')
        ws.getCell('K' + (22 + lerror)).value = kq.thuesuat
        ws.getCell('K' + (22 + lerror)).alignment = {
          vertical: 'center',
          horizontal: 'right',
        }
        lerror++
      }
    }) // cdps[0].forEach
    //console.log(111,stt,stt0,stt5,stt10);
    ws.getCell('G' + (nbegin + stt + 1)).value = {
      formula: 'SUM(G' + nbegin + ':G' + (nbegin + stt) + ')',
    }
    ws.getCell('H' + (nbegin + stt + 1)).value = {
      formula: 'SUM(H' + nbegin + ':H' + (nbegin + stt) + ')',
    }
    ws.mergeCells('B' + (nbegin + stt + 2) + ':I' + (nbegin + stt + 2))
    nbegin = nbegin + stt

    ws.getCell('G' + (nbegin + stt0 + 4)).value = {
      formula: 'SUM(G' + (nbegin + 3) + ':G' + (nbegin + stt0 + 3) + ')',
    }
    ws.getCell('H' + (nbegin + stt0 + 4)).value = {
      formula: 'SUM(H' + (nbegin + 3) + ':H' + (nbegin + stt0 + 3) + ')',
    }
    ws.mergeCells('B' + (nbegin + stt0 + 5) + ':I' + (nbegin + stt0 + 5))
    nbegin = nbegin + stt0

    ws.getCell('G' + (nbegin + stt5 + 7)).value = {
      formula: 'SUM(G' + (nbegin + 6) + ':G' + (nbegin + stt5 + 6) + ')',
    }
    ws.getCell('H' + (nbegin + stt5 + 7)).value = {
      formula: 'SUM(H' + (nbegin + 6) + ':H' + (nbegin + stt5 + 6) + ')',
    }
    ws.mergeCells('B' + (nbegin + stt5 + 8) + ':I' + (nbegin + stt5 + 8))
    nbegin = nbegin + stt5

    ws.getCell('G' + (nbegin + stt10 + 10)).value = {
      formula: 'SUM(G' + (nbegin + 9) + ':G' + (nbegin + stt10 + 9) + ')',
    }
    ws.getCell('H' + (nbegin + stt10 + 10)).value = {
      formula: 'SUM(H' + (nbegin + 9) + ':H' + (nbegin + stt10 + 9) + ')',
    }
    //ws.mergeCells('B'+(nbegin+ stt10 +11)+':I'+(nbegin+ stt10 +11));

    ws.getCell('F' + (sott + 12)).value = zgiaban
    ws.getCell('F' + (sott + 13)).value = zthue

    res.set('Content-Disposition', 'attachment; filename=' + req.query.filename)
    res.set(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    return wb.xlsx.write(res).then(function () {
      if (wb.worksheets.length == 0) console.log('Data is Empty !!')
      else console.log('successFully Created: ' + req.query.filename)
      res.status(200).end()
    })
  }) // wb.xlsx.readFile
}
exports.thuegtgtXLSX = async function (req, res) {
  //==================================================
  //testRunEnv( req, res);  // test ONCLY
  req.query.fromtodate = JSON.parse(req.query.fromtodate)
  req.query.company = JSON.parse(req.query.company)
  //paternOptions: [10,11,20,21]: 1-Vào 2-Ra (0-1: có thuế hoặc không)

  var ctitle = '',
    sort = 'ngay' //THUẾ GIÁ TRỊ GIA TĂNG ĐẦU RA
  switch (true) {
    case req.query.patern.includes('10'):
      ctitle = 'DỮ LIỆU HÓA ĐƠN, CHỨNG TỪ HÀNG HOÁ, DỊCH VỤ MUA VÀO'
      return dulieuHoaDon(req, res, ctitle)
    case req.query.patern.includes('11'):
      ctitle = 'THUẾ HÓA ĐƠN ĐẦU VÀO'
      break
    case req.query.patern.includes('20'):
      ctitle = 'DỮ LIỆU HÓA ĐƠN, CHỨNG TỪ HÀNG HOÁ, DỊCH VỤ BÁN RA'
      return dulieuHoaDon(req, res, ctitle)
    case req.query.patern.includes('21'):
      ctitle = 'THUẾ HÓA ĐƠN ĐẦU RA'
      break
  }

  ctitle = 'BẢNG KÊ ' + ctitle
  sort = req.query.patern.includes('2') ? 'sohd' : 'ngay'
  var query = `CALL getHoadon(?,?,?,?,?)`
  var params = [
    req.query.fromtodate.pd_fromdate,
    req.query.fromtodate.pd_todate,
    req.query.patern,
    sort,
    '',
  ]
  var template = 'public/download/TM-BCKT-TEMPLATE.xlsx'
  let cdps = await runQuerySync(query, params, req, res) // function (cdps) {
  const wb_tpl = new Excel.Workbook()
  wb_tpl.xlsx.readFile(template).then(function () {
    const ws_tpl = wb_tpl.getWorksheet('Bảng kê Thuế gtgt')
    const wb = new Excel.Workbook()
    let ws = wb.addWorksheet()
    ws.model = ws_tpl.model
    var sott = 5,
      begin = sott // Dòng dữ liệu đầu tiên
    ws.getCell('E1').value = ctitle
    ws.getCell('E2').value = getfromtodate(
      req.query.fromtodate.pd_fromdate,
      req.query.fromtodate.pd_todate,
    )
    cdps[0].forEach((kq, index) => {
      if (true) {
        ws.duplicateRow(sott, 1, true)
        ws.getCell('B' + sott).value = index + 1
        ws.getCell('C' + sott).value = kq.sohd
        ws.getCell('D' + sott).value = moment(kq.ngay).format('DD-MM-YYYY')
        ws.getCell('E' + sott).value = kq.company
        ws.getCell('F' + sott).value = kq.maso
        ws.getCell('G' + sott).value = kq.address
        ws.getCell('H' + sott).value = kq.thuesuat
        ws.getCell('I' + sott).value = kq.sotien
        ws.getCell('J' + sott).value = kq.thuegtgt
        ws.getCell('K' + sott).value = kq.mathang
        ws.getCell('L' + sott).value = kq.tkno
        ws.getCell('M' + sott).value = kq.tkco
        ws.getCell('N' + sott).value = kq.soct
        ws.getCell('O' + sott).value = moment(kq.ngayct).format('DD-MM-YYYY')
        ;[
          'B' + sott,
          'C' + sott,
          'D' + sott,
          'E' + sott,
          'F' + sott,
          'G' + sott,
          'H' + sott,
          'I' + sott,
          'J' + sott,
          'K' + sott,
          'L' + sott,
          'M' + sott,
          'N' + sott,
          'O' + sott,
        ].map((key) => {
          // ws.getCell(key ).fill = {
          //     type: 'pattern',
          //     pattern:'solid',
          //     fgColor:{argb:'ebedef'}
          // };
          ws.getCell(key).border = {
            top: { style: 'hair' },
            left: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'hair' },
          }
        })
        //ws.getRow(sott).commit();
        sott++
      }
    }) // cdps[0].forEach
    const lastR = ws.rowCount
    ws.getCell('I' + lastR).value = {
      formula: 'SUM(I' + begin + ':I' + (lastR - 1) + ')',
    }
    ws.getCell('J' + lastR).value = {
      formula: 'SUM(J' + begin + ':J' + (lastR - 1) + ')',
    }
    ws.mergeCells('E1:L1')
    ws.mergeCells('E2:L2')

    res.set('Content-Disposition', 'attachment; filename=' + req.query.filename)
    res.set(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    return wb.xlsx.write(res).then(function () {
      if (wb.worksheets.length == 0) console.log('Data is Empty !!')
      else console.log('successFully Created: ' + req.query.filename)
      res.status(200).end()
    })
  }) // wb.xlsx.readFile
}

//============================  BackupDataBase
async function callBackupTable(req, res, cReturn) {
  let connect = choiceConnect()

  var params = typeof cReturn
  var tables = [],
    PHP_EOL = '\r\n',
    ncount = 0
  if (params == 'undefined') {
    cReturn = PHP_EOL
    cReturn += "SET sql_mode = '';" + PHP_EOL
    cReturn += 'START TRANSACTION;' + PHP_EOL
    cReturn += 'SET time_zone = "+00:00";' + PHP_EOL
    cReturn += 'SET foreign_key_checks = 0;' + PHP_EOL
    cReturn += PHP_EOL
    cReturn += PHP_EOL
  }

  let listtables = await runQuerySync(`SHOW TABLES`, '', req, res) // function (listtables) {
  listtables.forEach((kq, index) => {
    var key = 'kq.Tables_in_' + connect.database
    tables.push(eval(key))
  })
  //runQuerySync(`SELECT * FROM ${table}`,'', req, res,function(result){
  let allRows = await runQuerySync('CALL getRowsAllTables()', '', req, res) // function (allRows) {
  //runQuerySync(`SHOW COLUMNS FROM ${table}`,'', req, res,function(fields){
  let fields = await runQuerySync(
    'CALL getFieldsAllTables(?)',
    connect.database,
    req,
    res,
  )
  // function (fields) {
  let createtab = await runQuerySync(
    'CALL getShowCreateAllTables()',
    '',
    req,
    res,
  )
  // function (createtab) {
  //console.log(index,table,createtab.length)
  var result = new Promise((resolve, reject) => {
    tables.forEach(async (table, index, array) => {
      var row2 = ''
      for (var i = 0; i < createtab.length; i++) {
        if (createtab[i].length > 0 && createtab[i][0].Table == table) {
          var key = 'Create Table'
          row2 = createtab[i][0][`${key}`]
        }
      }
      var num_fields = 0,
        fieldnames = []
      for (var i = 0; i < fields[0].length; i++) {
        if (fields[0][i].TABLE_NAME == table) {
          num_fields++
          fieldnames.push(fields[0][i].COLUMN_NAME)
        }
      }
      //console.log(num_fields, fieldname);

      // cReturn+= PHP_EOL+`-- -------------------------` + PHP_EOL;
      cReturn += PHP_EOL + `DROP TABLE IF EXISTS ${table};` + PHP_EOL
      cReturn += PHP_EOL + row2 + ';' + PHP_EOL
      // cReturn+= PHP_EOL+ '-- Đang đổ dữ liệu cho bảng `'+table+'`' + PHP_EOL ;

      for (var i = 0; i < allRows.length - 1; i++) {
        //console.log(i+1,data[i].length)
        if (allRows[i].length > 0 && allRows[i][0].table_name == table) {
          cReturn += 'LOCK TABLES `' + table + '` WRITE;' + PHP_EOL
          for (var ro = 0; ro < allRows[i].length; ro++) {
            cReturn += 'INSERT INTO `' + table + '` VALUES('
            fieldnames.forEach((field, ind) => {
              var row = allRows[i][ro][field]
              //console.log(row ,typeof row )
              if (typeof row != 'undefined') {
                if (typeof row == 'string') row = row.addSlashes()
                if (
                  (typeof row == 'object') &
                  moment(row, 'YYYY-MM-DD', true).isValid()
                )
                  row = moment(row).format('YYYY-MM-DD')
                if (typeof row == 'string') row = row.replace('\n', '\\n')
                cReturn += '"' + row + '"'
              } else {
                cReturn += '""'
              }
              if (ind + 1 < num_fields) {
                cReturn += ','
              }
              //console.log(typeof row,table, rows)
            })
            cReturn += ');' + PHP_EOL
          }
          cReturn += 'UNLOCK TABLES;' + PHP_EOL
        }
      }
      //console.log(ncount)
      ncount++
      if (ncount === array.length) resolve(cReturn)
    })
  })
  result.then((sql) => {
    //console.log('All done!',kq);
    //process.exit()
    // Tên file name nằm trong zip , còn tên ngoài = this.infoketoan['filename'] = 'Backup-'+ connect.database +'.zip'
    if (params == 'undefined') {
      var filename = 'Table_' + connect.database + '_' + connect.user + '.sql'
    } else {
      var filename = connect.database + '_' + connect.user + '.sql'
    }
    // Nếu Call this.$apiAcn.download() thì filename set tại this.infoketoan['filename']
    sql += PHP_EOL + PHP_EOL // +'-- SuccessFully !! - Tổng số Bảng đã sao lưu : '+ listtables.length + PHP_EOL

    upToDropbox(sql, filename, req)

    setTimeout(function () {}, 30000)

    var zip = new JSZip()
    zip.file(filename, sql)
    if (typeof res != 'undefined') {
      res.setHeader('Content-Disposition', 'attachment; filename=' + filename)
      res.setHeader('Content-Type', 'application/zip')
      // res.send(sql);
      zip
        .generateNodeStream({
          type: 'nodebuffer',
          streamFiles: true,
          compression: 'DEFLATE',
        }) // Phải có compression: 'DEFLATE'
        .pipe(res)
        .on('finish', function () {
          console.log(
            'SuccessFully !! - getObject: ' + listtables.length,
            ',filename: ' + filename,
          )
        })
    } else {
      zip
        .generateNodeStream({
          type: 'nodebuffer',
          streamFiles: true,
          compression: 'DEFLATE',
        }) // Phải có compression: 'DEFLATE'
        .pipe(fs.createWriteStream('public/download/test.zip'))
        .on('finish', function () {
          console.log(
            1,
            'SuccessFully !! - getObject: ' + listtables.length,
            ',filename: ' + filename,
          )
        })
    }
  }) // var result
}

//========================================
exports.backupTable = async function (req, res) {
  callBackupTable(req, res)
}
//========================================
exports.backupData = async function (req, res) {
  let connect = choiceConnect()

  var procs = [],
    tables = [],
    PHP_EOL = '\r\n',
    cReturn = '',
    ncount = 0
  cReturn = PHP_EOL
  cReturn += "SET sql_mode = '';" + PHP_EOL
  cReturn += 'START TRANSACTION;' + PHP_EOL
  cReturn += 'SET time_zone = "+00:00";' + PHP_EOL
  cReturn += 'SET foreign_key_checks = 0;' + PHP_EOL
  cReturn += PHP_EOL
  // cReturn += "-- "+PHP_EOL;
  // cReturn += "-- Cơ sở dữ liệu: `"+ connect.database+"`"+PHP_EOL;
  // cReturn += "-- "+PHP_EOL;
  cReturn += PHP_EOL
  cReturn += 'DELIMITER $$' + PHP_EOL
  cReturn += PHP_EOL
  // cReturn += "--"+PHP_EOL;
  // cReturn += "-- Thủ tục"+PHP_EOL;
  // cReturn += "--"+PHP_EOL;
  cReturn += PHP_EOL
  // Sao lưu thủ tục ở đây
  var query = "CALL getShowCreateAllProcs('PROCEDURE')"
  procs = await runQuerySync(query, connect.database, req, res) //function (procs) {
  procs = await runQuerySync(query, connect.database, req, res) //function (procs) {
  var key = 'Create Procedure'
  for (var ro = 0; ro < procs.length - 1; ro++) {
    //console.log(ro+1, procs.length-1 ,procs[ro][0].Procedure  );
    if (typeof procs[ro][0].Procedure != 'undefined') {
      cReturn +=
        PHP_EOL +
        'DROP PROCEDURE IF EXISTS `' +
        procs[ro][0].Procedure +
        '`$$' +
        PHP_EOL
      cReturn += PHP_EOL + procs[ro][0][`${key}`] + '$$' + PHP_EOL
    }
  }
  //console.log('All done!',cReturn);
  // cReturn += "-- -------------------------------------"
  // cReturn += PHP_EOL + "-- SuccessFully !! - Tổng số Procedure đã sao lưu : "+ (procs.length-1)
  // cReturn += PHP_EOL + "-- -------------------------------------"
  // Sao lưu Function ở đây
  var query = "CALL getShowCreateAllProcs('FUNCTION')"
  procs = await runQuerySync(query, connect.database, req, res) //function (procs) {
  var key = 'Create Function'
  for (var ro = 0; ro < procs.length - 1; ro++) {
    //console.log(ro+1, procs.length-1 ,procs[ro][0].Procedure  );
    if (typeof procs[ro][0].Function != 'undefined') {
      cReturn +=
        PHP_EOL +
        'DROP FUNCTION IF EXISTS `' +
        procs[ro][0].Function +
        '`$$' +
        PHP_EOL
      cReturn += PHP_EOL + procs[ro][0][`${key}`] + '$$' + PHP_EOL
    }
  }
  //console.log('All done!',cReturn);
  cReturn += 'DELIMITER ;' + PHP_EOL
  // cReturn += "-- -------------------------------------"
  // cReturn += PHP_EOL + "-- SuccessFully !! - Tổng số Function đã sao lưu : "+ (procs.length-1)
  // cReturn += PHP_EOL + "-- -------------------------------------"
  callBackupTable(req, res, cReturn)
}
//===========================================
exports.restoreData = async function (req, res) {
  //===========================================
  let query =
    'SET FOREIGN_KEY_CHECKS=0; TRUNCATE `chitiet`; TRUNCATE `ctuvattu`; TRUNCATE `hoadon`; TRUNCATE `ctuktoan`; TRUNCATE `dmkhohag`; TRUNCATE `dmsodutk`; TRUNCATE `dmtkhoan`; TRUNCATE `dmtiente`; TRUNCATE `tenhang`; TRUNCATE `dmtenkho`; TRUNCATE `customer`; TRUNCATE `quanlykt`; TRUNCATE `dmsodutk`; TRUNCATE `dmkhohag`; SET FOREIGN_KEY_CHECKS=1; '
  await runQuerySync(query, [], '', '')

  let connect = choiceConnect()
  //const Importer = require('mysql-import');
  const Importer = require('../../data/connect/mysql-import')
  const importer = new Importer(connect)
  // New onProgress method, added in version 5.0!
  let total_bytes = 0
  importer.onProgress((progress) => {
    total_bytes = progress.total_bytes
    var percent =
      Math.floor((progress.bytes_processed / progress.total_bytes) * 10000) /
      100
    console.log(`${percent}% Completed`)
  })
  let params = JSON.parse(req.params.filedropbox)
  //var tokenDropbox = params.dropbox ? process.env._DROPBOX_TOKEN : process.env.DROPBOX_TOKEN;
  var tokenDropbox = process.env.DROPBOX_TOKEN
  // Nếu nhập đúng định dạng sẽ lấy file nhập : TABLE_*.zip (Lấy dữ liệu từ server hoặc công ty khác)
  // Ngược lại Có cho nhập toàn bộ hay không ? ( hiện tại cũng chỉ có TABLE)
  var filename_s =
    params.file.length > 4
      ? params.file
      : 'Table_' + connect.database + '_' + connect.user + '.zip'
  var filename_sql = filename_s.substr(0, filename_s.indexOf('.')) + '.sql'
  var filesql_tmp = './data/connect/template.zip'
  var options = {
    method: 'POST',
    url: 'https://content.dropboxapi.com/2/files/download',
    encoding: null, // <====---------- FILE ZIP PHẢI CÓ
    headers: {
      'Content-Type': 'application/octet-stream',
      Authorization: 'Bearer ' + tokenDropbox,
      'Dropbox-API-Arg': '{"path": "/' + filename_s + '"}',
    },
  }
  request(options, function (err, res2, body) {
    //let tmpfile = process.cwd()+'\\tmp\\'+filename_s;
    // let tmpfile = os.tmpdir()+'\\'+ Math.floor(Date.now() / 1000) + '_'+ filename_sql;
    if (err) return res.status(503).json({ success: false, error: err })
    JSZip.loadAsync(body, {})
      .then(function (zip) {
        return zip.file(filename_sql).async('string')
      })
      .then(function (sql) {
        // fs.writeFileSync("____TEST.js",sql)
        // let tmpfile = tempDir+'\\'+ Math.floor(Date.now() / 1000) + '_'+ filename_sql;
        let tmpfile = tmp.tmpNameSync() + '_' + filename_sql
        fs.writeFileSync(tmpfile, sql, 'utf8')
        if (fs.existsSync(tmpfile)) {
          filesql_tmp = tmpfile
          sql = ''
          console.log(
            1,
            'Token: ',
            tokenDropbox,
            'Download từ dropbox và phục hồi Dữ liệu file: ' + tmpfile,
          )
        } else console.log(1, 'Download from dropbox : ' + res2, '==> phục hồi Dữ liệu trực tiếp file: ' + filename_s)

        importer
          .import(sql, filesql_tmp)
          .then(() => {
            var files_imported = importer.getImported()
            let mess = `${files_imported.length} SQL file(s): ${total_bytes} bytes imported.`
            console.log(mess)
            res
              .status(200)
              .json({ success: true, message: mess, filename: filename_s })
              .end()
          })
          .catch((err) => {
            console.error(err)
            res.status(503).json({ success: false, error: err })
          })
      })
      .catch((err) => {
        console.error(err)
        res.status(503).json({ success: false, error: err })
      })
  })
}
//========================================
exports.getenv = async function (req, res) {
  let connect = choiceConnect()
  let evalEnv = null
  try {
    evalEnv = eval(req.params.env)
  } catch (err) {}

  console.log('Database đang dùng: ', connect.database, req.params.env)
  res.status(200).json({
    success: true,
    message: 'Trả về biến môi trường',
    getvar: req.params.env,
    value_is: evalEnv || null,
    connect_config: connect,
  })
}
//========================================
function zipTest() {
  var fs = require('fs')
  var JSZip = require('jszip')
  var zip = new JSZip()
  // Add a top-level, arbitrary text file with contents
  zip.file('Hello.txt', 'Hello World\n')
  // Create a directory within the Zip file structure
  var img = zip.folder('images')
  // Sample image data
  imgData =
    'R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7'
  // Add a file to the 'images' directory,
  // and add an image with data URI as contents.
  img.file('star.gif', imgData, { base64: true })
  // JSZip can generate Buffers so you can do the following
  zip
    .generateNodeStream({
      type: 'nodebuffer',
      streamFiles: true,
      compression: 'DEFLATE',
    }) // Phải có compression: 'DEFLATE'
    .pipe(fs.createWriteStream('public/download/test.zip'))
    .on('finish', function () {
      // JSZip generates a readable stream with a "end" event,
      // but is piped here in a writable stream which emits a "finish" event.
      console.log('out.zip written.')
    })
}
//========================================
function upToDropbox(buffer, filename, req) {
  // var options = {
  //     method: "POST",
  //     url: 'https://content.dropboxapi.com/2/files/upload',
  //     headers: {
  //       "Content-Type": "application/octet-stream",
  //       "Authorization": "Bearer " + process.env.DROPBOX_TOKEN,
  //       "Dropbox-API-Arg": "{\"path\": \"/"+filename+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}",
  //     },
  //     body:buffer
  // };
  // request(options,function(err, res, body){
  //   console.log("Err : " + err ,"res : " + res);
  // })
  // ============== BÊN TRÊN TẠO UP FILE ---KHÔNG ZIP
  //============== BÊN DƯỚI TẠO UP FILE ---ZIP
  try {
    req.query.settings = JSON.parse(req.query.settings)
  } catch (error) {
    // localStorage.clear()
    console.error('reset var setting for error:', error)
  }
  //var tokenDropbox = req.query.settings.Dropbox ? process.env._DROPBOX_TOKEN : process.env.DROPBOX_TOKEN
  var tokenDropbox = process.env.DROPBOX_TOKEN
  var zipfilename = filename.substr(0, filename.indexOf('.')) + '.zip'
  var zip = new JSZip()
  zip.file(filename, buffer)
  zip
    .generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }) // compression: 'DEFLATE'  LÀ  ZIP
    .then(function (buffer) {
      var options = {
        method: 'POST',
        url: 'https://content.dropboxapi.com/2/files/upload',
        headers: {
          'Content-Type': 'application/octet-stream',
          Authorization: 'Bearer ' + tokenDropbox,
          'Dropbox-API-Arg':
            '{"path": "/' +
            zipfilename +
            '","mode": "overwrite","autorename": true,"mute": false}',
        },
        body: buffer,
      }

      request(options, function (err, res, body) {
        console.log('Err : ' + err, 'token : ' + tokenDropbox, 'body : ' + body)
      })
    })
    .catch((err) => {
      console.error(err)
    })
}
//==================================================
function testRunEnv(req, res) {
  // Chỉ dành cho TEST local
  // ================ Test Môi trường chạy
  if (new RegExp(/\?.+=.*/g).test(req.url)) {
    req.query.fromtodate = JSON.parse(req.query.fromtodate)
    req.query.company = JSON.parse(req.query.company)
  } else {
    req.query = req.body
  } // For requests.rest
  // ================ Test Môi trường chạy
}
//==================================================
exports.dmketoanXLSX = async function (req, res) {
  //==================================================
  testRunEnv(req, res)
  //req.query = req.body;   // For requests.rest
  // req.query.fromtodate = JSON.parse(req.query.fromtodate);
  // req.query.company = JSON.parse(req.query.company);
  // ================ For App ( Tắt dòng dưới --> Mở 2 dòng trên & Ngược lại)
  const { filename, sheetname, urlget, fields, sumcolumn } = req.query
  var template = 'public/download/TM-BCKT-TEMPLATE.xlsx'
  const token = req.headers['x-access-token'] || req.headers['authorization']
  axios.defaults.headers.common['Authorization'] = token
  axios.get(process.env.APP_URL + '/api/' + urlget).then((response) => {
    const wb_tpl = new Excel.Workbook()
    wb_tpl.xlsx.readFile(template).then(function () {
      const ws_tpl = wb_tpl.getWorksheet(sheetname)
      const wb = new Excel.Workbook()
      let ws = wb.addWorksheet()
      ws.model = ws_tpl.model
      var sott = 5,
        begin = sott // Dòng dữ liệu đầu tiên
      ws.getCell('D2').value = moment(new Date()).format('DD/MM/YYYY')
      response.data[urlget].forEach((kq, index) => {
        ws.duplicateRow(sott, 1, true)
        ws.getCell('B' + sott).value = index + 1
        for (var key = 0; key < fields.length; key++) {
          //console.log(String.fromCharCode(key+ 66)+sott )
          ws.getCell(String.fromCharCode(key + 67) + sott).value =
            kq[fields[key]]
          ws.getCell(String.fromCharCode(key + 67) + sott).border = {
            top: { style: 'hair' },
            left: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'hair' },
          }
        }
        sott++
      }) // cdps[0].forEach
      const lastR = ws.rowCount
      if (sumcolumn == 1) {
        ws.getCell('E' + lastR).value = {
          formula: 'SUM(E' + begin + ':E' + (lastR - 1) + ')',
        }
        ws.getCell('F' + lastR).value = {
          formula: 'SUM(F' + begin + ':F' + (lastR - 1) + ')',
        }
      }
      ws.mergeCells('D1:F1')
      ws.mergeCells('D2:F2')
      res.set('Content-Disposition', 'attachment; filename=' + filename)
      res.set(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
      return wb.xlsx.write(res).then(function () {
        if (wb.worksheets.length == 0) console.log('Data is Empty !!')
        else console.log('successFully Created : ' + filename)
        res.status(200).end()
      })
    }) // wb.xlsx.readFile
  }) // runQuerySync
}

//===========================================
//===========================================
function number_to_words(number) {
  var hyphen = ' '
  var conjunction = '  '
  var separator = ' '
  var negative = 'âm '
  var decimal = ' phẩy '
  var dictionary = []
  dictionary[0] = 'không'
  dictionary[1] = 'một'
  dictionary[2] = 'hai'
  dictionary[3] = 'ba'
  dictionary[4] = 'bốn'
  dictionary[5] = 'năm'
  dictionary[6] = 'sáu'
  dictionary[7] = 'bảy'
  dictionary[8] = 'tám'
  dictionary[9] = 'chín'
  dictionary[10] = 'mười'
  dictionary[11] = 'mười một'
  dictionary[12] = 'mười hai'
  dictionary[13] = 'mười ba'
  dictionary[14] = 'mười bốn'
  dictionary[15] = 'mười năm'
  dictionary[16] = 'mười sáu'
  dictionary[17] = 'mười bảy'
  dictionary[18] = 'mười tám'
  dictionary[19] = 'mười chín'
  dictionary[20] = 'hai mươi'
  dictionary[30] = 'ba mươi'
  dictionary[40] = 'bốn mươi'
  dictionary[50] = 'năm mươi'
  dictionary[60] = 'sáu mươi'
  dictionary[70] = 'bảy mươi'
  dictionary[80] = 'tám mươi'
  dictionary[90] = 'chín mươi'
  dictionary[100] = 'trăm'
  dictionary[1000] = 'ngàn'
  dictionary[1000000] = 'triệu'
  dictionary[1000000000] = 'tỷ'
  dictionary[1000000000000] = 'nghìn tỷ'
  dictionary[1000000000000000] = 'ngàn triệu triệu'
  dictionary[1000000000000000000] = 'tỷ tỷ'

  if (isNaN(number - parseFloat(number))) return false
  // if( (number >= 0 && parseInt(number) < 0) || (int)number < 0 - PHP_INT_MAX )
  // {
  //     // overflow
  //     trigger_error( 'number_to_words only accepts numbers between -' . PHP_INT_MAX . ' and ' . PHP_INT_MAX, E_USER_WARNING );
  //     return false;
  // }
  number = typeof number == 'number' ? number + '' : number
  if (number < 0) {
    return negative + number_to_words(Math.abs(number))
  }

  var string = null,
    fraction = null
  if (number.indexOf('.') > 0) {
    // Số lẻ
    fraction = number.substr(number.indexOf('.') + 1)
    number = number.substr(0, number.indexOf('.'))
  }

  switch (true) {
    case number < 21:
      string = dictionary[number]
      break
    case number < 100:
      var tens = parseInt(number / 10) * 10
      var units = number % 10
      string = dictionary[tens]
      if (units) {
        string += hyphen + dictionary[units]
      }
      break
    case number < 1000:
      var hundreds = parseInt(number / 100)
      var remainder = number % 100 // Mod() lấy số lẻ
      string = dictionary[hundreds] + ' ' + dictionary[100]
      if (remainder) string += conjunction + number_to_words(remainder)
      break
    default:
      // $baseUnit = pow( 1000, floor( log( $number, 1000 ) ) );
      // $numBaseUnits = (int)($number / $baseUnit);
      var baseUnit = Math.pow(
        1000,
        Math.floor(Math.log(number) / Math.log(1000)),
      )
      var numBaseUnits = parseInt(number / baseUnit)
      var remainder = number % baseUnit
      string = number_to_words(numBaseUnits) + ' ' + dictionary[baseUnit]
      if (remainder) {
        string += remainder < 100 ? conjunction : separator
        string += number_to_words(remainder)
      }
      break
  }

  if (null !== fraction && !isNaN(fraction - parseFloat(fraction))) {
    // Không null và là số
    string += decimal
    words = []
    fraction.split('').forEach((kq, index) => {
      words.push(dictionary[kq * 1])
    })
    string += words.join(' ')
  }
  return string
}
//===========================================
function vn_dong(number) {
  number = typeof number == 'number' ? number + '' : number
  var nlen = number.length,
    string = ''
  if (number.indexOf('.') > 0)
    nlen = number.substr(0, number.indexOf('.')).length // Trừ Số lẻ
  if (nlen > 18) {
    return '***'
  }
  if (nlen > 9) {
    var aa = number.substr(0, nlen - 9)
    var bb = number.substr(-9)
    string = number_to_words(aa) + ' tỷ ' + number_to_words(bb)
  } else string = number_to_words(number)

  string = string.split('  ').join(' ') // Xóa 2 space thành 1
  string = string.substr(0, 1).toUpperCase() + string.slice(1) + ' đồng'
  return string
}
//===========================================
//===========================================
exports.getVnDong = async function (req, res) {
  return res.status(200).json({
    success: true,
    message: 'getvnd/:num thàng công ...',
    getVnDong: vn_dong(req.params.num),
  })
}
//===========================================
exports.getCtuktoans = async function (req, res) {
  testRunEnv(req, res)
  //console.log(req.query.ctid, req.query.ctid == true)
  let ctkt = await runQuerySync(
    `CALL Create_Ctuketoan2(?,?,?)`,
    [
      req.query.fromtodate.pd_fromdate,
      req.query.fromtodate.pd_todate,
      req.query.ctid,
    ],
    req,
    res,
  )
  // function (ctkt) {
  var ret = []
  if (ctkt && ctkt[0].length > 0) {
    ret = ctkt[0]
    ctkt[0].forEach((kq, index) => {
      kq.sotienvn = vn_dong(kq.sotienkt)
    })
  }
  return res.status(200).json({
    success: true,
    message: 'getCtuktoan thàng công ...',
    getCtuktoan: ret,
  })
  //},
  //)
}
//===========================================
//===========================================
exports.getCtuvattus = async function (req, res) {
  testRunEnv(req, res)
  //console.log(req.query.ctid, req.query.ctid == true)
  let ctkt = await runQuerySync(
    `CALL Create_Ctuvattu2(?,?,?)`,
    [
      req.query.fromtodate.pd_fromdate,
      req.query.fromtodate.pd_todate,
      req.query.ctid,
    ],
    req,
    res,
  )
  // function (ctkt) {
  var ret = []
  //console.log(req.query,ctkt[0]);
  if (ctkt && ctkt[0].length > 0) {
    ret = ctkt[0]
    ctkt[0].forEach((kq, index) => {
      kq.sotienvn = vn_dong(kq.sotienkt)
    })
  }
  return res.status(200).json({
    success: true,
    message: 'getCtuvattu thàng công !!...',
    getCtuvattu: ret,
  })
  //},
  //)
}
//===========================================
exports.tatoansodutk = async function (req, res) {
  tatoansodutkSync(req, res)
}
async function tatoansodutkSync(req, res) {
  console.log('Begin...')
  var pd_fromdate = req.body.fromtodate.pd_fromdate
  var pd_todate = req.body.fromtodate.pd_todate
  var vn_todate = moment(pd_todate).format('DD-MM-YYYY')
  var cTK_PB1 = '621,622,623,627,' //nhóm TK phân bổ 1
  var cTK_PB2 = '632,635,641,642,811,821,' //nhóm TK phân bổ 2
  var cTK_PB3 = '511,515,512,711,721,' //nhóm TK phân bổ 3
  var dmtk154 = '',
    dmtk911 = '',
    dmtk421 = '',
    tk154 = '',
    tk911 = '',
    tk421 = ''
  var namnay = pd_fromdate.substr(0, 4)
  var ctID = pd_todate.replace('-', '').replace('-', '')
  var query = `Select sotk,tentk FROM dmtkhoan`
  var dmtk = await runQuerySync(query, [], req, res)
  for (var k = 0; k < dmtk.length; k++) {
    if (dmtk[k].sotk.substr(0, 3) == '154' && !dmtk154) tk154 = dmtk[k].sotk
    if (dmtk[k].sotk.substr(0, 3) == '911' && !dmtk911) tk911 = dmtk[k].sotk
    if (dmtk[k].sotk.substr(0, 4) == '4212' && !dmtk421) tk421 = dmtk[k].sotk
    if (dmtk[k].sotk.substr(0, 3) == '154') dmtk154 += dmtk[k].sotk + ','
    if (dmtk[k].sotk.substr(0, 3) == '911') dmtk911 += dmtk[k].sotk + ','
    if (dmtk[k].sotk.substr(0, 4) == '4212') dmtk421 += dmtk[k].sotk + ','
  }
  if (!tk154 || !tk911 || !tk421)
    return console.log(
      'Danh mục không có tài khoản 154 ,4212 hoặc 911. Chương trình kết thúc !!',
    )
  await runQuerySync(
    `CALL TinhCanDoiTaiKhoan2(?,?,?)`,
    [pd_fromdate, pd_todate, ''],
    req,
    res,
  )
  query =
    "select sotk, SUM(nock) as nock, SUM(cock) as cock from `dmsodutk` where LEFT(SOTK,1) >= '5' and `nam` = " +
    namnay +
    ' group by `sotk`, `nock`, `cock` having nock <> 0 OR cock <> 0 order by `sotk` asc'
  var dmsodutk = await runQuerySync(query, [], req, res)
  query = "SELECT ctid FROM ctuktoan WHERE ctid= '" + ctID + "'"
  var ctuktoan = await runQuerySync(query, [], req, res)
  //===== Tạo chứng từ kế chuyển - Nếu chưa có
  if (ctuktoan.length == 0) {
    ctuktoan['ctid'] = ctID
    ctuktoan['soct'] = 'KC' + vn_todate.substr(0, 5)
    ctuktoan['ngay'] = pd_todate
    ctuktoan['diengiai'] = 'Kết chuyển : ' + vn_todate.substr(3, 7)
    ctuktoan['tkno'] = tk911
    ctuktoan['tkco'] = tk421
    ctuktoan['sotien'] = '0'
    query =
      'INSERT INTO ctuktoan (soct, ngay, diengiai, tkno, tkco, sotien,ngaytt,ngaytra,loaitien,ngoaite,userid,matkno,matkco,hopdong,nhom,ghichu,khac,sodk,mamauhd,ctid)  VALUES ("' +
      ctuktoan['soct'] +
      '","' +
      ctuktoan['ngay'] +
      '","' +
      ctuktoan['diengiai'] +
      '","' +
      ctuktoan['tkno'] +
      '","' +
      ctuktoan['tkco'] +
      '", ' +
      ctuktoan['sotien'] +
      ',"0001-01-01","0001-01-01","001",0,0,"","","","","","","","","' +
      ctuktoan['ctid'] +
      '")'
    await runQuerySync(query, [], req, res)
  }
  // Bắt đầu kết chuyển
  var sotien,
    tkphanbo,
    sotk1,
    sotk2,
    lentkphbo,
    str,
    lenstr,
    congtien911 = 0,
    ncount = 0
  var result = new Promise((resolve, reject) => {
    if (dmsodutk.length == 0) resolve(congtien911)
    dmsodutk.forEach(async (kq, index) => {
      sotien = kq.nock - kq.cock
      if (cTK_PB1.includes(kq.sotk.substr(0, 3))) {
        tkphanbo = tk154
      } else {
        tkphanbo = tk911
        congtien911 = congtien911 + sotien
      }
      sotk1 = 'tkno'
      sotk2 = 'tkco' // Dư nợ sẽ ghi Nợ TK Phân bổ 154 or 911 (Ngược lại)
      if (sotien < 0) {
        sotien = -sotien
        sotk1 = 'tkco'
        sotk2 = 'tkno'
      }
      if (tkphanbo != kq.sotk) {
        var data = [],
          tmpsotk = ''
        data['sotien'] = sotien
        data[sotk1] = tkphanbo
        data[sotk2] = kq.sotk
        lentkphbo = tkphanbo.trim().length
        str = kq.sotk.substr(lentkphbo).trim()
        lenstr = str.length
        for (let i = lenstr; i > 0; i--) {
          // Tìm 154xxx trùng 62Xxxx
          tmpsotk = tkphanbo + str.substr(0, i)
          if ((dmtk154 + '??' + dmtk911).includes(tmpsotk)) {
            data[sotk1] = tmpsotk
            break
          }
        }
        //console.log(1,kq.sotk,kq.nock,kq.cock,data['tkno'],data['tkco'])
        var query =
          "SELECT ctid FROM chitiet WHERE ctid = '" +
          ctID +
          "' AND tkno = '" +
          data['tkno'] +
          "' AND tkco = '" +
          data['tkco'] +
          "'"
        var ctiet = await runQuerySync(query, [], req, res)
        var chitiet = []
        chitiet['ctid'] = ctID
        chitiet['diengiai'] = 'Kết chuyển : ' + vn_todate.substr(3, 7)
        chitiet['tkno'] = data['tkno']
        chitiet['tkco'] = data['tkco']
        chitiet['sotien'] = data['sotien']
        if (ctiet.length > 0) {
          query =
            'UPDATE chitiet SET sotien = sotien +' +
            chitiet['sotien'] +
            " WHERE ctid = '" +
            ctID +
            "' AND tkno = '" +
            chitiet['tkno'] +
            "' AND tkco = '" +
            chitiet['tkco'] +
            "'"
          await runQuerySync(query, [], req, res)
        } else {
          query =
            'INSERT INTO chitiet (`id`, `ctid`, `diengiai`, `tkno`, `tkco`, `sotien`,`matkno`,`matkco`,`ngoaite`,`ctkhac`) ' +
            'VALUES (null,"' +
            chitiet['ctid'] +
            '","' +
            chitiet['diengiai'] +
            '","' +
            chitiet['tkno'] +
            '","' +
            chitiet['tkco'] +
            '","' +
            chitiet['sotien'] +
            '","","",0,"" )'
          await runQuerySync(query, [], req, res)
        }
      }
      index++
      console.log(
        index,
        dmsodutk.length,
        kq.sotk,
        kq.nock,
        kq.cock,
        congtien911,
      )
      if (index === dmsodutk.length) resolve(congtien911)
    }) // dmsodutk.forEach
  }) // result = new Promise
  result.then(async (congtien911) => {
    if (congtien911 != 0) {
      var chitiet = []
      chitiet['ctid'] = ctID
      chitiet['diengiai'] = 'Kết chuyển : ' + vn_todate.substr(3, 7)
      chitiet['tkno'] = tk421
      chitiet['tkco'] = tk911
      chitiet['sotien'] = congtien911
      if (congtien911 < 0) {
        chitiet['sotien'] = -congtien911
        chitiet['tkco'] = tk421
        chitiet['tkno'] = tk911
      }

      query =
        "SELECT ctid FROM chitiet WHERE ctid = '" +
        ctID +
        "' AND tkno = '" +
        chitiet['tkno'] +
        "' AND tkco = '" +
        chitiet['tkco'] +
        "'"
      var ctiet = await runQuerySync(query, [], req, res)
      if (ctiet.length > 0) {
        query =
          'UPDATE chitiet SET sotien = sotien +' +
          chitiet['sotien'] +
          " WHERE ctid = '" +
          ctID +
          "' AND tkno = '" +
          chitiet['tkno'] +
          "' AND tkco = '" +
          chitiet['tkco'] +
          "'"
        await runQuerySync(query, [], req, res)
      } else {
        query =
          'INSERT INTO chitiet (`id`, `ctid`, `diengiai`, `tkno`, `tkco`, `sotien`,`matkno`,`matkco`,`ngoaite`,`ctkhac`) ' +
          'VALUES (null,"' +
          chitiet['ctid'] +
          '","' +
          chitiet['diengiai'] +
          '","' +
          chitiet['tkno'] +
          '","' +
          chitiet['tkco'] +
          '","' +
          chitiet['sotien'] +
          '","","",0,"" )'
        await runQuerySync(query, [], req, res)
      }
      console.log(dmsodutk.length + 1)
    }

    var querySotien =
      "(SELECT SUM(sotien) as sotien FROM chitiet WHERE ctid = '" + ctID + "')"
    query =
      'UPDATE ctuktoan SET sotien = ' +
      querySotien +
      " WHERE ctid = '" +
      ctID +
      "'"
    await runQuerySync(query, [], req, res)
    console.log('Kết chuyển thành công :' + congtien911)
    return res.status(200).json({
      success: true,
      message: 'Tất toán số dư... Thành công !! ',
      ctid: ctID,
      linedetail: dmsodutk.length,
      congtien: congtien911,
    })
  }) // result.then(
}

//===========================================
exports.getInhoadon = async function (req, res) {
  testRunEnv(req, res)
  let ctkt = await runQuerySync(
    `CALL getHoadon(?,?,?,?,?)`,
    [
      req.query.fromtodate.pd_fromdate,
      req.query.fromtodate.pd_todate,
      '20',
      'sohd',
      req.query.ctid,
    ],
    req,
    res,
  )
  // function (ctkt) {
  var ret = []
  //console.log(1,ctkt[0].length);
  if (ctkt && ctkt[0].length > 0) {
    ret = ctkt[0]
    ctkt[0].forEach((kq, index) => {
      kq.congtienvn = vn_dong(kq.congtienvn)
    })
  }
  let ctvt = await runQuerySync(
    `CALL Create_MathangBan(?,?,?)`,
    [
      req.query.fromtodate.pd_fromdate,
      req.query.fromtodate.pd_todate,
      req.query.ctid,
    ],
    req,
    res,
  )
  // function (ctvt) {
  var ret = []
  if (ctvt && ctvt[0].length > 0) {
    return res.status(200).json({
      success: true,
      message: 'getInHoadon thàng công ...',
      getHoadon: ctkt[0],
      getMathang: ctvt[0],
    })
  } else {
    return res.status(200).json({
      success: false,
      message: 'getInHoadon KHÔNG thàng công ...',
      getHoadon: [],
      getMathang: [],
    })
  }
  //},
  //)
  //},
  //)
}
//===========================================
function deleteAllFile(directory, deldir) {
  //===========================================
  //const directory = 'public/download/down-temp';
  var directory = path.join(__dirname, directory)
  fs.readdir(directory, (err, files) => {
    if (err) throw err
    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err
      })
    }
    if (deldir) {
      fs.rmdir(directory, function (err) {
        if (err) throw err
      })
    }
  })
}
//===========================================
function getAllfiles() {
  //===========================================
  const path = require('path')
  const fs = require('fs')
  const log = console.log
  const folder = './'

  fs.readdirSync(folder).forEach((file) => {
    const extname = path.extname(file)
    const filename = path.basename(file, extname)
    const absolutePath = path.resolve(folder, file)
    log(1, absolutePath, file, filename, extname)
  })
}
//===========================================
//=========================================== Trần Văn Nghĩa
exports.test = async function (req, res) {
  let mess = 'Dùng cho test khác - api/testdb thì có sẵn trong main-api.js'
  const ctkt = await runQuerySyncOld(`SELECT * FROM ctuktoan LIMIT 1`)
  const ctktP = await runQuerySync(`SELECT * FROM ctuktoan LIMIT 1`)
  res.status(200).json({ message: mess, ctkt: ctkt, ctktPool: ctktP }).end()
}
//==================================================
exports.sendmail = async function (req, res) {
  console.log(
    process.env.MAIL_USERNAME,
    process.env.MAIL_PASSWORD,
    req.body.mailto,
    req.body.html,
  )

  var nodemailer = require('nodemailer')
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  })

  var mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: req.body.mailto,
    subject: req.body.subject,
    text: req.body.html,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      res.status(500).json({ message: error.message }).end()
    } else {
      console.log('Email sent: ' + info.response)
      res.status(200).json({ message: info.response }).end()
    }
  })
}

//================================================== Trần Văn Nghĩa
exports.uynhiemchi = async function (req, res) {
  var unc = req.query //JSON.parse(req.query);
  var template = 'public/download/' + unc.filename
  const wb_tpl = new Excel.Workbook()
  wb_tpl.xlsx
    .readFile(template)
    .then(function () {
      const ws_tpl = wb_tpl.getWorksheet('unc')
      const wb = new Excel.Workbook()
      let ws = wb.addWorksheet()
      ws.model = ws_tpl.model
      ws.getCell('C3').value =
        'Ngày (Date): ' + moment(unc.ngay).format('DD-MM-YYYY')
      ws.getCell('C5').value = unc.sotk
      ws.getCell('C6').value = unc.tentk
      ws.getCell('C7').value = unc.address
      ws.getCell('C8').value = unc.bank
      ws.getCell('C10').value = unc.sotk2
      ws.getCell('C11').value = unc.tentk2
      ws.getCell('C12').value = unc.address2
      ws.getCell('C13').value = unc.bank2
      ws.getCell('F5').value = unc.sotien * 1
      //ws.getCell('F5').numFmt = '�#,##0;[Red]-�#,##0';
      ws.getCell('E7').value = vn_dong(unc.sotien) + ' ./.'
      ws.getCell('E10').value = unc.noidung
      ws.mergeCells('C2:H2')
      ws.mergeCells('F12:I12')
      ws.getCell('F12:I12').border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
      }
      ws.mergeCells('E7:I8')
      ws.getCell('E7:I8').border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      }
      ws.mergeCells('E10:I11')
      ws.getCell('E10:I11').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      }

      res.set('Content-Disposition', 'attachment; filename=' + unc.filename) // Phải có para filename
      res.set(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
      return wb.xlsx.write(res).then(function () {
        if (wb.worksheets.length == 0) console.log('Data is Empty !!')
        else console.log('successFully !!')
        res.status(200).end()
      })
    })
    .catch((error) => {
      var mess = 'ERROR readFile : ' + template
      console.log(mess)
      res.status(500).json({ success: false, message: mess, error: error })
    })
}

//=================================== Trần Văn Nghĩa
exports.invoice = async function (req, res) {
  //req.query = JSON.parse(req.query)
  req.body = req.query
  // Quan trọng khi dùng  this.$apiAcn.download()
  // res.status(200).json({ message: 'Không có phát sinh Hóa đơn trong kỳ...' })

  switch (req.body.procedure) {
    case 'getListInvoice':
      getListInvoice(req, res)
      break
    case 'createInvoiceDraft':
      createInvoiceDraft(false, req, res)
      break
    case 'createInvoiceDraftP':
      createInvoiceDraft(true, req, res)
      break
    case 'transactionUuid':
      transactionUuid(req, res)
      break
    default:
  }
}

//==================================================
async function getToken(req, res) {
  return await axios({
    method: 'post', //you can set what request you want to be
    url: 'https://api-vinvoice.viettel.vn/auth/login',
    data: req.body,
    headers: {},
  }).then((data) => {
    return data.data
  })
  //console.log(111, result.data)
}

//=======================================
async function transactionUuid(req, res) {
  const token = await getToken(req, res)
  const config = {
    method: 'post', //you can set what request you want to be
    url: 'https://api-vinvoice.viettel.vn/services/einvoiceapplication/api/InvoiceAPI/InvoiceWS/searchInvoiceByTransactionUuid/',
    data: req.body,
    headers: {
      Cookie: `access_token=${token.access_token}`,
    },
  }
  config.url =
    config.url +
    'supplierTaxCode=' +
    req.body.supplierTaxCode +
    '&transactionUuid=' +
    req.body.Uuid

  // console.log(0000, config)
  const listInvoice = await axios(config)
    .then((data) => {
      return data.data
    })
    .catch((error) => {
      console.log(111, 'error', config.url)
    })
  console.log(222, listInvoice)
}

//=======================================
async function getListInvoice(req, res) {
  const token = await getToken(req, res)
  const config = {
    method: 'post', //you can set what request you want to be
    url: 'https://api-vinvoice.viettel.vn/services/einvoiceapplication/api/InvoiceAPI/InvoiceUtilsWS/getListInvoiceDataControl',
    data: req.body,
    headers: {
      Cookie: `access_token=${token.access_token}`,
    },
  }
  //console.log(0000, config)

  const listInvoice = await axios(config)
    .then((data) => {
      return data.data
    })
    .catch((error) => {
      console.log(111, error)
    })

  if (JSON.parse(config.data.getListOncly)) {
    // Phải có JSON.parse
    return res
      .status(200)
      .json({ message: 'Electronic invoices', data: listInvoice.invoices })
  }

  //console.log(222, listInvoice.invoices.length)
  let countUpdate = 0
  let query = ''
  let sohd = ''
  let Uuid = ''
  let cancel = 0
  if (listInvoice && listInvoice.invoices.length > 0) {
    //listInvoice.invoices.forEach((element) => {
    let element = listInvoice.invoices
    for (var key = 0; key < element.length; key++) {
      if (element[key].invoiceNumber.substring(0, 1) != '-') {
        sohd = element[key].invoiceSeri + '-' + element[key].invoiceNumber
        ngay = moment(element[key].createTime).format('YYYY-MM-DD')
        //console.log(key, sohd, ngay, element[key])
        if (element[key].transactionUuid) {
          countUpdate++
          Uuid = element[key].transactionUuid
          query =
            query +
            'UPDATE hoadon SET sohd = "' +
            sohd +
            '", ngay = "' +
            ngay +
            '", giaban = ' +
            element[key].totalBeforeTax +
            ', thuegtgt = ' +
            element[key].taxAmount +
            ' WHERE CONCAT(ctid,"-",id) = "' +
            Uuid +
            '" AND sohd <> "' +
            sohd +
            '";'
        } else cancel++
      }
    }
    if (query) await runQuerySync(query, [], '', '')
    //console.log(444, query)
  }

  let numberRow = countUpdate + cancel
  let mess = listInvoice
    ? 'Tổng hóa đơn phát hành trong kỳ.. ' +
      numberRow +
      ' ,Update số Hóa đơn.. ' +
      countUpdate
    : 'Không tìm thấy hóa đơn phát hành trong kỳ...'
  return res.status(200).json({ message: mess, data: listInvoice.invoices })
}

async function createInvoiceDraft(lPreview, req, res) {
  let cUrl =
    'https://api-vinvoice.viettel.vn/services/einvoiceapplication/api/InvoiceAPI/InvoiceWS/createOrUpdateInvoiceDraft/'
  if (lPreview) {
    cUrl =
      'https://api-vinvoice.viettel.vn/services/einvoiceapplication/api/InvoiceAPI/InvoiceUtilsWS/createInvoiceDraftPreview/'
  }
  cUrl = cUrl + req.body.username
  //console.log(req.body, cUrl)

  const token = await getToken(req, res)
  const config = {
    method: 'post', //you can set what request you want to be
    url: cUrl,
    data: {
      generalInvoiceInfo: {
        transactionUuid: '',
        description: '',
        invoiceType: '1',
        templateCode: '1/001',
        invoiceSeries: req.body.patern,
        currencyCode: 'VND',
        adjustmentType: '1',
        paymentStatus: true,
        cusGetInvoiceRight: true,
      },
      sellerInfo: {},
      buyerInfo: {
        buyerName: '',
        buyerLegalName: 'Trần Văn Nghĩa',
        buyerTaxCode: '0304633928',
        buyerAddressLine: '208 Nguyễn Hữu Cảnh, P22, Q.Bình Thạnh - HCM',
        buyerPostalCode: '',
        buyerDistrictName: '',
        buyerCityName: '',
        buyerCountryCode: '',
        buyerPhoneNumber: '',
        buyerFaxNumber: '',
        buyerEmail: '',
        buyerBankName: '',
        buyerBankAccount: '',
        buyerIdType: '',
        buyerIdNo: '',
        buyerCode: '',
        buyerBirthDay: '',
      },
      payments: [
        {
          paymentMethod: '3',
          paymentMethodName: 'TM/CK',
        },
      ],
      itemInfo: [
        {
          lineNumber: 1,
          itemCode: 'PM001',
          itemName: 'Phần mềm Kế toán',
          unitName: 'Bộ',
          itemNote: '',
          unitPrice: 10000000,
          quantity: 1,
          itemTotalAmountWithoutTax: 10000000,
          itemTotalAmountWithTax: 11000000,
          itemTotalAmountAfterDiscount: 0,
          taxPercentage: 10,
          taxAmount: 1000000,
          customTaxAmount: '0',
          discount: 0,
          itemDiscount: 0,
          batchNo: '',
          expDate: '',
        },
      ],
      taxBreakdowns: [
        {
          taxPercentage: 10,
          taxableAmount: 11000000,
          taxAmount: 1000000,
        },
      ],
    },

    headers: {
      Cookie: `access_token=${token.access_token}`,
    },
  }
  //console.log(0000, config)

  // CALL getHoadon('2020-01-01','2020-06-30','20','','')
  let uploaded = 0
  let fromDate = moment(req.body.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
  let toDate = moment(req.body.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
  let query =
    "CALL getHoadon('" +
    fromDate +
    "','" +
    toDate +
    "','20','ngay','" +
    req.body.ctid +
    "')"

  let cdps = await runQuerySync(query, [], req, res) // async function (cdps) {
  //console.log(888, query, cdps.length, cdps)

  if (!cdps || cdps.length == 0) {
    return res
      .status(200)
      .json({ message: 'Không có phát sinh Hóa đơn trong kỳ...' })
  }
  const multiInvoice = cdps.length > 1
  cdps = cdps[0]
  let signUp = '---UP---'
  for (var key = 0; key < cdps.length; key++) {
    //console.log(key, cdps[key])
    let strhd = cdps[key].sohd
    strhd = parseInt('0' + strhd.substring(strhd.indexOf('-') + 1))
    if (!lPreview && (strhd > 0 || cdps[key].sohd.includes(signUp))) {
      // Đã upload & Có số Hóa đơn rồi( >0 ) - LOẠI RA
      // Trường hợp HD không upload nằm cuối cùng NÊN PHẢI CHECK Ở ĐÂY
      uploaded++
      if (key == cdps.length - 1) {
        // Phải có để chạy hết for(key) mới Kết thúc
        let mess =
          'Số hóa đơn Upload :  ' +
          (cdps.length - uploaded) +
          ' / ' +
          cdps.length +
          (uploaded > 0
            ? ' ( Chỉ tính hóa đơn chưa có số dạng: CxxTVN-??? )'
            : '')
        console.log(mess)
        return res.status(200).json({ message: mess })
      } else continue
    }

    let keyUuid = cdps[key].ctid + '-' + cdps[key].id
    config.data.generalInvoiceInfo.transactionUuid = keyUuid
    config.data.generalInvoiceInfo.description = keyUuid
    config.data.buyerInfo.buyerLegalName = cdps[key].company
    config.data.buyerInfo.buyerTaxCode = cdps[key].maso
    config.data.buyerInfo.buyerAddressLine = cdps[key].address

    await loadInvoiceDetaild(
      config.data,
      cdps[key],
      fromDate,
      toDate,
      multiInvoice,
    )
    //console.log(key, config.data)
    const createInvoice = await axios(config)
      .then(async (data) => {
        if (!lPreview) {
          query =
            'UPDATE hoadon SET sohd = "' + signUp + '" WHERE id=' + cdps[key].id
          await runQuerySync(query, [], req, res)
        }
        return data.data
      })
      .catch((error) => {
        console.log(111, error)
        return res.status(400).json({
          message: 'Upload hóa đơn không thành công. Vui lòng thử lại sau... ',
          error: error,
        })
      })

    if (!createInvoice)
      return res
        .status(200)
        .json({ message: 'Không có phát sinh Hóa đơn trong kỳ...' })
    if (lPreview) {
      key = cdps.length - 1 // CHỈ XEM 1 HÓA ĐƠN
      let buff = new Buffer(createInvoice.fileToBytes, 'base64')
      let filename = 'Invoice-' + createInvoice.fileName
      if (typeof res != 'undefined') {
        var zip = new JSZip()
        zip.file(filename, buff)
        res.setHeader('Content-Disposition', 'attachment; filename=' + filename)
        res.setHeader('Content-Type', 'application/pdf') // 'application/zip'
        zip
          .generateNodeStream({
            type: 'nodebuffer',
            streamFiles: true,
          }) // Nén thì Phải có compression: 'DEFLATE'
          .pipe(res)
          .on('finish', function () {
            console.log(
              'filename: ' + filename,
              'transactionUuid: ' +
                config.data.generalInvoiceInfo.transactionUuid,
            )
          })

        // test ===========================
        // let tmpfile = tmp.tmpNameSync() + '_' + filename
        // fs.writeFileSync(tmpfile, buff)
        // console.log('Save file to : ' + tmpfile)
        // test ===========================
      }
    } else {
      if (key == cdps.length - 1) {
        // Phải có để chạy hết for(key) mới Kết thúc
        let mess =
          'Số hóa đơn Upload :  ' +
          (cdps.length - uploaded) +
          ' / ' +
          cdps.length +
          (uploaded > 0
            ? ' ( Chỉ tính hóa đơn chưa có số dạng: CxxTVN-??? )'
            : '')
        console.log(mess)
        return res.status(200).json({ message: mess })
      }
    }
  } // for
  //})
}

async function loadInvoiceDetaild(config, cdps, fromDate, multiInvoice) {
  config.itemInfo[0].lineNumber = 1
  config.itemInfo[0].itemCode = ''
  config.itemInfo[0].itemName = cdps.diengiai // OR mathang
  config.itemInfo[0].unitName = '-'
  config.itemInfo[0].unitPrice = cdps.sotien
  config.itemInfo[0].quantity = 1
  config.itemInfo[0].itemTotalAmountWithoutTax = cdps.sotien
  config.itemInfo[0].itemTotalAmountWithTax = cdps.sotien + cdps.thuegtgt
  config.itemInfo[0].itemTotalAmountAfterDiscount = 0
  config.itemInfo[0].taxPercentage =
    cdps.thuesuat.trim() == '%' ? -2 : parseInt('0' + cdps.thuesuat)
  config.itemInfo[0].taxAmount = cdps.thuegtgt
  // Chỉ 1 thuế suất chung cho các dòng ( Nếu có )
  config.taxBreakdowns[0].taxPercentage =
    cdps.thuesuat.trim() == '%' ? -2 : parseInt('0' + cdps.thuesuat)
  config.taxBreakdowns[0].taxableAmount = cdps.sotien + cdps.thuegtgt
  config.taxBreakdowns[0].taxAmount = cdps.thuegtgt

  if (multiInvoice) return // Nhiều hóa đơn thì không xem xét vật tư

  let query =
    "CALL Create_CtuvattuHoadon('" +
    fromDate +
    "','" +
    toDate +
    "','" +
    cdps.ctid +
    "')"

  let result = await runQuerySync(query, [], '', '')
  if (result && result.length > 0 && result[0].length > 0) {
    let taxPercentage = config.itemInfo[0].taxPercentage
    for (var key2 = 0; key2 < result[0].length; key2++) {
      let ctvt = result[0][key2]

      if (key2 > 0) config.itemInfo.push({}) // add thêm object phải TRỐNG mới được
      config.itemInfo[key2].lineNumber = key2 + 1
      config.itemInfo[key2].itemCode = ctvt.mahang
      config.itemInfo[key2].itemName = ctvt.tenhang
      config.itemInfo[key2].unitName = ctvt.donvi
      config.itemInfo[key2].unitPrice = parseInt(ctvt.sotien / ctvt.soluong)
      config.itemInfo[key2].quantity = ctvt.soluong
      config.itemInfo[key2].itemTotalAmountWithoutTax = ctvt.sotien
      config.itemInfo[key2].itemTotalAmountWithTax =
        ctvt.sotien + (ctvt.sotien * taxPercentage) / 100
      config.itemInfo[key2].itemTotalAmountAfterDiscount = 0
      config.itemInfo[key2].taxPercentage = taxPercentage
      config.itemInfo[key2].taxAmount = (ctvt.sotien * taxPercentage) / 100
    }
  }
  //console.log(111, query, config.itemInfo, config.taxBreakdowns )
}
