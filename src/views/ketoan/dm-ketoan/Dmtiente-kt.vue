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
                    <CInputGroupText>Loại tiền</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('loaitien') }"
                      v-model="todo.loaitien"
                    />
                  </CInputGroup>
                </CCol>
                <CCol col="6">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Viết tắt</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('viettat') }"
                      v-model="todo.viettat"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow>
                <CCol col="6">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Tên gọi...</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('tengoi') }"
                      v-model="todo.tengoi"
                    />
                  </CInputGroup>
                </CCol>

                <CCol col="6">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Tỷ giá..</CInputGroupText>
                    <CFormInput
                      v-model="todo.tygia"
                      v-mask-decimal.br="2"
                      class="form-control is-valid"
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
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <br v-if="updaterec" />
    <h2 style="font-size: 25px; padding-left: 20px">
      Danh mục Tiền tệ
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
  name: 'Dmtiente',
  mixins: [utility],
  components: {
    VueGoodTable,
    //moment,
  },
  data() {
    return {
      Validator: {
        loaitien: false,
        tengoi: false,
        viettat: false,
        tygia: false,
      },
      todoB: {},
      todos: [],
      todo: {
        id: '',
        loaitien: '',
        tengoi: '',
        viettat: '',
        tygia: '',
      },
      models: 'dmtientes',
      model: 'dmtiente',
      infoketoan: [],
      numberOfTodos: 0,
      colchecked: true,
      updaterec: false,
      infoprint: '',
      optprint: false,

      columns: [
        {
          label: 'Loại tiền',
          field: 'loaitien',
        },
        {
          label: 'Tên gọi',
          field: 'tengoi',
        },
        {
          label: 'Viết tắt',
          field: 'viettat',
        },
        {
          label: 'Tỷ giá',
          field: 'tygia',
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
    submitForm() {},
    testValidator(field) {
      if (!this.todo.tygia) this.todo.tygia = '0'
      if (field == 'loaitien')
        return (this.Validator.loaitien = this.todo.loaitien != '')
      if (field == 'tengoi')
        return (this.Validator.tengoi = this.todo.tengoi != '')
      if (field == 'viettat')
        return (this.Validator.viettat = this.todo.viettat != '')
      let passe =
        this.Validator.loaitien &&
        this.Validator.tengoi &&
        this.Validator.viettat
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
    editTodo(index, dat) {
      // Row chưa dùng
      this.restore()
      this.todo = {
        id: dat.id,
        loaitien: dat.loaitien,
        tengoi: dat.tengoi,
        viettat: dat.viettat,
        tygia: dat.tygia,
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
            item.tygia = this.number_format(item['tygia'], 2, ',', '.')
            item.btnedit = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
            //this.$set(item, "birthdate",moment(item.birthdate).format('YYYY-MM-DD'))
            // this.$set(item, "id",index +1)
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
          /*ngay: moment(newdata.ngay).format('YYYY-MM-DD'),*/
          // id: newdata.id,
          loaitien: newdata.loaitien,
          tengoi: newdata.tengoi,
          viettat: newdata.viettat,
          tygia: newdata.tygia.split('.').join('').split(',').join('.'),
        })
        .then((r) => {
          if (r.status === 201) {
            newdata = r.data[this.model]
            //console.log(r.data)
            //tmp['birthdate'] = moment(dat.birthdate).format('YYYY-MM-DD')
            newdata.tygia = this.number_format(newdata.tygia, 2, ',', '.')
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
      apiService
        .patch(`${this.model}/${newdata.id}`, {
          /*ngay: moment(newdata.ngay).format('YYYY-MM-DD'),*/ id: newdata.id,
          loaitien: newdata.loaitien,
          tengoi: newdata.tengoi,
          viettat: newdata.viettat,
          tygia: newdata.tygia.split('.').join('').split(',').join('.'),
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
      this.infoketoan['filename'] = 'DanhMucTienTe.xlsx'
      this.infoketoan['sheetname'] = 'Danh mục Tiền tệ'
      this.infoketoan['urlget'] = 'dmtientes'
      this.infoketoan['fields'] = ['loaitien', 'tengoi', 'viettat', 'tygia']
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
      //this.newdmtiente.sotien = this.format_so(this.newdmtiente.sotien,0) ;
      //this.todo.tygia = this.format_so(this.todo.tygia,2) ;
      return {
        loaitien: !!this.todo.loaitien.trim(),
        tengoi: !!this.todo.tengoi.trim(),
        viettat: !!this.todo.viettat.trim(),
        tygia: !!this.todo.tygia.trim(),
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
