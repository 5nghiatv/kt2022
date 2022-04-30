// export function getToken() {
//     return Cookies.get(TokenKey)
// }

exports.configMask = {
  prefix: '',
  allowDecimal: true,
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '.',
  decimalSymbol: ',',
  decimalLimit: 0,
  allowNegative: false, // Số âm
}
exports.configMask2 = {
  prefix: '',
  allowDecimal: true,
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '.',
  decimalSymbol: ',',
  decimalLimit: 2,
  allowNegative: false, // Số âm
}

exports.numberFormat = function (x) {
  if (!x) return 0
  x = x.toString()
  var pattern = /(-?\d+)(\d{3})/
  while (pattern.test(x)) x = x.replace(pattern, '$1.$2')
  return x
}

exports.setColorNumber = function (opt, sotien = 0) {
  sotien += '.' // Phòng là Number
  sotien = sotien.split('.').join('').split(',').join('.')
  var lim = 2000000
  if (opt === 'draft') return sotien < lim
  if (opt === 'paid') return sotien >= lim && sotien < 5 * lim
  if (opt === 'pending') return sotien >= 5 * lim
}
