<template>
  <div>
    <h2 style="font-size: 25px; padding-left: 20px">
      Order & shipping
      <!-- <a class="btn btn-outline-info btn-sm" style="float:right;" id="createNew" ref="createNew" @click="setAddnew()" > ++ Create New</a>
              <a class="btn btn-outline-info btn-sm" style="float:right;" id="createexcel" ref="createexcel" @click="exportExcel()" > >> Excel</a>
              <a class="btn btn-outline-info btn-sm" style="float:right;" id="createzip" ref="createzip" @click="exportZip()" > >> Zip</a> -->
    </h2>

    <div class="d-flex justify-content-center">
      <div class="lds-dual-ring" v-if="loading"></div>
    </div>

    <vue-good-table
      id="tableACN"
      v-if="!loading"
      ref="MyCoolTable"
      :columns="columns"
      :rows="shippings"
      :group-options="{
        enabled: true,
        collapsable: true,
      }"
      :theme="googletheme"
      v-on:cell-click="onCellClick"
      styleClass="vgt-table condensed bordered striped"
      max-height="20000px"
      :fixed-header="false"
      :line-numbers="this.colchecked"
      :pagination-options="{
        enabled: true,
        mode: 'pages',
        perPage: 30,
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
        placeholder: 'Nhập nội dung tìm hoặc >0',
        searchFn: '',
      }"
    >
      <template #table-actions>
        <div class="button-group">
          <button
            title="Collapse -All- Expand"
            style="margin-right: 5px"
            class="btn btn-outline-info btn-sm"
            @click="setExpandAll()"
          >
            <i
              class="fa fa-expand"
              aria-hidden="true"
              style="font-size: 20px"
            ></i></button
          >&nbsp;&nbsp;
        </div>
      </template>
      <template #table-actions-bottom>
        <!-- This will show up on the bottom of the table.  -->
      </template>
      <template #emptystate>
        <!-- This will show up when there are no rows -->
      </template>
    </vue-good-table>
    <br />
  </div>
</template>
<script>
import { VueGoodTable } from 'vue-good-table-next'
//import moment from 'moment'
import utility from '@/common/utility'
import axios from 'axios'
import { mapState } from 'vuex'

//import utility from "@/utility";

export default {
  name: 'Transaction',
  mixins: [utility],
  components: {
    VueGoodTable,
  },
  data() {
    return {
      loading: false,
      expandAll: false,
      infoketoan: [],
      Validator: {
        company: false,
        address: false,
        maso: false,
        ghichu: false,
      },
      todoB: {},
      todos: [],
      todo: {
        id: '',
        company: '',
        address: '',
        maso: '',
        ghichu: '',
      },
      shippings: [],
      models: 'shippings',
      model: 'shipping',
      numberOfTodos: 0,
      colchecked: true,
      updaterec: false,
      infoprint: '',
      optprint: false,
      columns: [
        {
          label: 'Ngày tháng - địa chỉ giao hàng - thanh toán >> sản phẩm',
          field: 'addProduct',
        },
        {
          label: 'Đơn giá',
          field: 'price',
          type: 'number',
        },
        {
          label: 'Số lượng',
          field: 'amount',
          type: 'number',
        },
        {
          label: 'Thành tiền',
          field: 'total',
          type: 'number',
        },
      ],
    }
  },

  methods: {
    setExpandAll() {
      this.expandAll = !this.expandAll
      if (this.expandAll) this.$refs.MyCoolTable.expandAll()
      else this.$refs.MyCoolTable.collapseAll()
      // <button class="btn btn-outline-info btn-sm" @click="$refs.MyCoolTable.expandAll()">Collapse All</button>&nbsp;&nbsp;
      // <button class="btn btn-outline-info btn-sm" @click="$refs.MyCoolTable.collapseAll()">Collapse All</button>
    },
    getTodos() {
      this.loading = true
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/${this.model}`)
        .then((response) => {
          this.todos_ = response.data
          let countItem = -1
          this.todos_.forEach((items) => {
            //console.log(111,this.loggedUser._id ,items.userId)
            if (this.loggedUser._id == items.userId) {
              countItem++
              this.shippings.push({
                id: items._id,
                addProduct:
                  items.shippingDate
                    .substr(0, 10)
                    .split('-')
                    .reverse()
                    .join('-') +
                  ' ~ ' +
                  items.address1 +
                  (items.paycash ? ' (TM)' : ' (VISA)'),
                price: '',
                amount: '',
                total: this.number_format(items.totalPrice, 0, '.', ','),
                children: [],
              })
              //console.log(222,index,items, this.shippings);
              items.products.forEach((item) => {
                item.amount = item.amount || 1
                this.shippings[countItem].children.push({
                  id: item._id,
                  addProduct: item.productName,
                  price: item.productPrice,
                  amount: this.number_format(item.amount, 0, '.', ','),
                  total: this.number_format(
                    parseFloat(
                      item.productPrice.replace(',', '') * item.amount,
                    ),
                    0,
                    '.',
                    ',',
                  ),
                })
              })
            }
          })
        })
        .then(() => {
          //console.log(333, this.shippings)
          this.loading = false
          this.$toastr.success('XuânMai-VueShop', 'Orders loaded Successfully')
        })
        .catch((error) => {
          console.log(error)
          this.$toastr.error(
            'Internal Error 500',
            'The server encountered an unexpected condition.',
          )
        })
    },

    // number_format(number, decimals, dec_point, thousands_sep) {
    //   // Strip all characters but numerical ones.
    //   number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    //   var n = !isFinite(+number) ? 0 : +number,
    //     prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    //     sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
    //     dec = typeof dec_point === 'undefined' ? '.' : dec_point,
    //     s = '',
    //     toFixedFix = function (n, prec) {
    //       var k = Math.pow(10, prec)
    //       return '' + Math.round(n * k) / k
    //     }
    //   // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    //   s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    //   if (s[0].length > 3) {
    //     s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    //   }
    //   if ((s[1] || '').length < prec) {
    //     s[1] = s[1] || ''
    //     s[1] += new Array(prec - s[1].length + 1).join('0')
    //   }
    //   return s.join(dec)
    // },
    mySreach(row, col, cellValue, searchTerm) {
      //placeholder: 'Nhập nội dung tìm hoặc >0',
      //searchFn: mySreach
      if (this.searchNoZero && !searchTerm) {
        searchTerm = '>0'
      }
      searchTerm = searchTerm.trim()
      if (searchTerm == '>0') return false
      return false
    },
    onCellClick(params) {
      if (params.column.field == 'btnedit') {
        // switch (params.event.toElement.id) {
        //     case '1' : this.editTodo(params.row.originalIndex ,params.row) ;break;
        //     case '2' : this.deleteTodo(params.row.originalIndex ,params.row) ;break;
        // }
      }
    },
  },
  created() {
    //this.infoketoan = this.$jwtAcn.getKetoan()
  },

  mounted() {
    // this.getTodos(this.models);
    this.getTodos()
  },
  computed: {
    ...mapState(['loggedUser']),
    validation: function () {
      //this.todo.tygia = this.format_so(this.todo.tygia,2) ;
      return {
        company: !!this.todo.company.trim(),
        address: !!this.todo.address.trim(),
        maso: !!this.todo.maso.trim(),
        /* email: emailRE.test(this.newdmtiente.email),*/
      }
    },
    isValid: function () {
      var validation = this.validation
      return Object.keys(validation).every(function (key) {
        return validation[key]
      })
    },
  },
}
</script>

<style>
table.vgt-table {
  //font-size: 14px !important;
}
</style>

<style scoped>
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
</style>
