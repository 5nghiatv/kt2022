<template>
  <div>
    <CRow v-if="updaterec">
      <CCol sm="12">
        <CCard>
          <CCardHeader style="font-size: 25px"> Cập nhật &#8482; </CCardHeader>
          <CCardBody>
            <CForm @submit.prevent="submitForm">
              <CRow>
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
                    <CInputGroupText>Email</CInputGroupText>
                    <CFormInput
                      :is-valid="testValidator('email')"
                      v-model="todo.email"
                    />
                  </CInputGroup>
                </CCol>
                <CCol col="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Mobile</CInputGroupText>
                    <CFormInput
                      :is-valid="testValidator('mobile')"
                      v-model="todo.mobile"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol lg="8">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Addr</CInputGroupText>
                    <CFormInput
                      :is-valid="testValidator('address')"
                      v-model="todo.address"
                    />
                  </CInputGroup>
                </CCol>
                <CCol lg="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Dob</CInputGroupText>
                    <CFormInput
                      :is-valid="true"
                      v-model="todo.dob"
                      type="date"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol col="5">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Position</CInputGroupText>
                    <CFormInput
                      :is-valid="testValidator('position')"
                      v-model="todo.position"
                    />
                  </CInputGroup>
                </CCol>
                <CCol col="2">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Gender</CInputGroupText>
                    <CFormInput :is-valid="true" v-model="todo.gender" />
                  </CInputGroup>
                </CCol>
                <CCol col="5">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Image</CInputGroupText>
                    <CFormInput :is-valid="true" v-model="todo.image" />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol col="8">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Datalist</CInputGroupText>
                    <CFormInput :is-valid="true" v-model="todo.datalist" />
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
      Users List
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
  </div>
</template>
<script>
import { VueGoodTable } from 'vue-good-table-next'
import apiService from '@/common/api.service'
import moment from 'moment'
import utility from '@/common/utility'

export default {
  name: 'user-kt',
  mixins: [utility],
  components: {
    VueGoodTable,
    //  eslint-disable-next-line
    moment,
  },
  data() {
    return {
      Validator: {
        email: false,
        username: false,
        position: false,
        mobile: false,
        address: false,
      },
      todoB: {},
      todos: [],
      todo: {
        id: '',
        mobile: '',
        dob: '',
        address: '',
        email: '',
        username: '',
        datalist: '',
        image: '',
        position: '',
        gender: '',
        newPassword: '',
      },
      models: 'usersqls',
      model: 'usersql',
      infoketoan: [],
      numberOfTodos: 0,
      colchecked: true,
      updaterec: false,
      infoprint: '',
      optprint: false,

      columns: [
        {
          label: 'UserName',
          field: 'username',
        },
        {
          label: 'Email',
          field: 'email',
        },
        {
          label: 'Mobile',
          field: 'mobile',
        },
        {
          label: 'DataList',
          field: 'datalist',
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
    testValidator(field) {
      if (field == 'email')
        return (this.Validator.email = this.todo.email != '')
      if (field == 'username')
        return (this.Validator.username = this.todo.username != '')
      if (field == 'position')
        return (this.Validator.position = this.todo.position != '')
      if (field == 'mobile')
        return (this.Validator.mobile = this.todo.mobile != '')
      if (field == 'address')
        return (this.Validator.address = this.todo.address != '')
      let passe =
        this.Validator.email &&
        this.Validator.username &&
        this.Validator.position &&
        this.Validator.mobile &&
        this.Validator.address
      if (!passe) {
        this.$toastr.warning('', 'Vui lòng nhập đầy đủ thông tin.')
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

    //====================
    editTodo(index, dat) {
      // Copy from
      this.restore()
      this.todo = {
        id: dat.id,
        email: dat.email,
        username: dat.username,
        datalist: dat.datalist,
        position: dat.position,
        image: dat.image,
        gender: dat.gender,
        mobile: dat.mobile,
        dob: dat.dob,
        address: dat.address,
        newPassword: '',
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
        .get('/' + this.models)
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
      this.todo.position = this.todo.position == null ? '' : this.todo.position
      this.todo.mobile = this.todo.mobile == null ? '' : this.todo.mobile
      var newdata = this.todo
      apiService
        .post(this.model, {
          /*ngay: moment(newdata.ngay).format('YYYY-MM-DD'),*/
          // id: newdata.id,
          email: newdata.email,
          username: newdata.username,
          datalist: newdata.datalist,
          position: newdata.position,
          gender: newdata.gender,
          image: newdata.image,
          mobile: newdata.mobile,
          dob: moment(newdata.dob).format('YYYY-MM-DD'),
          address: newdata.address,
          password: newdata.newPassword,
        })
        .then((r) => {
          if (r.status == 201) {
            newdata = r.data[this.model]
            newdata[
              'btnedit'
            ] = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
            this.todos.push(newdata)
            this.updaterec = !(this.todo.id === '') // Nếu Đang AddNew thì Nhập tiếp
            this.restore() // Nếu đang sửa thì phục hồi lại list
            this.setAddnew()
            this.$toastr.success('', 'CREATE chứng từ thành công.')
          } else {
            this.$toastr.error('', 'CREATE chứng từ KHÔNG thành công.')
          }
        })
        .catch((err) => {
          this.$toastr.error(
            'TẠO chứng từ KHÔNG thành công ( Do lỗi mạng hoặc email này đã được tạo hay chưa có Password...)',
          )
          console.log(err)
        })
    },
    updateTodo() {
      if (!this.testValidator()) {
        return
      }
      this.todo['gender'] = this.todo['gender'] ? this.todo['gender'] : 0
      this.todo.position = this.todo.position == null ? '' : this.todo.position
      this.todo.mobile = this.todo.mobile == null ? '' : this.todo.mobile
      var newdata = this.todo
      apiService
        .patch(`${this.model}/${newdata.id}`, {
          /*ngay: moment(newdata.ngay).format('YYYY-MM-DD'),*/ id: newdata.id,
          email: newdata.email,
          username: newdata.username,
          datalist: newdata.datalist,
          position: newdata.position,
          gender: newdata.gender,
          image: newdata.image,
          mobile: newdata.mobile,
          dob: moment(newdata.dob).format('YYYY-MM-DD'),
          address: newdata.address,
          password: newdata.password,
          newPassword: newdata.newPassword,
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
        email: !!this.todo.email.trim(),
        username: !!this.todo.username.trim(),
        position: !!this.todo.position.trim(),
        mobile: !!this.todo.mobile.trim(),
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
