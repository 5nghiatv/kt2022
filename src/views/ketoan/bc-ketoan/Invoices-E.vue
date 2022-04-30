<template>
  <div>
    <CRow v-if="updaterec">
      <CCol sm="12">
        <CCard>
          <CCardHeader style="font-size: 25px"> Cập nhật &#8482; </CCardHeader>
          <CCardBody>
            <CForm @submit.prevent="submitForm"> </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <br v-if="updaterec" />
    <h2 style="font-size: 25px; padding-left: 20px">
      Hóa đơn Điện tử
      <CButton
        style="float: right; margin-right: 0px"
        class="btn btn-outline-info btn-sm"
        @click="exportExcel()"
        title="In hóa đơn bằng Excel"
        ><i class="fa fa-file-excel-o" aria-hidden="true"></i> Print > Excel
      </CButton>
      <a style="float: right">&nbsp;</a>
      <CButton
        style="float: right; margin-right: 0px"
        class="btn btn-outline-info btn-sm"
        @click="downdInvoiceNumber()"
        title="Cập nhật số Hóa đơn"
        ><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Update
        InvoiceNo
      </CButton>
    </h2>
    <CRow>
      <CCol md="3" style="float: right">
        <CInputGroup class="mb-3">
          <CFormInput
            size="sm"
            id="pd_fromdate"
            :placeholder="infoketoan.fromtodate.tungay"
          />
          <CFormInput
            size="sm"
            id="pd_todate"
            :placeholder="infoketoan.fromtodate.denngay"
          />
        </CInputGroup>
      </CCol>
      <CCol md="7"></CCol>
      <CCol md="2" style="float: right">
        <CInputGroup size="sm" class="mb-3">
          <CInputGroupText>Cập nhật</CInputGroupText>
          <CFormInput :placeholder="upthanhcong" />
        </CInputGroup>
      </CCol>
    </CRow>

    <vue-good-table
      id="tableACN"
      :columns="columns"
      :rows="invoices"
      :theme="googletheme"
      v-on:cell-click="onCellClick"
      styleClass="vgt-table condensed bordered striped"
      max-height="20000px"
      :fixed-header="false"
      :line-numbers="this.colchecked"
      :pagination-options="{
        enabled: true,
        mode: 'pages',
        perPage: 15,
        position: 'top',
        perPageDropdown: [15, 30, 50, 100, 300, 500],
        dropdownAllowAll: true,
        setCurrentPage: 1,
        nextLabel: 'Sau',
        prevLabel: 'Trước',
        rowsPerPageLabel: 'Dòng/trang',
        ofLabel: 'of',
        pageLabel: 'Trang', // for 'pages' mode
        allLabel: 'All',
      }"
      :search-options="{
        enabled: true,
        trigger: 'enter',
        skipDiacritics: true,
        placeholder: 'Tìm nội dung ( >0 )',
        searchFn: myFunc,
      }"
    >
      >
      <template #table-actions>
        <input
          title="Lọc có giá trị > 0"
          style="margin-right: 20px"
          class="btn btn-info"
          @change="mySearchNoZero2()"
          type="checkbox"
          id="vehicle1"
          name="vehicle1"
          value="true"
        />
        <input
          title="Trang đầu hoặc cuối"
          style="margin-right: 20px"
          class="btn btn-info"
          @change="goTopEndPages()"
          type="checkbox"
          id="vehicle1"
          name="vehicle1"
          value="true"
        />
        <input
          title="view column"
          style="margin-right: 20px"
          class="btn btn-info"
          @change="colOption()"
          v-model="colchecked"
          type="checkbox"
          id="vehicle1"
          name="vehicle1"
          value="colchecked"
        />
      </template>
      <template #table-actions-bottom>
        <!-- This will show up on the bottom of the table.  -->
      </template>
      <template #emptystate>
        <!-- This will show up when there are no rows -->
      </template>
      <template #table-row="props">
        <span v-if="props.column.field == 'invoiceNumber'">
          <span
            v-if="props.row.invoiceNumber.includes('-')"
            style="color: rosybrown"
            >{{ props.row.invoiceNumber }}</span
          >
          <span v-else>{{ props.row.invoiceNumber }}</span>
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
    <br />
  </div>
</template>
<script>
import { VueGoodTable } from 'vue-good-table-next'
//import apiService from '@/common/api.service'
import moment from 'moment'
import utility from '@/common/utility'

export default {
  name: 'invoices-e',
  mixins: [utility],
  components: {
    VueGoodTable,
    //moment,
  },
  data() {
    return {
      upthanhcong: '000/000',
      nupdate: 0,
      invoicesLocal: [],
      invoices: [],
      invoice: [],
      models: 'invoices',
      model: 'invoice',
      numberOfTodos: 0,
      colchecked: true,
      updaterec: false,
      infoprint: '',
      optprint: false,
      fromtodate: [],
      infoketoan: [],
      columns: [
        {
          label: 'Ngày tháng',
          field: 'createTime',
          tdClass: 'text-center',
        },
        {
          label: 'Mẫu HĐ',
          field: 'templateCode',
        },
        {
          label: 'invoiceID',
          field: 'invoiceId',
        },
        {
          label: 'invoice-NO',
          field: 'invoiceNo',
        },
        {
          label: 'invoice-Local',
          field: 'invoiceNumber',
        },
        {
          label: 'Mã số Thuế',
          field: 'buyerTaxCode',
          tdClass: 'text-right',
        },
        {
          label: '%',
          field: 'taxRate',
          tdClass: 'text-center',
        },
        {
          label: 'Giá bán',
          field: 'totalBeforeTax',
          tdClass: 'text-right',
        },
        {
          label: 'Thuế gtgt',
          field: 'taxAmount',
          tdClass: 'text-right',
        },
      ],
    }
  },

  methods: {
    mySearchNoZero2() {
      if (this.todosSave.length > 0) {
        this.cdketoans = this.todosSave // hoàn lại
        this.todosSave = []
      } else {
        let temp = this.cdketoans.filter((row) => {
          return (
            row.tscc + row.tscd + row.tsnc + row.tsnd > 0 ||
            row.tscc + row.tscd + row.tsnc + row.tsnd < 0 ||
            row.tscc.toString().indexOf('.') != -1 ||
            row.tscd.toString().indexOf('.') != -1 ||
            row.tsnc.toString().indexOf('.') != -1 ||
            row.tsnd.toString().indexOf('.') != -1
          )
        })
        this.todosSave = this.cdketoans // Lưu
        this.cdketoans = temp
      }
    },
    submitForm() {},
    myFunc(row, col, cellValue, searchTerm) {
      if (this.searchNoZero && !searchTerm) {
        searchTerm = '>0'
      }
      searchTerm = searchTerm.trim()
      if (searchTerm == '>0')
        return (
          row.tscc + row.tscd + row.tsnc + row.tsnd > 0 ||
          row.tscc + row.tscd + row.tsnc + row.tsnd < 0 ||
          row.tscc.toString().indexOf('.') != -1 ||
          row.tscd.toString().indexOf('.') != -1 ||
          row.tsnc.toString().indexOf('.') != -1 ||
          row.tsnd.toString().indexOf('.') != -1
        )
      return (
        row.masc.indexOf(searchTerm) != -1 ||
        row.masn.indexOf(searchTerm) != -1 ||
        row.tentsc.indexOf(searchTerm) != -1 ||
        row.tentsn.indexOf(searchTerm) != -1 ||
        row.tsnc.toString().indexOf(searchTerm) != -1 ||
        row.tsnd.toString().indexOf(searchTerm) != -1 ||
        row.tscc.toString().indexOf(searchTerm) != -1 ||
        row.tscd.toString().indexOf(searchTerm) != -1
      )
    },
    colOption() {
      //this.columns[5].hidden = !this.colchecked ;
      //this.columns[8].hidden = !this.colchecked || this.optprint
    },
    readInvoice() {
      let query =
        "CALL getHoadon('" +
        this.infoketoan.fromtodate.pd_fromdate +
        "','" +
        this.infoketoan.fromtodate.pd_todate +
        "','20','ngay','')"
      this.$apiAcn.post('/query', { query: query }).then((data) => {
        this.invoicesLocal = data.data.query
      })
    },
    readTodos() {
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .download('invoice', {
          host: process.env.VUE_APP_VIETTEL_HOST,
          username: process.env.VUE_APP_VIETTEL_USERNAME,
          password: process.env.VUE_APP_VIETTEL_PASSWORD,
          patern: process.env.VUE_APP_VIETTEL_PATERN,
          Uuid: '',
          fromDate: moment(
            this.infoketoan.fromtodate.pd_fromdate,
            'YYYY-MM-DD',
          ).format('DD/MM/YYYY'),
          toDate: moment(
            this.infoketoan.fromtodate.pd_todate,
            'YYYY-MM-DD',
          ).format('DD/MM/YYYY'),
          ctid: '',
          supplierTaxCode: process.env.VUE_APP_VIETTEL_USERNAME,
          procedure1: 'createInvoiceDraft',
          procedure3: 'createInvoiceDraftP',
          procedure2: 'getListInvoice',
          procedure4: 'transactionUuid',
          procedure: 'getListInvoice',
          filename: 'Invoice-' + process.env.VUE_APP_VIETTEL_USERNAME + '.pdf', // Phải
          responseType: 'json', // Liên quan api.service.js
          getListOncly: true, // ChiÒ lay danh sach hoa don
        })
        .then((data) => {
          this.invoices = data.data.data.filter((doc) => {
            return doc.invoiceNumber.substring(0, 1) != '-'
          })
          //console.log(111, this.invoicesLocal)
          this.invoices.forEach((item) => {
            item.createTime = moment(item.createTime).format('DD-MM-YYYY')
            item.totalBeforeTax = this.number_format(
              item['totalBeforeTax'],
              0,
              ',',
              '.',
            )

            if (this.invoicesLocal && this.invoicesLocal.length > 0) {
              let sohdLocal = this.invoicesLocal[0].filter((doc) => {
                return doc.sohd == item.invoiceSeri + '-' + item.invoiceNumber
              })
              if (sohdLocal && sohdLocal.length > 0) {
                item.invoiceNumber = sohdLocal[0].sohd
                this.nupdate++
              }
            }
            item.taxAmount = this.number_format(item['taxAmount'], 0, ',', '.')
            item.taxRate = item.taxRate ? item.taxRate : '%'
            //item.btnedit = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
          })
          this.upthanhcong = `${this.nupdate} / ${this.invoices.length}`
          //console.log(222, this.invoices)
          this.$store.commit('set', ['isLoading', false])
          this.$toastr.warning(
            '',
            data.data.message || 'Download thành công...',
            { timeOut: 5000 },
          )
        })
        .catch((err) => {
          console.log(err)
          this.$store.commit('set', ['isLoading', false])
        })
    },
    exportExcel() {
      this.$store.commit('set', ['isLoading', true])
      this.infoketoan['filename'] = 'HoaDonDientu.xlsx'
      this.infoketoan['patern'] = '20'
      this.infoketoan['user'] = []
      let url = '/thuegtgtXLSX'
      this.$apiAcn
        .download(url, this.infoketoan)
        .then(() => {
          this.$store.commit('set', ['isLoading', false])
          this.$toastr.success('', 'Thực hiện THÀNH CÔNG ...')
        })
        .catch((error) => {
          this.$toastr.error('', 'Thực hiện KHÔNG thành công...')
          console.log(error)
          this.$store.commit('set', ['isLoading', false])
        })
    },
    downdInvoiceNumber() {
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .download('invoice', {
          host: process.env.VUE_APP_VIETTEL_HOST,
          username: process.env.VUE_APP_VIETTEL_USERNAME,
          password: process.env.VUE_APP_VIETTEL_PASSWORD,
          patern: process.env.VUE_APP_VIETTEL_PATERN,
          Uuid: '',
          fromDate: moment(
            this.infoketoan.fromtodate.pd_fromdate,
            'YYYY-MM-DD',
          ).format('DD/MM/YYYY'),
          toDate: moment(
            this.infoketoan.fromtodate.pd_todate,
            'YYYY-MM-DD',
          ).format('DD/MM/YYYY'),
          ctid: '',
          supplierTaxCode: process.env.VUE_APP_VIETTEL_USERNAME,
          procedure1: 'createInvoiceDraft',
          procedure3: 'createInvoiceDraftP',
          procedure2: 'getListInvoice',
          procedure4: 'transactionUuid',
          procedure: 'getListInvoice',
          filename: 'Invoice-' + process.env.VUE_APP_VIETTEL_USERNAME + '.pdf', // Phải
          responseType: 'json', // Liên quan api.service.js
          getListOncly: false, // ChiÒ lay danh sach hoa don
        })
        .then(async (data) => {
          //console.log(data.data)
          await this.readInvoice()
          await this.readTodos()
          this.$store.commit('set', ['isLoading', false])
          this.$toastr.warning(
            '',
            data.data.message || 'Download thành công...',
            { timeOut: 5000 },
          )
        })
        .catch((err) => {
          console.log(err)
          this.$store.commit('set', ['isLoading', false])
        })
    },
  },
  created() {
    this.infoketoan = this.$jwtAcn.getKetoan()
  },
  mounted() {
    this.readInvoice()
    this.readTodos()
  },
}
</script>

<style scoped>
select {
  width: 250px;
  height: 35px;
  margin-left: -2px;
  padding-left: 8px;
  border-color: darkseagreen;
  color: #768192;
  outline-color: darkseagreen;
}
label {
  font: normal 14px !important;
  align-items: center;
  padding: 0.375rem 0.75rem;
  margin-bottom: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  border: 1px solid;
  border-radius: 0.25rem;
  color: #768192;
  background-color: #ebedef;
  border-color: #d8dbe0;
}
.topics td {
  /* text-align: center; */
  vertical-align: middle;
}

.list-horizontal li {
  display: inline-block;
}

.list-horizontal li:before {
  content: '\00a0\2022\00a0\00a0';
  color: #999;
  color: rgba(0, 0, 0, 0.5);
  font-size: 11px;
}

.list-horizontal li:first-child:before {
  content: '';
}
</style>
<style>
table.vgt-table {
  /* font-size: 14px !important; */
}
</style>
