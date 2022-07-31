//'use strict'

const config = require('./config')
var client = require('./request')
var fs = require('fs')
var stream = require('stream')
//const JSZip = require('jszip')
const xml2js = require('xml2js')

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

  console.log('Done')
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

// NGHĨA NEW ADD
//client.post(getInvoiceUsageReport, getInvoiceUsageReport_, callbackBinary);
function json2xml(obj) {
  const builder = new xml2js.Builder({
    headless: true,
    allowSurrogateChars: true,
    cdata: true,
    renderOpts: { pretty: true, indent: '', newline: '' },
  })
  const xml = builder.buildObject(obj)
  return xml
}
function updateProduct() {
  let sanpham =
    '<Products><Product><Code></Code><Name></Name><Price></Price><Unit></Unit><Des></Des><VATRate></VATRate></Product></Products>'
  xml2js.parseString(sanpham, async (err, result) => {
    let sp = result.Products.Product[0]
    sp.Code = ['001']
    sp.Name = ['Giấy màu các loại - USA']
    sp.Price = ['25000']
    sp.Unit = ['Kg']
    sp.Des = ['Hàng nhập USA']
    sp.VATRate = ['10']
    let request = {
      function: '/api/publish/updateProduct',
      host: '0303894719.easyinvoice.vn',
      username: 'API',
      password: '8MWxLjtBRJZ4',
      XmlData: json2xml(result),
    }
    //console.log(111, request)
    client.postOld(request, callback)
  })
}

function importInvoice() {
  let arr = JSON.parse(
    '{"XmlData":"<Invoices><Inv><Invoice><InvNo></InvNo><Ikey></Ikey><CusCode></CusCode><Buyer></Buyer><CusName></CusName><Email></Email><EmailCC></EmailCC><CusAddress></CusAddress><CusBankName></CusBankName><CusBankNo></CusBankNo><CusPhone></CusPhone><CusTaxCode></CusTaxCode><PaymentMethod></PaymentMethod><ArisingDate></ArisingDate><ExchangeRate></ExchangeRate><CurrencyUnit>VND</CurrencyUnit><Extra></Extra><Products><Product><Code></Code><ProdName></ProdName><ProdUnit></ProdUnit><ProdQuantity></ProdQuantity><ProdPrice></ProdPrice><Total></Total><VATRate></VATRate><VATAmount></VATAmount><Amount></Amount><Extra><Pos></Pos></Extra></Product></Products><Total></Total><VATRate></VATRate><VATAmount></VATAmount><Amount></Amount><AmountInWords></AmountInWords></Invoice></Inv></Invoices>"}',
  )
  let data = arr.XmlData
  xml2js.parseString(data, async (err, result) => {
    let Invoice = result.Invoices.Inv[0].Invoice[0]
    Invoice.Ikey = ['1234567890']
    Invoice.CusCode = ['MULTICOLOR']
    Invoice.Buyer = ['Trần Vũ Anh']
    Invoice.CusName = ['CÔNG TY TNHH MULTI-COLOR VIỆT NAM']
    Invoice.CusAddress = ['118/63 Bạch Đằng, P24, Q.Bình Thạnh - HCM']
    Invoice.CusBankName = ['Ngân hàng Vietcombank Chi nhánh Bình Thạnh - HCM']
    Invoice.CusBankNo = ['1233434545']
    Invoice.CusPhone = ['']
    Invoice.CusTaxCode = ['0304529821']
    Invoice.PaymentMethod = ['TM']
    Invoice.ArisingDate = ['30/07/2022']
    Invoice.ExchangeRate = ['0']
    Invoice.CurrencyUnit = ['VND']
    Invoice.Extra = ['']
    //Invoice.Products= Object
    Invoice.Total = ['12000000']
    Invoice.VATRate = ['10']
    Invoice.VATAmount = ['1200000']
    Invoice.Amount = ['13200000']
    Invoice.AmountInWords = ['Mười ba triệu hai trăm ngàn đồng chẵn']

    let Product = {
      Code: 'GIAY',
      No: '',
      Feature: '',
      ProdName: 'Giấy bãi bằng Việt Nam',
      ProdUnit: 'Kg',
      ProdQuantity: '3000',
      ProdPrice: '2000',
      Total: '6000000',
      VATRate: '10',
      VATAmount: '600000',
      Amount: '6600000',
      Extra: '',
    }
    result.Invoices.Inv[0].Invoice[0].Products[0].Product = []
    result.Invoices.Inv[0].Invoice[0].Products[0].Product.push(Product)
    result.Invoices.Inv[0].Invoice[0].Products[0].Product.push(Product)

    let request = {
      function: '/api/publish/importInvoice',
      host: '0303894719.easyinvoice.vn',
      username: 'API',
      password: '8MWxLjtBRJZ4',
      Pattern: '1C22TNT',
      Serial: '',
      XmlData: json2xml(result),
    }
    client.postOld(request, callback)
  })
}

exports.easyInvoice = function (req, res) {
  //console.log('Start', 111, req.query)

  //client.post(getInvoiceUsageReport, req.query, res)  // EXT filename phải là : XLS
  //client.post(getInvoiceReport, req.query, res)
  // api/publish/importInvoice {“XmlData”: “Chuỗi XML”, “Pattern”: “Ký hiệu hóa đơn”, “Serial”: “Ký hiệu mẫu số hóa đơn” }
  // api/publish/getInvoicePdf

  //--------------------------------- GOOD RUN
  //importInvoice()
  //updateProduct()
  client.post(req.query, res) // download bảng kê bán hàng hoặc lấy dữ liệu
  //---------------------------------

  //client.post(req.body, res) // Nếu dùng RestClient.http
  // let body = JSON.parse(request1)
  // console.log(body.XmlData, 111, body.Pattern, body.Serial)
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
