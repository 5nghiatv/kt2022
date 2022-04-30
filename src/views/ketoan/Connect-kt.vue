<template>
  <div>
    <CRow v-if="updaterec">
      <CCol sm="12">
        <CCard>
          <CCardHeader style="font-size: 25px"> Cập nhật &#8482; </CCardHeader>
          <CCardBody>
            <CForm @submit.prevent="submitForm">
              <CRow>
                <CCol col="6">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Company</CInputGroupText>
                    <CFormInput
                      :is-valid="testValidator('company')"
                      v-model="todo.company"
                      ref="focus_todo"
                    />
                  </CInputGroup>
                </CCol>
                <CCol col="6">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Address</CInputGroupText>
                    <CFormInput :is-valid="true" v-model="todo.address" />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol col="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Tax Code.</CInputGroupText>
                    <CFormInput
                      :is-valid="testValidator('taxcode')"
                      v-model="todo.taxcode"
                    />
                  </CInputGroup>
                </CCol>
                <CCol col="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Host</CInputGroupText>
                    <CFormInput
                      :is-valid="testValidator('host')"
                      v-model="todo.host"
                    />
                  </CInputGroup>
                </CCol>
                <CCol col="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Port..</CInputGroupText>
                    <CFormInput :is-valid="true" v-model="todo.port" />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow>
                <CCol col="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Database</CInputGroupText>
                    <CFormInput
                      :is-valid="testValidator('dataname')"
                      v-model="todo.dataname"
                    />
                  </CInputGroup>
                </CCol>
                <CCol col="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>User</CInputGroupText>
                    <CFormInput
                      :is-valid="testValidator('username')"
                      v-model="todo.username"
                    />
                  </CInputGroup>
                </CCol>
                <CCol col="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Pasw</CInputGroupText>
                    <CFormInput
                      :is-valid="testValidator('password')"
                      v-model="todo.password"
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
      Kết nối Dữ liệu
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
  name: 'connect',
  mixins: [utility],
  components: {
    VueGoodTable,
    //moment,
  },
  data() {
    return {
      Validator: {
        host: false,
        username: false,
        dataname: false,
        password: false,
        company: false,
        taxcode: false,
      },
      todoB: {},
      todos: [],
      todo: {
        id: '',
        company: '',
        taxcode: '',
        address: '',
        host: '',
        username: '',
        password: '',
        dataname: '',
        port: '',
        active: '',
        fromdate: '',
        todate: '',
      },
      models: 'connectsqls',
      model: 'connectsql',
      infoketoan: [],
      numberOfTodos: 0,
      colchecked: true,
      updaterec: false,
      infoprint: '',
      optprint: false,
      todosSave: [],

      columns: [
        {
          label: 'Công ty',
          field: 'company',
        },
        {
          label: 'Mã số Thuế',
          field: 'taxcode',
        },
        {
          label: 'host',
          field: 'host',
        },
        {
          label: 'Database Name',
          field: 'dataname',
        },
        {
          label: 'UserName',
          field: 'username',
        },
        {
          label: 'Password',
          field: 'password',
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
    mySearchNoZero2() {
      if (this.todosSave.length > 0) {
        this.todos = this.todosSave // hoàn lại
        this.todosSave = []
      } else {
        let temp = this.todos.filter((doc) => {
          return doc.company.indexOf('Công ty') != -1
        })
        this.todosSave = this.todos // Lưu
        this.todos = temp
      }
    },
    submitForm() {},
    testValidator(field) {
      if (field == 'host') return (this.Validator.host = this.todo.host != '')
      if (field == 'username')
        return (this.Validator.username = this.todo.username != '')
      if (field == 'password')
        return (this.Validator.password = this.todo.password != '')
      if (field == 'dataname')
        return (this.Validator.dataname = this.todo.dataname != '')
      if (field == 'company')
        return (this.Validator.company = this.todo.company != '')
      if (field == 'taxcode')
        return (this.Validator.taxcode = this.todo.taxcode != '')
      let passe =
        this.Validator.host &&
        this.Validator.username &&
        this.Validator.dataname &&
        this.Validator.password &&
        this.Validator.company &&
        this.Validator.taxcode
      if (!passe) {
        this.$message({
          message: 'Vui lòng nhập đầy đủ thông tin.',
          type: 'warning',
        })
      }
      return passe
    },

    //====================
    editTodo(index, dat) {
      // Copy from
      this.restore()
      this.todo = {
        id: dat.id,
        host: dat.host,
        username: dat.username,
        dataname: dat.dataname,
        password: dat.password,
        port: dat.port,
        company: dat.company,
        taxcode: dat.taxcode,
        address: dat.address,
        index: index,
      }
      Object.keys(this.todo).forEach((key) => {
        this.todoB[key + '_'] = this.todo[key]
      })
      this.updaterec = true
      window.scrollTo(0, 0)
      //$('#focus_todo').trigger('focus')
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
        //$('#focus_todo').trigger('focus')
      } else this.restore()
    },
    // ==============> edit:   testValidator -  validation - update->then - thêm watch()

    colOption() {
      //this.columns[5].hidden = !this.colchecked ;
      this.columns[4].hidden = !this.colchecked || this.optprint

      //$(".vgt-input").val('01');
      // $(".footer__navigation__page-info__current-entry").val(22) ;
      // $('.footer__navigation__page-info__current-entry').trigger( jQuery.Event( 'keydown', { which: 13 } ) );
      // if(!$(".vgt-input").val())  $(".vgt-input").val('02')
      // console.log($(".vgt-input").val())
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
    readTodos() {
      //console.log(this);
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .put('/' + this.models, { mongodb_Sql: true })
        .then((data) => {
          this.todos = data.data[this.models]
          this.numberOfProducts = this.todos.length
          //console.log(this.todos);
          this.todos.forEach((item) => {
            item.btnedit = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
            //this.$set(item, "birthdate",moment(item.birthdate).format('YYYY-MM-DD'))
            // this.$set(item, "id",index +1)
          })
        })
        .then(() => {
          this.$toastr.success('', 'Loading chứng từ thành công.')
          this.$store.commit('set', ['isLoading', false])
        })
        .catch((err) => {
          console.log(err)
          this.$store.commit('set', ['isLoading', false])
          this.$toastr.error('', 'Loading chứng từ KHÔNG thành công.')
        })
    },

    deleteTodo(index, row) {
      if (!confirm('Xác nhận muốn xóa chứng từ : ' + (index + 1) + ' ? ')) {
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
          this.$toastr.error('', 'DELETE chứng từ KHÔNG thành công.')
        })
    },
    createTodo() {
      if (!this.testValidator()) {
        return
      }
      var newdata = this.todo
      apiService
        .post(this.model, {
          /*ngay: moment(newdata.ngay).format('YYYY-MM-DD'),*/
          // id: newdata.id,
          host: newdata.host,
          username: newdata.username,
          dataname: newdata.dataname,
          port: newdata.port ? newdata.port : '3306',
          password: newdata.password,
          company: newdata.company,
          taxcode: newdata.taxcode,
          address: newdata.address,
        })
        .then((r) => {
          if (r.status === 201) {
            newdata = r.data[this.model]
            newdata[
              'btnedit'
            ] = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
            this.todos.push(newdata)
            this.updaterec = !(this.todo.id === '') // Nếu Đang AddNew thì Nhập tiếp
            this.restore() // Nếu đang sửa thì phục hồi lại list
            this.setAddnew()
            this.$toastr.success('', 'TẠO chứng từ thành công.')
          } else {
            this.$toastr.error('', 'TẠO chứng từ KHÔNG thành công.')
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
      this.todo['port'] = this.todo['port'] ? this.todo['port'] : 3306
      var newdata = this.todo
      apiService
        .patch(`${this.model}/${newdata.id}`, {
          /*ngay: moment(newdata.ngay).format('YYYY-MM-DD'),*/ id: newdata.id,
          host: newdata.host,
          username: newdata.username,
          dataname: newdata.dataname,
          port: newdata.port,
          password: newdata.password,
          company: newdata.company,
          taxcode: newdata.taxcode,
          address: newdata.address,
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
      this.infoketoan['filename'] = 'DanhMucTaiKhoan.xlsx'
      this.infoketoan['sheetname'] = 'Danh mục tài khoản'
      this.infoketoan['urlget'] = 'dmtkhoans'
      this.infoketoan['fields'] = ['sotk', 'tentk', 'nodn', 'codn', 'ghichu']
      this.infoketoan['sumcolumn'] = 1

      this.$store.commit('set', ['isLoading', true])
      //this.$apiAcn.download('/dmtkhoanXLSX',this.infoketoan)
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
    this.colOption()
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
      //this.newconnect.sotien = this.format_so(this.newconnect.sotien,0) ;
      return {
        host: !!this.todo.host.trim(),
        username: !!this.todo.username.trim(),
        dataname: !!this.todo.dataname.trim(),
        password: !!this.todo.password.trim(),
        company: !!this.todo.company.trim(),
        taxcode: !!this.todo.taxcode.trim(),
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
