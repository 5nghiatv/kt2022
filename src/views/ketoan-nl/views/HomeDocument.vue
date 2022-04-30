<template>
  <div class="homeInvoice container">
    <!-- Header -->
    <div class="header flex">
      <div class="left flex flex-column">
        <h2>Documents</h2>
        <span :title="this.dateFromto"
          >There are
          <strong> {{ documentData.length }} </strong> documents</span
        >
      </div>
      <div class="right flex" :class="{ disable: showDocumentView }">
        <div
          v-if="!editInvoice && !docListModal && !documentModal"
          @click="toggleReportMenu"
          class="filter flex"
        >
          <Dropdown
            title="Report to Excel"
            @methodClick="methodClick"
            :DropOption="DropOption"
          />
        </div>

        <div
          v-if="!editInvoice && !docListModal && !documentModal"
          class="flex"
        >
          <CCol col="1" style="float: right">
            <select
              class="filter"
              size="small"
              title="Lọc chuyển chứng từ-Tài khoản -> Excel"
              v-model="patern"
              placeholder="Lọc in"
              clearable
              style="margin-right: 5px; width: 70px"
            >
              <option
                class="filter"
                v-for="item in paternOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </select>
          </CCol>
        </div>
        <div v-if="patern == 'TK'" class="filter flex">
          <input
            type="text"
            v-model="sotkhoan"
            style="width: 80px; height: 35px; border-radius: 5px"
            placeholder="111xxx..."
            title="Số tài khoản"
          />
        </div>

        <div
          v-if="!editInvoice && !docListModal && !documentModal"
          @click="toggleFilterMenu"
          class="filter flex"
        >
          <span>
            {{ captionFilter }}
            <span v-if="filteredInvoice"
              >: {{ filteredInvoice || currentPage }}
              <span v-if="typeof this.filteredInvoice === 'number'">
                ({{ this.linePerPage }} line)</span
              >
            </span></span
          >

          <img src="../assets/icon-arrow-down.svg" alt="" />
          <!-- <ul v-show="filterMenu" class="filter-menu"> -->
          <ul class="filter-menu flex">
            <li @click="filteredInvoices" class="dropdown__item">
              <span class="dropdown__text"> Draft</span>
              <i class="fa fa-user dropdown__icon"></i>
            </li>
            <li @click="filteredInvoices" class="dropdown__item">
              <span class="dropdown__text"> Paid</span>
              <i class="fa fa-cog dropdown__icon"></i>
            </li>
            <li @click="filteredInvoices" class="dropdown__item">
              <span class="dropdown__text"> Pending</span>
              <i class="fa fa-money dropdown__icon"></i>
            </li>

            <li @click="filteredInvoices" class="dropdown__item">
              <span class="dropdown__text"> Line/Page</span>
              <i class="fa fa-bars dropdown__icon"></i>
            </li>

            <li @click="filteredInvoices" class="dropdown__item">
              <span class="dropdown__text"> Search/Opt</span>
              <i class="fa fa-plus-circle dropdown__icon"></i>
            </li>
            <li @click="filteredInvoices" class="dropdown__item">
              <span class="dropdown__text" style="color: darkgoldenrod">
                Clear Filter</span
              >
              <i class="fa fa-trash-o dropdown__icon"></i>
            </li>
            <li @click="filteredInvoices" class="dropdown__item">
              <span class="dropdown__text"> Chứng từ</span>
              <i class="fa fa-calendar-o dropdown__icon"></i>
            </li>
            <li @click="filteredInvoices" class="dropdown__item">
              <span class="dropdown__text"> Ngày tháng</span>
              <i class="fa fa-refresh dropdown__icon"></i>
            </li>
            <li @click="filteredInvoices" class="dropdown__item">
              <span class="dropdown__text"> Số tiền</span>
              <i class="fa fa-money dropdown__icon"></i>
            </li>
          </ul>
        </div>

        <div
          @click="CopyMultiChungtuID()"
          class="button flex"
          style="background-color: rgba(255, 145, 0, 0.1); color: #ff8f00"
        >
          <div class="inner-button flex fa fa-plus text-info mr-2">
            <!-- <img src="../assets/icon-plus.svg" alt="" /> -->
          </div>
          <span>Copy Docs</span>
        </div>

        <div @click="AddNewList()" class="button flex">
          <div class="inner-button flex fa fa-plus text-info mr-2">
            <!-- <img src="../assets/icon-plus.svg" alt="" /> -->
          </div>
          <span>New List</span>
        </div>

        <div @click="newInvoice" class="button flex">
          <div class="inner-button flex fa fa-plus text-info mr-2">
            <!-- <img src="../assets/icon-plus.svg" alt="" /> -->
          </div>
          <span>New Document</span>
        </div>
      </div>
    </div>

    <!-- Invoices -->
    <div v-if="documentData.length > 0">
      <Document
        v-for="(document, index) in filteredData"
        :document="document"
        :key="index"
      />
      <CSmartPagination
        @click="activePageChange"
        :activePage="currentPage"
        :pages="totalPage"
        :dots="false"
        align="end"
      />
    </div>

    <div v-else class="empty flex flex-column">
      <img src="../assets/illustration-empty.svg" alt="" />
      <h3>There is nothing here</h3>
      <p>
        Create a new invoice by clicking the New Document button and get started
      </p>
    </div>
  </div>
</template>

<script>
import Dropdown from '../components/Dropdown'
import Document from '../components/Document'
import { mapActions, mapMutations, mapState } from 'vuex'
const { setColorNumber } = require('../utility')
import moment from 'moment'
import JwtService from '@/common/jwt.service'
import _ from 'lodash'

export default {
  name: 'HomeDocument',
  data() {
    return {
      DropOption: [
        {
          title: 'Reports to Excel',
          method: 'reportToExcel',
          icon: 'fa fa-plus-circle',
        },
        { title: 'Tất toán số dư', method: 'tatoansodutk', icon: 'fa fa-user' },
        { title: 'Tính cân đối Ps', method: 'tinhcandoips', icon: 'fa fa-cog' },
        {
          title: 'Mang sang số dư',
          method: 'chuyensodutk',
          icon: 'fa fa-circle',
        },
      ],
      documentFilter: null,
      captionFilter: 'Filter by status',
      currentPage: null,
      totalPage: null,
      linePerPage: null,
      filterMenu: null,
      reportMenu: null,
      filteredInvoice: null,
      orderInvoice: false,
      paternOptions: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '1+',
        '2+',
        '3+',
        '4+',
        '5+',
        '6+',
        '7+',
        '8+',
        '9+',
        '**',
        '++',
        '*+',
        'TK',
      ],
      patern: null,
      sotkhoan: null,
      dateFromto: null,
    }
  },
  components: {
    Document,
    Dropdown,
  },
  updated() {},
  mounted() {
    this.infoketoan = JwtService.getKetoan()
    this.dateFromto =
      'From: ' + moment(this.infoketoan.fromtodate.pd_fromdate).format('DD/MM')
    this.dateFromto =
      this.dateFromto +
      ' - ' +
      moment(this.infoketoan.fromtodate.pd_todate).format('DD/MM/YYYY')
    this.setPagination(10)
  },
  methods: {
    activePageChange(e) {
      if (e.target.innerHTML == '<span>»</span>' || e.target.innerHTML == '»')
        this.currentPage = this.totalPage
      if (e.target.innerHTML == '<span>›</span>' || e.target.innerHTML == '›') {
        this.currentPage =
          this.currentPage + 1 < this.totalPage
            ? this.currentPage + 1
            : this.totalPage
      }
      if (e.target.innerHTML == '<span>«</span>' || e.target.innerHTML == '«')
        this.currentPage = 1
      if (e.target.innerHTML == '<span>‹</span>' || e.target.innerHTML == '‹') {
        this.currentPage = this.currentPage - 1 < 1 ? 1 : this.currentPage - 1
      }
      if (parseInt(e.target.innerHTML) > 0)
        this.currentPage = parseInt(e.target.innerHTML)
      // console.log(this.currentPage, e.target.innerHTML)
    },
    ...mapMutations('myDocument', ['TOGGLE_DOCUMENT']),
    ...mapActions('myDocument', ['runMysql', 'GET_DOCUMENTS']),

    methodClick(method) {
      this[method]()
    },
    CopyMultiChungtuID() {
      this.copyMultict = false
      var query =
        "SELECT ctid,soct,ngay FROM ctuktoan WHERE ngay BETWEEN '" +
        this.infoketoan.fromtodate.pd_fromdate +
        "' AND '" +
        this.infoketoan.fromtodate.pd_todate +
        "' "
      this.$apiAcn
        .post('/query', { query: query })
        .then((ret) => {
          let nDemsoct = ret.data.query.length
          if (ret.data.success && nDemsoct > 0) {
            //var strcheck = this.infoketoan.fromtodate.pd_fromdate.substr(5,2)+"-" +this.infoketoan.fromtodate.pd_todate.substr(5,2)+"/"+this.infoketoan.fromtodate.pd_fromdate.substr(0,4);
            if (
              confirm(
                'Chương trình sẽ COPY toàn bộ ( ' +
                  nDemsoct +
                  ' ) chứng từ trong kỳ và tạo thêm ' +
                  nDemsoct +
                  ' chứng từ mới, vì thế nên < Sao lưu chứng từ > trước khi thực hiện.',
              )
            ) {
              if (nDemsoct > 100)
                return alert(
                  'Số lượng chứng từ > 100 nên chương trình không hổ trợ Copy...',
                )
              let tungayV = moment(
                this.infoketoan.fromtodate.pd_fromdate,
                'YYYY-MM-DD',
              ).format('DD/MM/YYYY')
              let tungay = moment(
                this.infoketoan.fromtodate.pd_fromdate,
                'YYYY-MM-DD',
              ).toDate() // For so sánh
              let newdate_ = prompt(
                'Nhập ngày tạo chứng từ có dạng : dd/mm/yyyy và phải lớn hơn ngày: ' +
                  tungayV,
                '**/**/****',
              ) // For Check lần 2
              let newdateV = newdate_
                ? newdate_.split('/').reverse().join('-')
                : '0000-00-00' // For Gửi CALL.
              let newdate = moment(newdateV, 'YYYY-MM-DD').toDate() // For so sánh
              if (moment(newdate).isValid() && newdate >= tungay) {
                let person = prompt(
                  'Copy chứng từ có thể làm thay đổi bảng <Cân đối Kế toán>...Xác nhận thực hiện bằng cách Nhập lại ngày tạo chứng từ có dạng : dd/mm/yyyy ',
                  '**/**/****',
                )
                if (person == null || person != newdate_) {
                  this.$toastr.warning(
                    '',
                    'Xác nhận không đúng định dạng ? nên KHÔNG COPY chứng từ.',
                  )
                  return
                }
                let query =
                  "CALL CopyChungtuKt('" +
                  this.infoketoan.fromtodate.pd_fromdate +
                  "','" +
                  this.infoketoan.fromtodate.pd_todate +
                  "','" +
                  newdateV +
                  "')"
                console.log(query)
                newdate = moment(newdate, 'YYYY-MM-DD', true).format(
                  'MM/DD/YYYY',
                ) // chỉ để thông báo
                this.$apiAcn
                  .post('/query', { query: query })
                  .then(() => {
                    this.$toastr.success(
                      '',
                      'COPY ( ' +
                        nDemsoct +
                        ' ) chứng từ THÀNH CÔNG sang Ngày :' +
                        newdate,
                    )
                    //this.readTodos();
                    this.GET_DOCUMENTS(true)
                  })
                  .catch((err) => {
                    console.log(err)
                    this.$toastr.error('', 'COPY chứng từ KHÔNG thành công.')
                  })
              } else
                this.$toastr.warning(
                  '',
                  'Ngày không hợp lệ ? nên KHÔNG COPY chứng từ.',
                )
            }
          } else this.$toastr.warning('', 'KHÔNG có chứng từ để COPY.')
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.error('', 'COPY chứng từ KHÔNG thành công.')
        })
    },
    tatoansodutk() {
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .post('/tatoansodutk', this.infoketoan)
        .then(async () => {
          await this.GET_DOCUMENTS(true)
          this.$store.commit('set', ['isLoading', false])
          this.$toastr.success(
            '',
            'Tất toán Số dư trong kỳ....Thực hiện thành công !!',
          )
          this.documentFilter = this.documentData // Chuẩn bị cho refresh data
          this.filteredInvoice = this.filteredInvoice ? null : 1 // refresh data : run this.filteredData
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.warning(
            '',
            'Tất toán Số dư trong kỳ....KHÔNG thành công !!',
          )
          this.$store.commit('set', ['isLoading', false])
        })
    },
    chuyensodutk() {
      this.tinhcandoi('chuyensodutk', 'Chuyển số dư năm trước sang')
    },
    tinhcandoips() {
      this.tinhcandoi('tinhcandoips', 'Tính cân đối phát sinh kỳ này')
    },
    tinhcandoi(whatCandoi, title) {
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .post('/' + whatCandoi, {
          pd_fromdate: this.infoketoan.fromtodate.pd_fromdate,
          pd_todate: this.infoketoan.fromtodate.pd_todate,
        })
        .then(async () => {
          await this.GET_DOCUMENTS(true)
          this.$toastr.success('', title + ' thực hiện THÀNH CÔNG.')
          this.$store.commit('set', ['isLoading', false])
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.error('', title + ' thực hiện KHÔNG thành công.')
          this.$store.commit('set', ['isLoading', false])
        })
    },
    reportToExcel() {
      var ischitiet = 0 // luôn là tài khoản
      if (ischitiet == 2) {
        this.infoketoan['filename'] = 'SoNhatKyHangHoa.xlsx'
        this.infoketoan['patern'] = this.paternmahang
        this.$store.commit('set', ['isLoading', true])
        this.$apiAcn
          .download('/sonhatkyhh', this.infoketoan)
          .then(() => {
            this.$store.commit('set', ['isLoading', false])
          })
          .catch((error) => {
            this.$toastr.error(
              '',
              'ERROR Download file : ' + this.infoketoan['filename'],
            )
            console.log(error)
            this.$store.commit('set', ['isLoading', false])
          })
      } else {
        this.infoketoan['filename'] = 'SoNhatKy.xlsx'
        if ((this.patern == 'TK' && this.sotkhoan == '') || !this.patern)
          return this.$toastr.warning(
            '',
            'Chọn lọc TK phải nhập Số tài khoản hoặc nhóm.',
          )
        this.infoketoan['patern'] =
          this.patern == 'TK' ? this.sotkhoan : this.patern
        this.$store.commit('set', ['isLoading', true])
        this.$apiAcn
          .download('/sonhatky', this.infoketoan)
          .then(() => {
            this.$store.commit('set', ['isLoading', false])
          })
          .catch((error) => {
            this.$toastr.error(
              '',
              'ERROR Download file : ' + this.infoketoan['filename'],
            )
            console.log(error)
            this.$store.commit('set', ['isLoading', false])
          })
      }
    },
    AddNewList() {
      this.TOGGLE_DOCUMENT(4)
    },
    newInvoice() {
      this.TOGGLE_DOCUMENT()
    },
    toggleReportMenu() {
      this.reportMenu = !this.reportMenu
    },
    toggleFilterMenu() {
      this.filterMenu = !this.filterMenu
    },
    filteredInvoices(e) {
      if ('Chứng từ,Ngày tháng,Số tiền'.includes(e.target.innerText))
        this.orderInvoice = !this.orderInvoice
      if (e.target.innerText === 'Clear Filter') {
        this.filteredInvoice = null
      } else this.filteredInvoice = e.target.innerText
    },
    setColorNumber(opt, sotien) {
      // Dòng này quá nguy hiểm
      //var sotien = this.document.sotien  ? this.document.sotien : 0;
      return setColorNumber(opt, sotien)
    },

    setPagination(
      npage = this.linePerPage,
      documentData = this.documentFilter,
    ) {
      if (documentData == null) {
        return
      }
      this.linePerPage = npage
      this.totalPage = parseInt(documentData.length / this.linePerPage)
      if (documentData.length / this.linePerPage - this.totalPage > 0)
        this.totalPage++
      this.currentPage = 1
    },
    getPagination(documentData = this.documentFilter) {
      var indexTo = this.currentPage * this.linePerPage
      return documentData.filter((doc, index) => {
        return index < indexTo && index >= indexTo - this.linePerPage
      })
    },
  },
  watch: {
    showDocumentView() {
      if (!this.showDocumentView && this.documentData)
        this.documentFilter = this.documentData
      if (typeof this.filteredInvoice !== 'number') this.filteredInvoice = 1
    },
    currentPage() {
      this.filteredInvoice = this.currentPage // Thay đổi this.currentPage sẽ chạy => this.filteredInvoice()
    },
  },
  computed: {
    ...mapState('myDocument', [
      'showDocumentView',
      'docListModal',
      'documentModal',
      'editInvoice',
      'invoiceData',
      'documentData',
    ]),

    filteredData() {
      //console.log(33,this.currentPage)

      if (typeof this.filteredInvoice === 'number') {
        return this.getPagination()
      }
      if (!this.filteredInvoice) {
        // eslint-disable-next-line
        this.documentFilter = this.documentData
        this.setPagination()
        return this.getPagination()
      }
      if (this.filteredInvoice === 'Line/Page') {
        let person = prompt('Nhập số dòng / trang ? ( dùng cho phân trang ) ')
        person = parseInt(person)
        if (person && typeof person === 'number') {
          this.setPagination(person)
          return this.getPagination()
        }
        return
      }
      if (this.filteredInvoice === 'Search/Opt') {
        let person = prompt('Nhập mẫu chọn lọc chứng từ')
        person = person ? person : ''
        return this.documentData.filter((doc) => {
          return (
            doc.sotien +
            doc.ngay +
            doc.soct +
            doc.diengiai +
            doc.tkno +
            doc.tkco
          ).includes(person)
        })
      }

      var orderby = this.orderInvoice ? 'asc' : 'desc'
      if (this.filteredInvoice === 'Chứng từ') {
        // eslint-disable-next-line
        this.documentFilter = _.orderBy(
          this.documentData,
          ['soct', 'ngay_'],
          [orderby],
        )
      }
      // eslint-disable-next-line
      if (this.filteredInvoice === 'Ngày tháng') {
        // eslint-disable-next-line
        this.documentFilter = _.sortBy(
          this.documentData,
          ['ngay_', 'soct'],
          [orderby],
        )
      }
      if (this.filteredInvoice === 'Số tiền') {
        // eslint-disable-next-line
        this.documentFilter = _.sortBy(
          this.documentData,
          ['sotien_', 'ngay_'],
          [orderby],
        )
      }

      if (
        this.filteredInvoice === 'Draft' ||
        this.filteredInvoice === 'Paid' ||
        this.filteredInvoice === 'Pending'
      ) {
        // eslint-disable-next-line
        this.documentFilter = this.documentData.filter((document) => {
          if (this.filteredInvoice === 'Draft')
            return this.setColorNumber('draft', document.sotien)
          if (this.filteredInvoice === 'Paid')
            return this.setColorNumber('paid', document.sotien)
          if (this.filteredInvoice === 'Pending')
            return this.setColorNumber('pending', document.sotien)
          return document
        })
      }
      this.setPagination()
      return this.getPagination()
    },
  },
}
</script>

<style lang="scss" scoped>
.homeInvoice {
  // transition-delay: .5s;
  // transition-property: background-color;
  // transition: all .5s ease-out;

  margin: 0;
  padding: 0;
  margin-top: 20px;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  color: #fff;

  .header {
    background-color: #2a2b36;
    margin-bottom: 25px; //65px;
    .left {
      flex: 1;
    }
    .right {
      flex: 3;
    }

    .right {
      justify-content: flex-end;
      align-items: center;

      .button,
      .filter {
        align-items: center;

        span {
          font-size: 14px;
        }
      }

      // ===========DropDown Menu==========
      .dropdown__text {
        margin-left: 30px;
      }
      .dropdown__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .filter:hover .filter-menu {
        display: block;
      }
      .filter {
        position: relative;
        margin-right: 40px;
        cursor: pointer;

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu {
          padding: 0px;
          width: 230px;
          display: none;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li {
            transition: background-color 0.2s linear;
            cursor: pointer;
            font-size: 14px;
            padding: 10px 20px 10px 0px;

            &:hover {
              // color: #1e2139;
              color: #ff8f00;
              background-color: #fff;
            }
          }

          li:before {
            content: '';
            height: 1rem;
            position: absolute;
            left: 0;
            right: 0;
            background-color: transparent;
            transform: translateY(-100%);
          }
          li:first-child {
            border-radius: 4px 4px 0 0;
          }
          li:last-child {
            border-radius: 0 0 4px 4px;
          }
        }
      }
      // ===============================

      .button {
        background-color: #7c5dfa;
        padding: 8px 10px;
        border-radius: 40px;
        padding: 8px 10px;
        border-radius: 40px;
        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .empty {
    margin-top: 160px;
    align-items: center;

    img {
      width: 214px;
      height: 200px;
    }

    h3 {
      font-size: 20px;
      margin-top: 40px;
    }

    p {
      text-align: center;
      max-width: 224px;
      font-size: 14px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
  .disable {
    pointer-events: none;
    opacity: 0.4;
  }

  // // Animate scrolling only if users don’t prefer reduced motion
  // @media (prefers-reduced-motion: no-preference) {
  //   html {
  //     scroll-behavior: smooth;
  //   }
  //   // Add some spacing between the target and the top of the viewport
  //   :target {
  //     scroll-margin-top: 0.8em;
  //   }
  // }
}
</style>
