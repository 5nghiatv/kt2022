<template>
    <div class="invoiveForm">
        <form id="invoiveCU" @submit="action_invoive" v-if="!loading">
                <p v-if="errors.length">
                  <b>Vui lòng sửa lỗi trước khi tiếp tục...</b>
                  <ul>
                    <li style="color: burlywood;font-style: italic;" v-for="error in errors" :key="error">{{ error }}</li>
                  </ul>
        <!-- eslint-disable-next-line -->
                </p>
        <vue-good-table
              id="tableACN"
              v-on:selected-rows-change="selectionChanged"
              :columns="columns"
              :rows="invoices"
              :select-options="{ enabled: true }"
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
              }"
            >
              >

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

            <br>  
            <div class="form-group">
              <label for="company">Diễn giải</label>
              <input type="text" class="form-control" v-model="diengiai" >
            </div>

            <br>
                <button type="submit" class="btn btn-info">Lưu thông tin</button>
        </form>

        <div class="lds-dual-ring" v-if="loading"></div>
    </div>
</template>
<script>
import { VueGoodTable } from 'vue-good-table-next'
import moment from 'moment'
import utility from '@/common/utility'

export default {
  name: 'invoiveForm',
  mixins: [utility],
  components: {
    VueGoodTable,
    //moment,
  },
  //props: ["invoive"],
  data() {
    return {
      colchecked: true,
      upthanhcong: '000/000',
      nupdate: 0,
      diengiai: '',
      invoicesLocal: [],
      invoices: [],
      invoices_: [],
      models: 'invoices',
      model: 'invoice',
      errors: [],
      categories: [],
      sellers: [],
      loading: false,
      columns: [
        {
          label: 'Ngày tháng',
          field: 'createTime',
          tdClass: 'text-center',
        },
        {
          label: 'Số Hóa đơn',
          field: 'invoiceNumber',
        },
        {
          label: 'Mã số Thuế',
          field: 'buyerTaxCode',
          tdClass: 'text-right',
        },
        {
          label: 'Giá bán',
          field: 'totalBeforeTax',
          tdClass: 'text-right',
        },
        {
          label: 'Thuế VAT',
          field: 'taxAmount',
          tdClass: 'text-right',
        },
      ],

    }
  },
  methods: {
    selectionChanged(dat){
      this.invoices_ = dat.selectedRows
      //console.log(444, this.invoices_)
    },
    action_invoive(event) {
      event.preventDefault()
      this.$emit('submit-form', this.invoices_, this.diengiai)
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
          this.invoices = data.data.data.filter((doc) => {
            return doc.invoiceNumber.search('-') == -1
          })
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
<style lang="css">
.invoiveForm > div {
  text-align: start;
}
.invoiveForm #invoiveCU div {
  text-align: start;
}

.invoiveForm #invoiveCU button {
  text-align: center;
}

.lds-dual-ring {
  display: inline-block;
  width: 64px;
  height: 64px;
}
.lds-dual-ring:after {
  content: ' ';
  display: block;
  width: 46px;
  height: 46px;
  margin: 1px;
  border-radius: 50%;
  border: 5px solid #fff;
  border-color: #41b883 transparent #41b883 transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.modal-content {
    width: 140%;
}    
</style>