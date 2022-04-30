<template>
  <div>
    <CRow v-if="updaterec">
      <CCol sm="12">
        <CCard>
          <CCardHeader style="font-size: 25px"> Cập nhật &#8482; </CCardHeader>
          <CCardBody>
            <CForm @submit.prevent="submitForm">
              <CRow>
                <CCol lg="7">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Công ty</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('company') }"
                      v-model="todo.company"
                    />
                  </CInputGroup>
                </CCol>
                <CCol lg="3">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>MST</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('maso') }"
                      v-model="todo.maso"
                    />
                  </CInputGroup>
                </CCol>
                <CCol lg="2">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Phone</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('phone1') }"
                      v-model="todo.phone1"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow>
                <CCol lg="7">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Địa chỉ</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('address') }"
                      v-model="todo.address"
                    />
                  </CInputGroup>
                </CCol>

                <CCol lg="5">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Ghi chú</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('ghichu') }"
                      v-model="todo.ghichu"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol lg="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Số TK</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('account') }"
                      v-model="todo.account"
                    />
                  </CInputGroup>
                </CCol>
                <CCol lg="5">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Ngân hàng</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('bank') }"
                      v-model="todo.bank"
                    />
                  </CInputGroup>
                </CCol>
                <CCol lg="3">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Tỉnh-TP</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('citibank') }"
                      v-model="todo.citibank"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <div class="form-group form-actions">
                <CButton
                  class="btn btn-info btn-sm"
                  @click="createTodo()"
                  :disabled="!isValid"
                  id="addnew"
                >
                  Add New </CButton
                >&nbsp;&nbsp;
                <CButton
                  class="btn btn-info btn-sm"
                  @click="updateTodo()"
                  :disabled="!todo.id || !isValid"
                  id="update"
                >
                  Update </CButton
                >&nbsp;&nbsp;
                <CButton
                  class="btn btn-outline-info btn-sm"
                  @click="restore()"
                  id="restore"
                >
                  >> Restore </CButton
                >&nbsp;&nbsp;
                <CButton
                  class="btn btn-outline-warning btn-sm"
                  @click="setAddnew()"
                  id="close"
                >
                  >> Close
                </CButton>

                <!-- <CButton type="submit" size="sm" color="success"><CIcon name="cil-check-circle"/> Submit</CButton>
                <CButton type="reset" size="sm" color="danger"><CIcon name="cil-ban"/> Reset</CButton> -->
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <br v-if="updaterec" />
    <h2 style="font-size: 25px; padding-left: 20px">
      Danh mục Khách hàng
      <a
        class="btn btn-outline-info btn-sm"
        style="float: right"
        id="createNew"
        ref="createNew"
        @click="setAddnew()"
      >
        ++ Create New</a
      >
      <a style="float: right">&nbsp;</a>
      <a
        class="btn btn-outline-info btn-sm"
        style="float: right"
        id="createexcel"
        ref="createexcel"
        @click="exportExcel()"
      >
        >> Excel</a
      >
    </h2>

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
        searchFn: myFunc,
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
import apiService from '@/common/api.service'
//import moment from 'moment'
import utility from '@/common/utility'

export default {
  name: 'Customer',
  mixins: [utility],
  components: {
    VueGoodTable,
    //moment,
  },
  data() {
    return {
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
        phone1: '',
        account: '',
        bank: '',
        citibank: '',
      },
      models: 'customers_',
      model: 'customer_',
      numberOfTodos: 0,
      colchecked: true,
      updaterec: false,
      infoprint: '',
      optprint: false,

      columns: [
        {
          label: 'Công ty',
          field: 'company',
        },
        {
          label: 'Địa chỉ',
          field: 'address',
        },
        {
          label: 'Mã số Thuế',
          field: 'maso',
        },
        {
          label: 'Ghi chú',
          field: 'birthdate',
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
    submitForm() {},
    myFunc(row, col, cellValue, searchTerm) {
      //placeholder: 'Nhập nội dung tìm hoặc >0',
      //searchFn: mySreach
      // if (this.searchNoZero && !searchTerm) {
      //   searchTerm = '>0'
      // }
      searchTerm = searchTerm.trim()
      if (searchTerm == '>0') return false
      return (
        row.company.indexOf(searchTerm) != -1 ||
        row.address.indexOf(searchTerm) != -1 ||
        row.maso.indexOf(searchTerm) != -1 ||
        row.ghichu.indexOf(searchTerm) != -1
      )
    },

    testValidator(field) {
      if (field == 'company')
        return (this.Validator.company = this.todo.company != '')
      if (field == 'address')
        return (this.Validator.address = this.todo.address != '')
      if (
        field == 'phone1' ||
        field == 'account' ||
        field == 'bank' ||
        field == 'citibank' ||
        field == 'ghichu'
      )
        return true
      if (field == 'maso') return (this.Validator.maso = this.todo.maso != '')
      let passe =
        this.Validator.company && this.Validator.address && this.Validator.maso
      if (!passe) {
        this.$toastr.warning(
          '',
          'Vui lòng nhập đầy đủ thông tin ( Mã số thuế 10-13 ký tự )',
        )
      }
      return passe
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
      return array
    },
    editTodo(index, dat) {
      // Row chưa dùng
      this.restore()
      this.todo = {
        id: dat.id,
        company: dat.company,
        address: dat.address,
        maso: dat.maso,
        ghichu: dat.ghichu,
        phone1: dat.phone1,
        account: dat.account,
        bank: dat.bank,
        citibank: dat.citibank,
        index: index,
      }
      Object.keys(this.todo).forEach((key) => {
        this.todoB[key + '_'] = this.todo[key]
      })
      this.updaterec = true
      window.scrollTo(0, 0)
    },
    restore() {
      if (this.todo.length != this.todoB.length) return
      Object.keys(this.todo).forEach((key) => {
        this.todo[key] = this.todoB[key + '_']
      })
    },
    updatelist() {
      Object.keys(this.todo).forEach((key) => {
        this.todos[this.todo.index][key] = this.todo[key]
      })
    },
    reset() {
      Object.keys(this.todo).forEach((key) => {
        this.todo[key] = ''
        this.todoB[key + '_'] = ''
      })
    },
    setAddnew() {
      this.updaterec = !this.updaterec
      if (this.updaterec) {
        this.reset()
        window.scrollTo(0, 0)
      } else this.restore()
    },
    // ==============> edit:   testValidator -  bỏ validation - thêm update->then - thêm watch()

    colOption() {
      //this.columns[5].hidden = !this.colchecked ;
      this.columns[4].hidden = !this.colchecked || this.optprint
    },

    onCellClick(params) {
      if (params.column.field == 'btnedit') {
        switch (params.event.srcElement.id) {
          case '1':
            this.editTodo(params.row.originalIndex, params.row)
            break
          case '2':
            this.deleteTodo(params.row.originalIndex, params.row)
            break
        }
      }
    },
    selectTodo(todo) {
      this.todos = todo
    },
    readTodos() {
      //console.log(this);
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .get('/' + this.models)
        .then((data) => {
          this.todos = data.data[this.models]
          this.numberOfProducts = this.todos.length
          //console.log(this.todos);
          this.todos.forEach((item) => {
            // this.$set(item, "sotien",this.number_format(item['sotien'],0,',','.'));
            // this.$set(item, "ngoaite",this.number_format(item['ngoaite'],2,',','.'));
            item.btnedit = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
          })
        })
        .then(() => {
          this.$store.commit('set', ['isLoading', false])
        })
        .catch((err) => {
          console.log(err)
          this.$store.commit('set', ['isLoading', false])
        })
    },

    deleteTodo(index, row) {
      if (
        !confirm('Are you sure to delete this record : ' + (index + 1) + ' ? ')
      ) {
        return
      }
      this.restore() // Nếu đang sửa thì phục hồi Vì có thể sửa dòng khác dòng xóa

      apiService
        .delete(`${this.model}/${row.id}`)
        .then((r) => {
          if (r.status === 204) {
            this.todos.splice(index, 1)
            this.$toastr.success('', 'DELETE chứng từ thành công.')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    createTodo() {
      if (!this.testValidator()) {
        return
      }
      apiService
        .post(this.model, this.todo)
        .then((r) => {
          if (r.status === 201) {
            var dat = r.data[this.model]
            console.log(r.data)
            var tmp = {}
            tmp['id'] = dat.id
            tmp['company'] = dat.company
            tmp['address'] = dat.address
            tmp['maso'] = dat.maso
            tmp['phone1'] = dat.phone1
            tmp['ghichu'] = dat.ghichu
            tmp['account'] = dat.account
            tmp['bank'] = dat.bank
            tmp['citibank'] = dat.citibank
            //tmp['birthdate'] = moment(dat.birthdate).format('YYYY-MM-DD')
            tmp[
              'btnedit'
            ] = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
            this.todos.push(tmp)
            this.updaterec = !(this.todo.id === '') // Nếu Đang AddNew thì Nhập tiếp
            this.restore() // Nếu đang sửa thì phục hồi lại list
            this.setAddnew()
            this.$toastr.success('', 'CREATE chứng từ thành công.')
          } else {
            this.$toastr.error('', 'CREATE chứng từ KHÔNG thành công.')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    updateTodo() {
      if (!this.testValidator()) {
        return
      }
      var newdata = this.todo
      apiService
        .patch(`${this.model}/${newdata.id}`, {
          id: newdata.id,
          company: newdata.company,
          address: newdata.address,
          maso: newdata.maso,
          phone1: newdata.phone1,
          ghichu: newdata.ghichu,
          account: newdata.account,
          bank: newdata.bank,
          citibank: newdata.citibank,
        })
        .then((r) => {
          if (r.status === 200) {
            this.updaterec = false // Đóng screen update
            this.updatelist()
            this.reset() // sau this.updatelist();
            this.$toastr.success('', 'CẬP NHẬT chứng từ thành công.')
          } else this.$toastr.warning('', 'CẬP NHẬT chứng từ KHÔNG thành công.')
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.error('', 'CẬP NHẬT chứng từ KHÔNG thành công.')
        })
    },

    exportExcel() {
      this.infoketoan['filename'] = 'DanhMucKhachHang.xlsx'
      this.infoketoan['sheetname'] = 'Danh mục khách hàng'
      this.infoketoan['urlget'] = 'customers_'
      this.infoketoan['fields'] = [
        'maso',
        'company',
        'address',
        'email',
        'phone1',
        'ghichu',
      ]
      this.infoketoan['sumcolumn'] = 0

      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .download('/dmketoanXLSX', this.infoketoan)
        .then(() => {
          this.$store.commit('set', ['isLoading', false])
        })
        .catch((error) => {
          this.$notify({
            title: 'error',
            message: 'ERROR Download file : ' + this.infoketoan.filename,
            type: 'error',
            duration: 3000,
          })
          console.log(error)
          this.$store.commit('set', ['isLoading', false])
        })
    },
  },
  created() {
    this.infoketoan = this.$jwtAcn.getKetoan()
  },

  mounted() {
    // this.getTodos(this.models);
    this.readTodos()
  },
  watch: {
    updaterec() {
      this.$refs.createNew.innerHTML = this.updaterec
        ? '>> Close'
        : '++ Create New'
    },
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
</style>
<style>
table.vgt-table {
  /* font-size: 14px !important; */
}
</style>
