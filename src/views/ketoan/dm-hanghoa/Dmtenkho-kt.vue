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
                    <CInputGroupText>Mã kho</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('makho') }"
                      v-model="todo.makho"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="8">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Tên gọi</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('tengoi') }"
                      v-model="todo.tengoi"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow>
                <CCol md="12">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Địa chỉ</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('diachi') }"
                      v-model="todo.diachi"
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
      Danh mục Kho hàng
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
    <br />
  </div>
</template>
<script>
import { VueGoodTable } from 'vue-good-table-next'
import apiService from '@/common/api.service'
//import moment from 'moment'
import utility from '@/common/utility'

export default {
  name: 'Dmtenkho',
  mixins: [utility],
  components: {
    VueGoodTable,
    //moment,
  },
  data() {
    return {
      Validator: {
        makho: false,
        tengoi: false,
        diachi: false,
      },
      todoB: {},
      todos: [],
      todo: {
        id: '',
        makho: '',
        tengoi: '',
        diachi: '',
      },
      models: 'dmtenkhos',
      model: 'dmtenkho',
      infoketoan: [],
      numberOfTodos: 0,
      colchecked: true,
      updaterec: false,
      infoprint: '',
      optprint: false,

      columns: [
        {
          label: 'Mã kho',
          field: 'makho',
        },
        {
          label: 'Tên gọi',
          field: 'tengoi',
        },
        {
          label: 'Địa chỉ',
          field: 'diachi',
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
      if (this.searchNoZero && !searchTerm) {
        searchTerm = '>0'
      }
      searchTerm = searchTerm.trim()
      if (searchTerm == '>0') return false
      return (
        row.makho.indexOf(searchTerm) != -1 ||
        row.tengoi.indexOf(searchTerm) != -1 ||
        row.diachi.indexOf(searchTerm) != -1
      )
    },

    testValidator(field) {
      if (field == 'makho')
        return (this.Validator.makho = this.todo.makho != '')
      if (field == 'tengoi')
        return (this.Validator.tengoi = this.todo.tengoi != '')
      if (field == 'diachi')
        return (this.Validator.diachi = this.todo.diachi != '')
      let passe =
        this.Validator.makho && this.Validator.tengoi && this.Validator.diachi
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
        makho: dat.makho,
        tengoi: dat.tengoi,
        diachi: dat.diachi,
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
      this.columns[3].hidden = !this.colchecked || this.optprint
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
            tmp['makho'] = dat.makho
            tmp['tengoi'] = dat.tengoi
            tmp['diachi'] = dat.diachi
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
      var todo = this.todo
      apiService
        .patch(`${this.model}/${todo.id}`, todo)
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
      this.infoketoan['filename'] = 'DanhMucKhoHang.xlsx'
      this.infoketoan['sheetname'] = 'Danh mục Kho hàng'
      this.infoketoan['urlget'] = 'dmtenkhos'
      this.infoketoan['fields'] = ['makho', 'tengoi', 'diachi']
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
      return {
        makho: !!this.todo.makho.trim(),
        tengoi: !!this.todo.tengoi.trim(),
        diachi: !!this.todo.diachi.trim(),
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
