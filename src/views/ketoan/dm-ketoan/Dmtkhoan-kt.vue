<template>
  <div>
    <CRow v-if="updaterec">
      <CCol md="12">
        <CCard>
          <CCardHeader style="font-size: 25px"> Cập nhật &#8482; </CCardHeader>
          <CCardBody>
            <CForm @submit.prevent="submitForm">
              <CRow>
                <CCol md="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Số tài khoản</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('sotk') }"
                      v-model="todo.sotk"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="8">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Tên tài khoản</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('tentk') }"
                      v-model="todo.tentk"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow>
                <CCol col="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Nợ đầu năm</CInputGroupText>
                    <CFormInput
                      v-model="todo.nodn"
                      v-mask-decimal.br="0"
                      type="text"
                      class="form-control is-valid"
                    />
                  </CInputGroup>
                </CCol>

                <CCol col="4">
                  <div class="input-group" style="padding-bottom: 15px">
                    <div class="input-group-prepend">
                      <span class="input-group-text">Có đầu năm...</span>
                    </div>
                    <input
                      v-mask-decimal.br="0"
                      v-model="todo.codn"
                      type="text"
                      class="form-control is-valid"
                    />
                  </div>
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
      Danh mục Tài khoản
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
        infoFn: null,
        jumpFirstOrLast: true,
      }"
      :search-options="{
        enabled: true,
        trigger: 'enter',
        skipDiacritics: true,
        placeholder: 'Tìm nội dung (.)',
        searchFn: '',
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
          class="btn btn-warning"
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
import moment from 'moment'
import utility from '@/common/utility'

export default {
  name: 'Dmtkhoan',
  mixins: [utility],
  components: {
    VueGoodTable,
    //  eslint-disable-next-line
    moment,
  },
  data() {
    return {
      infoketoan: [],
      Validator: {
        sotk: false,
        tentk: false,
        nodn: true,
        codn: true,
      },
      todosSave: [],
      todoB: {},
      todos: [],
      todo: {
        id: '',
        sotk: '',
        tentk: '',
        nodn: '',
        codn: '',
      },
      models: 'dmtkhoans',
      model: 'dmtkhoan',
      numberOfTodos: 0,
      colchecked: true,
      updaterec: false,
      infoprint: '',
      optprint: false,

      columns: [
        {
          label: 'Số T.khoản',
          field: 'sotk',
        },
        {
          label: 'Tên tài khoản',
          field: 'tentk',
        },
        {
          label: 'Nợ đầu năm',
          field: 'nodn',
          tdClass: 'text-right',
        },
        {
          label: 'Có đầu năm',
          field: 'codn',
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
    mySearchNoZero2() {
      if (this.todosSave.length > 0) {
        this.todos = this.todosSave // hoàn lại
        this.todosSave = []
      } else {
        let temp = this.todos.filter((row) => {
          return row.nodn + row.codn > 0
        })
        this.todosSave = this.todos // Lưu
        this.todos = temp
      }
    },

    submitForm() {},
    testValidator(field) {
      if (!this.todo.nodn) this.todo.nodn = '0'
      if (!this.todo.codn) this.todo.codn = '0'

      if (field == 'sotk') return (this.Validator.sotk = this.todo.sotk != '')
      if (field == 'tentk')
        return (this.Validator.tentk = this.todo.tentk != '')
      let passe = this.Validator.sotk && this.Validator.tentk
      if (!passe) {
        this.$toastr.warning('', 'Vui lòng nhập đầy đủ thông tin.')
      }
      return passe
    },
    //====================
    editTodo(index, dat) {
      // Copy from
      this.restore()
      this.todo = {
        id: dat.id,
        sotk: dat.sotk,
        tentk: dat.tentk,
        nodn: dat.nodn,
        codn: dat.codn,
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
            item.nodn = this.number_format(item['nodn'], 0, ',', '.')
            item.codn = this.number_format(item['codn'], 0, ',', '.')
            item.btnedit = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
            //this.$set(item, "birthdate",moment(item.birthdate).format('YYYY-MM-DD'))
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
          //id: newdata.id,
          sotk: newdata.sotk,
          tentk: newdata.tentk,
          nodn: newdata.nodn.split('.').join('').split(',').join('.'),
          codn: newdata.codn.split('.').join('').split(',').join('.'),
          // ghichu: newdata.ghichu
        })
        .then((r) => {
          if (r.status === 201) {
            newdata = r.data[this.model]
            //tmp['birthdate'] = moment(dat.birthdate).format('YYYY-MM-DD')
            newdata.nodn = this.number_format(newdata.nodn, 0, ',', '.')
            newdata.codn = this.number_format(newdata.codn, 0, ',', '.')
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
          console.log(err)
        })
    },
    updateTodo() {
      if (!this.testValidator()) {
        return
      }
      var newdata = this.todo
      //this.todo.birthdate = moment(this.todo.birthdate).format('YYYY-MM-DD')
      apiService
        .patch(`${this.model}/${newdata.id}`, {
          id: newdata.id,
          sotk: newdata.sotk,
          tentk: newdata.tentk,
          nodn: newdata.nodn.split('.').join('').split(',').join('.'),
          codn: newdata.codn.split('.').join('').split(',').join('.'),
          // ghichu: newdata.ghichu
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
    //class="vgt-input vgt-pull-left"
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
      //    if(!this.todo.nodn) this.todo.nodn = '0' ;
      //    if(!this.todo.codn) this.todo.codn = '0' ;
      //console.log(this.todo.codn)
      //    this.todo.nodn = this.format_so(this.todo.nodn,0) ;
      //    this.todo.codn = this.format_so(this.todo.codn,0) ;
      return {
        sotk: !!this.todo.sotk.trim(),
        tentk: !!this.todo.tentk.trim(),
        /* email: emailRE.test(this.todo.email),*/
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
