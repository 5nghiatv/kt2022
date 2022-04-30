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
                    <CInputGroupText>Mã hàng</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('mahang') }"
                      v-model="todo.mahang"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="8">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Mã kho</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('makho') }"
                      v-model="todo.makho"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow>
                <CCol md="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Lượng đầu năm</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('luongdn') }"
                      v-model="todo.luongdn"
                      v-mask-decimal.br="2"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Tiền đầu năm</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('tiendn') }"
                      v-model="todo.tiendn"
                      v-mask-decimal.br="0"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Ngoại tệ</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('ngoaite') }"
                      v-model="todo.ngoaite"
                      v-mask-decimal.br="2"
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
      Nhập xuất tồn kho
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
        style="float: right; margin-right: 5px"
        id="createexcel"
        ref="createexcel"
        @click="exportExcel()"
      >
        >> Excel</a
      >

      <a
        class="btn btn-outline-info btn-sm"
        style="float: right; margin-right: 5px"
        @click="tinhcandoi('chuyensoduhang')"
      >
        Mang số dư</a
      >
      <a style="float: right">&nbsp;</a>
      <a
        class="btn btn-outline-info btn-sm"
        style="float: right"
        @click="tinhcandoi('tinhcandoihang')"
      >
        Tính cân đối</a
      >
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
      <CCol style="float: right">
        <CFormSelect
          style="width: 200px"
          title="Giới hạn chuyển in Excel"
          size="sm"
          class="mb-3"
          aria-label="Small select example"
          v-model="patern"
          :options="paternOptions"
        >
        </CFormSelect>
      </CCol>
    </CRow>

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
        placeholder: 'Tìm nội dung...',
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
  name: 'Dmkhohang',
  mixins: [utility],
  components: {
    VueGoodTable,
    //moment,
  },
  data() {
    return {
      paternOptions: [
        { label: '1- Có số dư & Phát sinh', value: '1' },
        { label: '2- Chỉ có Số dư', value: '2' },
        { label: '3- Chỉ có Phát sinh', value: '3' },
        { label: '4- Không phát sinh', value: '4' },
        { label: '5- Số dư Không hợp lệ', value: '5' },
        { label: '6- Toàn bộ danh mục', value: '6' },
      ],
      patern: '1- Có số dư & Phát sinh',
      infoketoan: [],
      Validator: {
        mahang: false,
        makho: false,
      },
      todosSave: [],
      todoB: {},
      todos: [],
      todo: {
        id: '',
        mahang: '',
        makho: '',
        luongdn: '',
        tiendn: '',
        ngoaite: '',
      },
      models: 'dmkhohags',
      model: 'dmkhohag',
      numberOfTodos: 0,
      colchecked: true,
      updaterec: false,
      infoprint: '',
      optprint: false,
      columns: [
        {
          label: 'Mã hàng',
          field: 'mahang',
        },
        {
          label: 'Mã kho',
          field: 'makho',
        },
        {
          label: 'Tên hàng',
          field: 'tenhang',
        },
        {
          label: 'Đơn vị',
          field: 'donvi',
        },
        {
          label: 'Lượng đầu năm',
          field: 'luongdn',
          tdClass: 'text-right',
        },
        {
          label: 'Tiền đầu năm',
          field: 'tiendn',
          tdClass: 'text-right',
        },
        {
          label: 'Lượng đầu kỳ',
          field: 'luongdk',
          tdClass: 'text-right',
        },
        {
          label: 'Tiền đầu kỳ',
          field: 'tiendk',
          tdClass: 'text-right',
        },
        {
          label: 'Lượng nhập',
          field: 'luongnhap',
          tdClass: 'text-right',
        },
        {
          label: 'Tiền nhập',
          field: 'tiennhap',
          tdClass: 'text-right',
        },
        {
          label: 'Lượng xuất',
          field: 'luongxuat',
          tdClass: 'text-right',
        },
        {
          label: 'Tiền xuất',
          field: 'tienxuat',
          tdClass: 'text-right',
        },
        {
          label: 'Lượng cuối kỳ',
          field: 'luongck',
          tdClass: 'text-right',
        },
        {
          label: 'Tiền cuối kỳ',
          field: 'tienck',
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
          return (
            row.luongdn +
              row.tiendn +
              row.luongdk +
              row.tiendk +
              row.luongnhap +
              row.tiennhap +
              row.luongxuat +
              row.tienxuat +
              row.luongck +
              row.tienck >
              0 ||
            (
              row.luongdn +
              row.tiendn +
              row.luongdk +
              row.tiendk +
              row.luongnhap +
              row.tiennhap +
              row.luongxuat +
              row.tienxuat +
              row.luongck +
              row.tienck
            )
              .toString()
              .indexOf('.') != -1
          )
        })
        this.todosSave = this.todos // Lưu
        this.todos = temp
      }
    },

    submitForm() {},
    tinhcandoi(whatCandoi) {
      if (whatCandoi != 'chuyensoduhang') return this.readTodos() // Phiên bản mới đã bao gồm tinhcandoihag - Cập nhật lại dmkhohang
      // Phải còn cho chuyensoduhang
      this.$apiAcn
        .post('/' + whatCandoi, {
          pd_fromdate: this.infoketoan.fromtodate.pd_fromdate,
          pd_todate: this.infoketoan.fromtodate.pd_todate,
        })
        .then((data) => {
          console.log(data.data[whatCandoi])
          this.readTodos() // Cập nhật lại dmkhohag
          this.$toastr.success('', 'Tính lại số dư thực hiện THÀNH CÔNG.')
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.error('', 'Tính lại số dư thực hiện KHÔNG thành công.')
        })
    },

    testValidator(field) {
      if (!this.todo.luongdn) this.todo.luongdn = '0'
      if (!this.todo.tiendn) this.todo.tiendn = '0'
      if (!this.todo.ngoaite) this.todo.ngoaite = '0'

      if (field == 'mahang')
        return (this.Validator.mahang = this.todo.mahang != '')
      if (field == 'makho')
        return (this.Validator.makho = this.todo.makho != '')
      let passe = this.Validator.mahang && this.Validator.makho
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
        mahang: dat.mahang,
        makho: dat.makho,
        luongdn: dat.luongdn,
        tiendn: dat.tiendn,
        ngoaite: dat.ngoaite,
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
      this.columns[2].hidden = this.colchecked || this.optprint
      this.columns[3].hidden = this.colchecked || this.optprint
      this.columns[14].hidden = this.colchecked || this.optprint
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
      //console.log(this.infoketoan, this.models);
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .post('/' + this.models, this.infoketoan)
        .then((data) => {
          //console.log(data)
          this.todos = data.data[this.models]
          //this.numberOfProducts = this.todos.length ;
          this.todos.forEach((item) => {
            item.luongdn = this.number_format(item['luongdn'], 2, ',', '.')
            item.tiendn = this.number_format(item['tiendn'], 0, ',', '.')
            item.luongdk = this.number_format(item['luongdk'], 2, ',', '.')
            item.tiendk = this.number_format(item['tiendk'], 0, ',', '.')
            item.luongck = this.number_format(item['luongck'], 2, ',', '.')
            item.tienck = this.number_format(item['tienck'], 0, ',', '.')
            item.luongnhap = this.number_format(item['luongnhap'], 2, ',', '.')
            item.tiennhap = this.number_format(item['tiennhap'], 0, ',', '.')
            item.luongxuat = this.number_format(item['luongxuat'], 2, ',', '.')
            item.tienxuat = this.number_format(item['tienxuat'], 0, ',', '.')
            item.btnedit = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
          })
          this.$store.commit('set', ['isLoading', false])
        })
        .then(() => {
          //console.log(this.todos)
        })
        .catch((err) => {
          console.log('error', err)
          this.$store.commit('set', ['isLoading', false])
        })
    },
    deleteTodo(index, row) {
      if (
        !confirm('Are you sure to delete this record : ' + (index + 1) + ' ? ')
      ) {
        return
      }
      if (!alert('Vui lòng liên hệ 0903917963...!! ')) return

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
      if (!confirm('Are you sure to Create record ? ')) {
        return
      }
      if (!alert('Vui lòng liên hệ 0903917963...!! ')) return

      apiService
        .post(this.model, this.todo)
        .then((r) => {
          if (r.status === 201) {
            var dat = r.data[this.model]
            //console.log(r.data)
            var tmp = {}
            tmp['id'] = dat.id
            tmp['makho'] = dat.makho
            tmp['mahang'] = dat.mahang
            tmp['luongdn'] = dat.luongdn
            tmp['tiendn'] = dat.tiendn
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
      if (!confirm('Are you sure to update record ? ')) {
        return
      }
      if (!alert('Vui lòng liên hệ 0903917963...!! ')) return

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
      this.$store.commit('set', ['isLoading', true])
      this.infoketoan['filename'] = 'NhapXuatTonKho.xlsx'
      this.infoketoan['patern'] = this.patern
      this.$apiAcn
        .download('/candoihhXLSX', this.infoketoan)
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
    // alert('/'+this.model+'/'+ this.pd_fromdate.substr(0, 4))
    this.readTodos() // sau khi có pd_fromdate
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
        mahang: !!this.todo.mahang.trim(),
        makho: !!this.todo.makho.trim(),
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
