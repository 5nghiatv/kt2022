<template>
  <div>
    <h2 style="font-size: 25px; padding-left: 20px">
      Transactions
      <!-- <a class="btn btn-outline-info btn-sm" style="float:right;" id="createNew" ref="createNew" @click="setAddnew()" > ++ Create New</a>
              <a class="btn btn-outline-info btn-sm" style="float:right;" id="createexcel" ref="createexcel" @click="exportExcel()" > >> Excel</a>
              <a class="btn btn-outline-info btn-sm" style="float:right;" id="createzip" ref="createzip" @click="exportZip()" > >> Zip</a> -->
    </h2>

    <div class="d-flex justify-content-center">
      <div class="lds-dual-ring" v-if="loading"></div>
    </div>

    <vue-good-table
      id="tableACN"
      :columns="columns"
      :rows="todos"
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
        placeholder: 'Tìm nội dung (.)',
      }"
    >
      >
      <template #table-actions>
        <input
          title="Lọc có giá trị > 0"
          style="margin-right: 20px"
          class="btn btn-info"
          @change="mySearchNoZero()"
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
    </vue-good-table>
    <br />
  </div>
</template>
<script>
import { VueGoodTable } from 'vue-good-table-next'
//import moment from 'moment'
import utility from '@/common/utility'
import axios from 'axios'

export default {
  name: 'Transaction',
  mixins: [utility],
  components: {
    VueGoodTable,
  },
  data() {
    return {
      loading: false,
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
      models: 'transactions',
      model: 'transaction',
      numberOfTodos: 0,
      colchecked: true,
      updaterec: false,
      infoprint: '',
      optprint: false,

      columns: [
        {
          label: 'Date created',
          field: 'created',
        },
        {
          label: 'Amount',
          field: 'amount',
          tdClass: 'text-right',
        },
        {
          label: 'Exchange_rate',
          field: 'exchange_rate',
          tdClass: 'text-right',
        },
        {
          label: 'Fee',
          field: 'fee',
          tdClass: 'text-right',
        },
        {
          label: 'Net',
          field: 'net',
          tdClass: 'text-right',
        },
        {
          label: 'Hiệu chỉnh',
          field: 'btnedit',
          html: true,
          tdClass: 'text-center',
          width: '90px', // Phải có 110 - btn +40
          //hidden: !this.optprint,
        },
      ],
    }
  },

  methods: {
    getTodos() {
      this.loading = true
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/${this.models}`)
        .then((response) => {
          this.loading = false
          this.todos = response.data.items
          //console.log(response.data)
          this.todos.forEach((item, index) => {
            item.amount = this.number_format(
              item['amount'] / item['exchange_rate'],
              0,
              ',',
              '.',
            )
            item.fee = this.number_format(
              item['fee'] / item['exchange_rate'],
              0,
              ',',
              '.',
            )
            item.net = this.number_format(
              item['net'] / item['exchange_rate'],
              0,
              ',',
              '.',
            )
            item.exchange_rate = this.number_format(
              (1 / item['exchange_rate']) * 100,
              0,
              ',',
              '.',
            )
            item.btnedit = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 href="javascript:void(0)"></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 href="javascript:void(0)"></a>`
            item.created = new Date(item.created * 1000)
              .toISOString()
              .replace(/T/, ' ')
              .replace(/\..+/, '')
            item.id = index + 1
          })
          //console.log(this.todos);
        })
        .then(() => {
          this.$toastr.success(
            'XuânMai-VueShop',
            'Transactions loaded Successfully',
          )
        })
        .catch((error) => {
          console.log(error)
          this.$toastr.error(
            'Internal Error 500',
            'The server encountered an unexpected condition.',
          )
        })
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
    mySreach(row, col, cellValue, searchTerm) {
      //placeholder: 'Nhập nội dung tìm hoặc >0',
      //searchFn: mySreach
      if (this.searchNoZero && !searchTerm) {
        searchTerm = '>0'
      }
      searchTerm = searchTerm.trim()
      if (searchTerm == '>0') return false
      return (
        row.company.indexOf(searchTerm) != -1 ||
        row.address.indexOf(searchTerm) != -1 ||
        row.maso.indexOf(searchTerm) != -1 ||
        row.ghichu.indexOf(searchTerm) != -1
      )
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
  /* font-size: 14px !important; */
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
