// mixin.js file
/* eslint-disable */
import { mapState } from 'vuex'

export default {
  data() {
    return {
      searchNoZero: false,
      Writtenby: 'Trần Văn Nghĩa',
      googletheme: '',
    }
  },
  computed: {
    ...mapState(['theme']),
  },
  watch: {
    theme() {
      this.googletheme = this.theme === 'dark' ? 'nocturnal' : ''
    },
  },
  beforeCreate: function () {
    //this.$i18n.locale = this.$store.state.locale
  },
  created: function () {
    // Phục vụ cho Google Table tùy thuộc vào theme
    this.googletheme = this.theme === 'dark' ? 'nocturnal' : ''
    // console.log("Printing from the Mixin", this.googletheme)
  },
  methods: {
    testTheme(opt) {
      //console.log(9999, this.theme, opt, this.theme === opt)
      // theme : 1-default   2-dark ( Qui định tại AppHearder.vue)
      return this.theme === opt
    },
    displayMessage() {
      console.log('Written by => ' + this.Writtenby) // Run in Main.js
    },
    AlertAcn(msg, duration) {
      var el = document.createElement('div')
      el.setAttribute(
        'style',
        'position:absolute;top:40%;left:20%;background-color:white;',
      )
      el.innerHTML = msg
      setTimeout(function () {
        el.parentNode.removeChild(el)
      }, duration)
      document.body.appendChild(el)
    },
    onCellClick(params) {
      if (params.column.field == 'btnedit') {
        switch (params.event.srcElement.id) {
          case '1':
            this.editRowTable(params.row.originalIndex, params.row)
            break
          case '2':
            this.deleteRowTable(params.row.originalIndex, params.row)
            break
          case '3':
            this.chitietPSinh(params.row)
            break
        }
      }
    },
    numformatspace(value) {
      if (value == '0' || value == '0,00' || value == '0,000') {
        return ''
      }
      return value
    },
    getinfoAccount() {
      if (this.getCookie('dnl_company')) {
        infoAccount.theothongtu =
          '(Ban hành theo TT số: 200/2014/TT-BTC ngày 22/12/2014 của Bộ trưởng BTC)'
      } else {
        infoAccount.theothongtu =
          '(Ban hành theo TT số: 133/2016/TT-BTC ngày 26/08/2016 của Bộ trưởng BTC)'
      }
      this.$apiAcn
        .get('/cusTaxcode/' + this.getCookie('masothue') + '/edit')
        .then((response) => {
          var customers = response.data.customer
          customers.forEach((item, index) => {
            infoAccount.masothue = item['maso']
            infoAccount.company = item['company']
            infoAccount.fullname = item['fullname']
            infoAccount.address = item['address']
            infoAccount.email = item['email']
            infoAccount.phone1 = item['phone1']
            infoAccount.fax1 = item['fax1']
            infoAccount.account = item['account']
            infoAccount.bank = item['bank']
            infoAccount.citibank = item['citibank']
          })
          //console.log(customers);
        })
        .catch(function (error) {
          this.errorMessage(error)
        })
      return infoAccount
    },
    getketoanvar() {
      return Ketoanvar
    },
    tacgia() {
      this.myName = prompt('Nhập tên của bạn :')
    },
    number_format(number, decimals, dec_point, thousands_sep) {
      // Strip all characters but numerical ones.
      number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
      var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
        dec = typeof dec_point === 'undefined' ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
          var k = Math.pow(10, prec)
          return '' + Math.round(n * k) / k
        }
      // Fix for IE parseFloat(0.55).toFixed(0) = 0;
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
      }
      if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
      }
      return s.join(dec)
    },
    //define a function to GET cookies
    getCookie(cname) {
      var name = cname + '='
      var decodedCookie = decodeURIComponent(document.cookie)
      var ca = decodedCookie.split(';')
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    },
    //define a function to set cookies
    setCookie(name, value, days) {
      var expires = ''
      if (days) {
        var date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
        expires = '; expires=' + date.toUTCString()
      }
      document.cookie = name + '=' + (value || '') + expires + '; path=/'
    },
    format_so(num, dec = 0) {
      num += ''
      var nstr = num.split(',')
      num = nstr[0]
      var sole = dec > 0 && nstr.length > 1 ? ',' + nstr[1] : ''
      //----------------------
      const result = num
        .replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      return result + sole
    },
    format_ngay(num) {
      num += ''
      var nstr = num.replace(/\D/g, '')
      if (nstr == '') return ''
      var re1 = /(\d{2})/
      var re2 = /(\d{2})(\d{2})/
      var re3 = /(\d{2})(\d{2})(\d{4})/
      if (nstr.match(re3)) return nstr.replace(re3, '$1-$2-$3')
      if (nstr.match(re2)) return nstr.replace(re2, '$1-$2-')
      if (nstr.match(re1)) return nstr.replace(re1, '$1-')
      return num
    },
    isValidDate(txtDate, format, fromdate, todate) {
      var isValid = this.isDate(txtDate, format)
      if (isValid) {
        var newdate = txtDate.split('-').reverse().join('-')
        var ngaytest = moment(new Date(newdate)).format('YYYY-MM-DD')
        return ngaytest >= fromdate && ngaytest <= todate
      }
      return isValid
    },
    isDate(txtDate, format) {
      var currVal = txtDate
      if (currVal == '') {
        return false
      } //Declare Regex
      if (format == 'yyyy-mm-dd') {
        var rxDatePattern = /^(\d{4})(\/|-)(\d{2})(\/|-)(\d{2})$/
        var dtArray = currVal.match(rxDatePattern) // is format OK?
        if (dtArray == null) {
          return false
        } //Checks for yyyy/mm/dd format.
        var dtYear = dtArray[1]
        var dtMonth = dtArray[3]
        var dtDay = dtArray[5]
      }
      if (format == 'dd-mm-yyyy') {
        var rxDatePattern = /^(\d{2})(\/|-)(\d{2})(\/|-)(\d{4})$/
        var dtArray = currVal.match(rxDatePattern) // is format OK?
        if (dtArray == null) {
          return false
        } //Checks for yyyy/mm/dd format.
        var dtYear = dtArray[5]
        var dtMonth = dtArray[3]
        var dtDay = dtArray[1]
      }
      if (dtMonth < 1 || dtMonth > 12) {
        return false
      } else if (dtDay < 1 || dtDay > 31) {
        return false
      } else if (
        (dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) &&
        dtDay == 31
      ) {
        return false
      } else if (dtMonth == 2) {
        var isleap = dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0)
        if (dtDay > 29 || (dtDay == 29 && !isleap)) {
          return false
        }
      }
      return true
    },
    formatDate(date) {
      return moment(date).format('DD-MM-YYYY')
    },
    errorMessage(error) {
      console.log(error)
      if (error.response.data.message !== undefined) {
        alert(error.response.data.message)
      } else {
        alert('Không thể truy suất hoặc cập nhật dữ liệu !!')
      }
    },
    showMessage(response) {
      if (response.data.message !== undefined) {
        alert(response.data.message)
      }
    },
    gotoPage(route, reload = false) {
      this.$router.push(route)
      if (reload) {
        //window.location.href= axios.defaults.appURL+'/#'+ route;
        window.location.reload(true)
      }
    },
    printDiv() {
      this.$store.commit('left_menu', 'toggle')
      window.print()
      this.$store.commit('left_menu', 'toggle')
    },
    exportExel_LARAVEL(route, opt = '0') {
      opt = opt ? '/' + opt : ''
      var url = axios.defaults.baseURL + route + opt
      this.$store.state.isLoading = true
      this.$apiAcn
        .download(url)
        .then((response) => {
          this.$store.state.isLoading = false
        })
        .catch((error) => {
          this.$store.state.isLoading = false
          console.log(error.response)
          alert('Không thể truy suất hoặc cập nhật dữ liệu !!')
        })
    },
    number_vnd(number, decimals, decPoint, thousandsSep) {
      decimals = decimals || 0
      number = parseFloat(number)
      if (!decPoint || !thousandsSep) {
        decPoint = '.'
        thousandsSep = ','
      }
      var roundedNumber = Math.round(Math.abs(number) * ('1e' + decimals)) + ''
      var numbersString = decimals
        ? roundedNumber.slice(0, decimals * -1)
        : roundedNumber
      var decimalsString = decimals ? roundedNumber.slice(decimals * -1) : ''
      var formattedNumber = ''

      while (numbersString.length > 3) {
        formattedNumber += thousandsSep + numbersString.slice(-3)
        numbersString = numbersString.slice(0, -3)
      }

      return (
        (number < 0 ? '-' : '') +
        numbersString +
        formattedNumber +
        (decimalsString ? decPoint + decimalsString : '')
      )
    },
    getdatefromto() {
      var year = this.model.years
      year = year.substr(year.length - 4)
      // Default Cả năm
      this.model.pd_fromdate = year + '-01-01'
      this.model.pd_todate = year + '-12-31'
      switch (this.model.quarts) {
        case '1':
          this.model.pd_fromdate = year + '-01-01'
          this.model.pd_todate = year + '-03-31'
          break
        case '2':
          this.model.pd_fromdate = year + '-04-01'
          this.model.pd_todate = year + '-06-30'
          break
        case '3':
          this.model.pd_fromdate = year + '-07-01'
          this.model.pd_todate = year + '-09-30'
          break
        case '4':
          this.model.pd_fromdate = year + '-10-01'
          this.model.pd_todate = year + '-12-31'
          break
        case '5': // 6 tháng đầu năm
          this.model.pd_fromdate = year + '-01-01'
          this.model.pd_todate = year + '-06-30'
          break
        case '6': // 6 tháng cuối năm
          this.model.pd_fromdate = year + '-07-01'
          this.model.pd_todate = year + '-12-31'
          break
        case '7': // Cả năm
          this.model.pd_fromdate = year + '-01-01'
          this.model.pd_todate = year + '-12-31'
          break
      }
    },
    AddCammas() {
      // if(event.which >= 37 && event.which <= 40) return;
      $(this).val(function (index, value) {
        this.message = this.newdmsodutk.ngoaite
          .replace(/\D/g, '')
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      })
    },
    Ngaythang(ngay) {
      var d = new Date(ngay)
      var day = d.getDate()
      var month = d.getMonth() + 1
      var year = d.getFullYear()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + month
      }
      return 'Ngày ' + day + ' Tháng ' + month + ' Năm ' + year
    },
    GetTuDenNgay() {
      return (
        moment(this.getCookie('pd_fromdate')).format('DD-MM-YYYY') +
        ' - ' +
        moment(this.getCookie('pd_todate')).format('DD-MM-YYYY')
      )
    },
    getlenstr(sotk) {
      return sotk.length
    },
    dd(d) {
      console.log(d)
    },
    goTopEndPages() {
      if (typeof this.$children != 'undefined') {
        var index = 0
        for (let ind = 0; ind < this.$children.length; ind++) {
          //console.log(ind,typeof this.$children[ind].totalRowCount , typeof this.$children[ind].changePage)
          if (typeof this.$children[ind].totalRowCount != 'undefined') {
            index = ind
            break
          }
        }
        var endPages =
          this.$children[index].totalRowCount /
          this.$children[index].currentPerPage
        endPages = endPages < 1 ? 1 : endPages
        if (endPages > 1) {
          endPages =
            parseInt(endPages) == endPages ? endPages : parseInt(endPages) + 1
        }
        if (this.$children[index].currentPage == 1) {
          this.$children[index].changePage(endPages)
        } else {
          this.$children[index].changePage(1)
        }
      } else {
        const collection = document.getElementsByClassName(
          'page-info__label',
        )
        let totalPage = parseInt(collection[0].children[2].innerHTML.split('of').join('')) 
        collection[0].children[1].value = collection[0].children[1].value == 1 ? totalPage : 1
        collection[0].children[1].focus()
        // console.log(
        //   2222,
        //   'this.$options.components.VueGoodTable',
        //   this.$options.components.VueGoodTable,
        // )
      }
    },
    mySearchNoZero() {
      var index = 0
      if (typeof this.$children != 'undefined') {
        for (let ind = 0; ind < this.$children.length; ind++) {
          if (typeof this.$children[ind].totalRowCount != 'undefined') {
            index = ind
            break
          }
        }
        this.searchNoZero = !this.searchNoZero
        this.$children[index].searchTableOnEnter()
      } else {
        console.log(
          1111,
          'this.$options.components.VueGoodTable',
          this.$options.components.VueGoodTable,
        )
        // this.$options.components.VueGoodTable.methods.searchTableOnEnter()
      }
    },
  }, // Method
}
// -----------------------------------------------------------
