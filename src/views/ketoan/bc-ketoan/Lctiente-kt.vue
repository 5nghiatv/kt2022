<template>
  <div>
    <CRow v-if="updaterec">
      <CCol sm="12">
        <CCard>
          <CCardHeader style="font-size: 25px"> Cập nhật &#8482; </CCardHeader>
          <CCardBody>
            <CForm @submit.prevent="submitForm">
              <CRow>
                <CCol md="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Mã số</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('maso') }"
                      v-model="lctiente.maso"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="8">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Chỉ tiêu</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('chitieu') }"
                      v-model="lctiente.chitieu"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow>
                <CCol md="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Thuyết minh</CInputGroupText>
                    <CFormInput
                      class="form-control is-valid"
                      v-model="lctiente.tminh"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="8">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Cách tính</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('cachtinh') }"
                      v-model="lctiente.cachtinh"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <div class="form-group form-actions">
                <CButton
                  class="btn btn-info btn-sm"
                  @click="createTodo()"
                  id="addnew"
                >
                  Add New </CButton
                >&nbsp;&nbsp;
                <CButton
                  class="btn btn-info btn-sm"
                  @click="updateTodo()"
                  :disabled="!lctiente.id"
                  id="update"
                  type="button"
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
      Lưu chuyển tiền tệ
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
    </CRow>

    <vue-good-table
      id="tableACN"
      :columns="columns"
      :rows="lctientes"
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
        placeholder: 'Tìm nội dung ( >0 )',
        searchFn: myFunc,
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
  name: 'Lctiente',
  mixins: [utility],
  components: {
    VueGoodTable,
    //moment,
  },
  data() {
    return {
      Validator: {
        maso: false,
        chitieu: false,
        cachtinh: false,
      },
      todosSave: [],
      lctienteB: {},
      lctientes: [],
      lctiente: {
        id: '',
        maso: '',
        chitieu: '',
        tminh: '',
        cachtinh: '',
        kytruoc: '',
        kynay: '',
      },
      models: 'lctientes',
      model: 'lctiente',
      numberOfTodos: 0,
      colchecked: false,
      updaterec: false,
      infoprint: '',
      optprint: false,
      fromtodate: [],
      infoketoan: [],
      columns: [
        {
          label: 'Mã số',
          field: 'maso',
          tdClass: 'text-center',
        },
        {
          label: 'Chỉ tiêu',
          field: 'chitieu',
        },
        {
          label: 'Thuyết Minh',
          field: 'tminh',
        },
        {
          label: 'Cách tính',
          field: 'cachtinh',
        },
        {
          label: 'Kỳ này',
          field: 'kynay',
          tdClass: 'text-right',
        },
        {
          label: 'Kỳ trước',
          field: 'kytruoc',
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
        this.lctientes = this.todosSave // hoàn lại
        this.todosSave = []
      } else {
        let temp = this.lctientes.filter((row) => {
          return (
            row.kytruoc + row.kynay > 0 ||
            row.kytruoc + row.kynay < 0 ||
            row.kynay.toString().indexOf('.') != -1 ||
            row.kytruoc.toString().indexOf('.') != -1
          )
        })
        this.todosSave = this.lctientes // Lưu
        this.lctientes = temp
      }
    },

    submitForm() {},
    myFunc(row, col, cellValue, searchTerm) {
      if (this.searchNoZero && !searchTerm) {
        searchTerm = '>0'
      }
      searchTerm = searchTerm.trim()
      if (searchTerm == '>0')
        return (
          row.kytruoc + row.kynay > 0 ||
          row.kytruoc + row.kynay < 0 ||
          row.kynay.toString().indexOf('.') != -1 ||
          row.kytruoc.toString().indexOf('.') != -1
        )
      return (
        row.maso.indexOf(searchTerm) != -1 ||
        row.chitieu.indexOf(searchTerm) != -1 ||
        row.tminh.indexOf(searchTerm) != -1 ||
        row.cachtinh.indexOf(searchTerm) != -1 ||
        row.kynay.toString().indexOf(searchTerm) != -1 ||
        row.kytruoc.toString().indexOf(searchTerm) != -1
      )
    },

    testValidator(field) {
      if (field == 'maso')
        return (this.Validator.maso = this.lctiente.maso != '')
      if (field == 'chitieu')
        return (this.Validator.chitieu = this.lctiente.chitieu != '')
      if (field == 'cachtinh')
        return (this.Validator.cachtinh = this.lctiente.cachtinh != '')
      let passe =
        this.Validator.maso && this.Validator.chitieu && this.Validator.cachtinh
      if (!passe) {
        this.$toastr.warning('', 'Vui lòng nhập đầy đủ thông tin.')
      }
      return passe
    },
    editTodo(index) {
      // Row chưa dùng
      this.restore() // Nếu đang sửa thì phục hồi Vì có thể sửa dòng khác
      var dat = this.lctientes[index]
      this.lctiente = dat // Cho sửa
      this.lctienteB = {
        // Lưu Phải đổi tên FIELD MỚI OK
        id_: dat.id,
        maso_: dat.maso,
        chitieu_: dat.chitieu,
        tminh_: dat.tminh,
        cachtinh_: dat.cachtinh,
        index_: index,
      }
      this.updaterec = true
      this.$refs.createNew.innerHTML = '>> Close'
      window.scrollTo(0, 0)
    },
    restore() {
      //if(!this.updaterec ) return;   // Không cần dòng này
      if (this.lctienteB.id_) return
      var dat = this.lctienteB // Phải đổi tên FIELD & dùng ['abc'] MỚI OK
      this.lctiente['id'] = dat.id_
      this.lctiente['maso'] = dat.maso_
      this.lctiente['chitieu'] = dat.chitieu_
      this.lctiente['tminh'] = dat.tminh_
      this.lctiente['cachtinh'] = dat.cachtinh_
    },
    reset() {
      this.lctiente = {
        id: '',
        maso: '',
        chitieu: '',
        cachtinh: '',
        tminh: '',
      }
    },
    setAddnew() {
      this.updaterec = !this.updaterec
      this.$refs.createNew.innerHTML = this.updaterec
        ? '>> Close'
        : '++ Create New'
      if (this.updaterec) {
        this.reset()
        window.scrollTo(0, 0)
      } else this.restore()
    },

    colOption() {
      this.columns[3].hidden = !this.colchecked
      this.columns[6].hidden = !this.colchecked || this.optprint
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
    selectTodo(lctiente) {
      this.lctientes = lctiente
    },
    readTodos() {
      //console.log(this);
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .post('/' + this.model, this.infoketoan)
        .then((data) => {
          this.lctientes = data.data[this.model]
          this.numberOfProducts = this.lctientes.length
          //console.log(this.lctientes);
          this.lctientes.forEach((item) => {
            item.kynay = this.number_format(item['kynay'], 0, ',', '.')
            item.kytruoc = this.number_format(item['kytruoc'], 0, ',', '.')
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
      if (!alert('Vui lòng liên hệ 0903917963...!! ')) return
      this.restore() // Nếu đang sửa thì phục hồi Vì có thể sửa dòng khác dòng xóa

      apiService
        .delete(`${this.model}/${row.id}`)
        .then((r) => {
          if (r.status === 204) {
            this.lctientes.splice(index, 1)
            this.$toastr.success('', 'DELETE chứng từ thành công.')
          }
        })
        .catch((err) => {
          this.$toastr.error('', 'DELETE chứng từ KHÔNG thành công.')
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
        .post(this.model, this.lctiente)
        .then((r) => {
          if (r.status === 201) {
            var dat = r.data[this.model]
            //console.log(r.data)
            var tmp = {}
            tmp['id'] = dat.id
            tmp['cachtinh'] = dat.cachtinh
            tmp['chitieu'] = dat.chitieu
            tmp['maso'] = dat.maso
            tmp['tminh'] = dat.tminh
            //tmp['birthdate'] = moment(dat.birthdate).format('YYYY-MM-DD')
            tmp[
              'btnedit'
            ] = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
            this.lctientes.push(tmp)
            this.updaterec = !(this.lctiente.id === '') // Nếu Đang AddNew thì Nhập tiếp
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

      var lctiente = this.lctiente
      apiService
        .patch(`${this.model}/${lctiente.id}`, lctiente)
        .then((r) => {
          if (r.status === 200) {
            this.updaterec = false // Đóng screen update
            this.lctienteB = {}
            this.$toastr.success('', 'CẬP NHẬT chứng từ thành công.')
          }
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.error('', 'CẬP NHẬT chứng từ KHÔNG thành công.')
        })
    },
    exportExcel() {
      this.$store.commit('set', ['isLoading', true])
      this.infoketoan['filename'] = 'TM-BC-TAICHINH.XLSX'
      this.$apiAcn
        .download('/baocaotc', this.infoketoan)
        .then(() => {
          this.$store.commit('set', ['isLoading', false])
        })
        .catch((error) => {
          this.$toastr.error(
            '',
            'ERROR Download file : ' + this.infoketoan.filename,
          )
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
    //console.log(this)
    //this.fromtodate = this.$jwtAcn.getDateTime()
    //this.infoketoan = this.$jwtAcn.getKetoan()
    //this.displayMessage();
    this.colOption()
    this.readTodos()
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
