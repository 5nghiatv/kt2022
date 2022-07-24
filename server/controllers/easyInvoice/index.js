//'use strict'

const config = require('./config')
var client = require('./request')
var fs = require('fs')
var stream = require('stream')
//const JSZip = require('jszip')

// var action = config.api.getInvoiceView.action
// var action2 = config.api.checkInvoiceState.action
// var importInvoiceAction = config.api.importInvoice.action
// var getInvoicePdfAction = config.api.getInvoicePdf.action

// Add NEW ===========================
var getInvoiceUsageReport = config.api.getInvoiceUsageReport.action
var getInvoiceReport = config.api.getInvoiceReport.action
var getInvoiceByArisingDateRange =
  config.api.getInvoiceByArisingDateRange.action

var callback = function (res) {
  var responseString = ''
  res.on('data', function (data) {
    responseString += data
  })
  res.on('end', function () {
    console.log('Response = ' + JSON.stringify(responseString))
  })
  console.log('Done')
}

var callbackBinary = function (res) {
  var chunks = []
  res.on('data', function (data) {
    chunks.push(data)
  })
  res.on('end', function () {
    //var file = config.api.getInvoicePdf.outPath;
    var file = config.api.outPath // Nghia ADD
    var s = new stream.Readable({
      read(size) {
        this.push(new Buffer.concat(chunks))
        this.push(null)
      },
    })

    var filestream = fs.createWriteStream(file)
    s.pipe(filestream)
  })

  // var filename = 'invoice.xlsx';
  // var zip = new JSZip()
  // zip.file(filename, chunks)
  // res.setHeader('Content-Disposition', 'attachment; filename=' + filename)
  // res.setHeader('Content-Type', 'application/pdf') // 'application/zip'
  // zip
  //   .generateNodeStream({
  //     type: 'nodebuffer',
  //     streamFiles: true,
  //   }) // Nén thì Phải có compression: 'DEFLATE'
  //   .pipe(res)
  //   .on('finish', function () { console.log('filename: ' + filename ) })

  console.log('Done')
}

var body = {
  IKey: '4c37090df6164b80b685b5b1ae72dbb6',
  Pattern: '01GTKT0/003',
}

var body2 = {
  IKey: '4c37090df6164b80b685b5b1ae72dbb6',
}

var body3 = {
  IKey: '8e6a8dd2f4b24a539b8d9d4f8cedb5df',
  Pattern: '01GTKT0/001',
  Option: 0,
}

var body31 = {
  IKey: '2018001',
  Pattern: '01GTKT0/001',
  Option: 0,
  outPath: 'invoice.pdf',
}

var getInvoiceUsageReport_ = {
  FromDate: '01/07/2022',
  ToDate: '21/07/2022',
  Option: 1,
  outPath: 'invoice.xls',
}
var getInvoiceReport_ = {
  FromDate: '01/07/2022',
  ToDate: '21/07/2022',
  Option: 1,
  outPath: 'invoice.xlsx',
}

//client.post(action, body, callback);

var request1 =
  '{"Pattern":"01GTKT0/001","Serial":"HD/18E","XmlData":"<Invoices><Inv><key>2018001</key><Invoice><InvNo>a</InvNo><CusCode><![CDATA[a]]></CusCode><Buyer><![CDATA[Ho van PHi]]></Buyer><CusName><![CDATA[Cong ty OneHealh]]></CusName><CusAddress><![CDATA[3/2 thong nhat]]></CusAddress><CusBankName><![CDATA[NH Tien Phong]]></CusBankName><CusBankNo>1233434545</CusBankNo><CusPhone><![CDATA[a]]></CusPhone><CusTaxCode>1234512345</CusTaxCode><PaymentMethod>TM</PaymentMethod><ArisingDate>a</ArisingDate><ExchangeRate>0</ExchangeRate><CurrencyUnit>VND</CurrencyUnit><Extra><![CDATA[Hoa don test]]></Extra><Products><Product><Code><![CDATA[KPK]]></Code><ProdName><![CDATA[Kham phu khoa]]></ProdName><ProdUnit><![CDATA[Dich vu]]></ProdUnit><ProdQuantity>3</ProdQuantity><ProdPrice>2000</ProdPrice><Total>6000</Total><VATRate>0</VATRate><VATAmount>0</VATAmount><Amount>6000</Amount><Extra><![CDATA[a]]></Extra></Product><Product><Code><![CDATA[KRM]]></Code><ProdName><![CDATA[Kham rang mieng]]></ProdName><ProdUnit><![CDATA[Dich vu]]></ProdUnit><ProdQuantity>3</ProdQuantity><ProdPrice>2000</ProdPrice><Total>6000</Total><VATRate>0</VATRate><VATAmount>0</VATAmount><Amount>6000</Amount><Extra><![CDATA[a]]></Extra></Product></Products><Total>40000</Total><VATRate>0</VATRate><VATAmount>0</VATAmount><Amount>40000</Amount><AmountInWords>a</AmountInWords></Invoice></Inv></Invoices>","IkeyEmail":{"2018001":""}}'

//client.post(importInvoiceAction, request1, callback);
//client.post(getInvoicePdfAction, body3, callbackBinary);
//client.post(getInvoicePdfAction, body31, callbackBinary);

// NGHĨA NEW ADD
//client.post(getInvoiceUsageReport, getInvoiceUsageReport_, callbackBinary);

exports.easyInvoice = function (req, res) {
  //console.log('Start', 111, req.query)

  //client.post_(getInvoiceReport, getInvoiceReport_, callbackBinary)
  client.post(getInvoiceReport, req.query, res)
  console.log('Waiting response....')
}

// 21.	Tải báo cáo tình hình sử dụng hoá đơn
// Resource: “api/business/getInvoiceUsageReport”
// Data: {”FromDate”: “Từ ngày”, “ToDate”: “Đến ngày”, “Option”: “Mã loại báo cáo”}
// Mô tả
// ●	FromDate*: Ngày bắt đầu lấy dữ liệu báo cáo, kiểu chuỗi định dạng dd/MM/yyyy
// ●	ToDate*: Ngày kết thúc lấy dữ liệu báo cáo, kiểu chuỗi định dạng dd/MM/yyyy
// ●	Option*: Mã loại báo cáo
// -	0: File Excel dùng cho lưu trữ (mặc định)
// -	1: File Excel dùng để nhập vào HTKK
// -	2: File Xml theo định dạng HTKK
// ●	Trả về: File báo cáo

// 22.	Tải bảng kê chứng từ hàng hóa, dịch vụ bán ra
// Resource: “api/business/getInvoiceReport”
// ●	Option*: Mã loại báo cáo
// -	0: File HTML (mặc định)
// -	1: File Excel

// Procedure=sv-easy-invoice-dll
// Host=http://0303894719.easyinvoice.vn
// UserName=API
// Password=8MWxLjtBRJZ4
// Patern=1C22TNT
