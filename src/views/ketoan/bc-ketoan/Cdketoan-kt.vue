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
                    <CInputGroupText>Mã tài sản Có</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('masc') }"
                      v-model="cdketoan.masc"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="8">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Tên tài sản Có</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('tentsc') }"
                      v-model="cdketoan.tentsc"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow>
                <CCol md="4">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Mã tài sản Nguồn</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('masn') }"
                      v-model="cdketoan.masn"
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="8">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Tên tài sản Nguồn</CInputGroupText>
                    <CFormInput
                      class="form-control"
                      :class="{ 'is-valid': testValidator('tentsn') }"
                      v-model="cdketoan.tentsn"
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
                  :disabled="!cdketoan.id"
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
      Cân đối Kế toán
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
      :rows="cdketoans"
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
  name: 'Cdketoan',
  mixins: [utility],
  components: {
    VueGoodTable,
    //moment,
  },
  data() {
    return {
      Validator: {
        masc: false,
        tentsc: false,
        masn: false,
        tentsn: false,
      },

      cdketoanB: {},
      cdketoans: [],
      todosSave: [],
      cdketoan: {
        id: '',
        masc: '',
        tentsc: '',
        masn: '',
        tentsn: '',
      },
      models: 'cdketoans',
      model: 'cdketoan',
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
          field: 'masc',
        },
        {
          label: 'Tên tài sản Có',
          field: 'tentsc',
        },
        {
          label: 'Cuối kỳ',
          field: 'tscc',
          tdClass: 'text-right',
        },
        {
          label: 'Đầu kỳ',
          field: 'tscd',
          tdClass: 'text-right',
        },
        {
          label: 'Mã số',
          field: 'masn',
        },
        {
          label: 'Tên tài sản Nợ',
          field: 'tentsn',
        },
        {
          label: 'Cuối kỳ',
          field: 'tsnc',
          tdClass: 'text-right',
        },
        {
          label: 'Đầu kỳ',
          field: 'tsnd',
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
        this.cdketoans = this.todosSave // hoàn lại
        this.todosSave = []
      } else {
        let temp = this.cdketoans.filter((row) => {
          return (
            row.tscc + row.tscd + row.tsnc + row.tsnd > 0 ||
            row.tscc + row.tscd + row.tsnc + row.tsnd < 0 ||
            row.tscc.toString().indexOf('.') != -1 ||
            row.tscd.toString().indexOf('.') != -1 ||
            row.tsnc.toString().indexOf('.') != -1 ||
            row.tsnd.toString().indexOf('.') != -1
          )
        })
        this.todosSave = this.cdketoans // Lưu
        this.cdketoans = temp
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
          row.tscc + row.tscd + row.tsnc + row.tsnd > 0 ||
          row.tscc + row.tscd + row.tsnc + row.tsnd < 0 ||
          row.tscc.toString().indexOf('.') != -1 ||
          row.tscd.toString().indexOf('.') != -1 ||
          row.tsnc.toString().indexOf('.') != -1 ||
          row.tsnd.toString().indexOf('.') != -1
        )
      return (
        row.masc.indexOf(searchTerm) != -1 ||
        row.masn.indexOf(searchTerm) != -1 ||
        row.tentsc.indexOf(searchTerm) != -1 ||
        row.tentsn.indexOf(searchTerm) != -1 ||
        row.tsnc.toString().indexOf(searchTerm) != -1 ||
        row.tsnd.toString().indexOf(searchTerm) != -1 ||
        row.tscc.toString().indexOf(searchTerm) != -1 ||
        row.tscd.toString().indexOf(searchTerm) != -1
      )
    },

    testValidator(field) {
      if (field == 'masc')
        return (this.Validator.masc = this.cdketoan.masc != '')
      if (field == 'masn')
        return (this.Validator.masn = this.cdketoan.masn != '')
      if (field == 'tentsc')
        return (this.Validator.tentsc = this.cdketoan.tentsc != '')
      if (field == 'tentsn')
        return (this.Validator.tentsn = this.cdketoan.tentsn != '')
      let passe =
        this.Validator.masc &&
        this.Validator.tentsc &&
        this.Validator.masn &&
        this.Validator.tentsn
      if (!passe) {
        this.$message({
          message: 'Vui lòng nhập đầy đủ thông tin.',
          type: 'warning',
        })
      }
      return passe
    },
    editTodo(index) {
      // Row chưa dùng
      this.restore() // Nếu đang sửa thì phục hồi Vì có thể sửa dòng khác
      var dat = this.cdketoans[index]
      this.cdketoan = dat // Cho sửa
      this.cdketoanB = {
        // Lưu Phải đổi tên FIELD MỚI OK
        id_: dat.id,
        masc_: dat.masc,
        tentsc_: dat.tentsc,
        masn_: dat.masn,
        tentsn_: dat.tentsn,
        index_: index,
      }
      this.updaterec = true
      this.$refs.createNew.innerHTML = '>> Close'
      window.scrollTo(0, 0)
    },
    restore() {
      //if(!this.updaterec ) return;   // Không cần dòng này
      if (!this.cdketoanB.id_) return
      var dat = this.cdketoanB // Phải đổi tên FIELD & dùng ['abc'] MỚI OK
      this.cdketoan['id'] = dat.id_
      this.cdketoan['masc'] = dat.masc_
      this.cdketoan['tentsc'] = dat.tentsc_
      this.cdketoan['masn'] = dat.masn_
      this.cdketoan['tentsn'] = dat.tentsn_
    },
    reset() {
      this.cdketoan = {
        id: '',
        masc: '',
        tentsc: '',
        tentsn: '',
        masn: '',
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
      //this.columns[5].hidden = !this.colchecked ;
      this.columns[8].hidden = !this.colchecked || this.optprint
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
    selectTodo(cdketoan) {
      this.cdketoans = cdketoan
    },
    readTodos() {
      //console.log(this);
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .post('/' + this.model, this.infoketoan)
        .then((data) => {
          this.cdketoans = data.data[this.model]
          this.numberOfProducts = this.cdketoans.length
          // console.log(data.data);
          this.cdketoans.forEach((item) => {
            item.tscd = this.number_format(item['tscd'], 0, ',', '.')
            item.tscc = this.number_format(item['tscc'], 0, ',', '.')
            item.tsnd = this.number_format(item['tsnd'], 0, ',', '.')
            item.tsnc = this.number_format(item['tsnc'], 0, ',', '.')
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
            this.cdketoans.splice(index, 1)
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
      if (!confirm('Are you sure to Create record ? ')) {
        return
      }
      if (!alert('Vui lòng liên hệ 0903917963...!! ')) return

      apiService
        .post(this.model, this.cdketoan)
        .then((r) => {
          if (r.status === 201) {
            var dat = r.data[this.model]
            //console.log(r.data)
            var tmp = {}
            tmp['id'] = dat.id
            tmp['tentsn'] = dat.tentsn
            tmp['tentsc'] = dat.tentsc
            tmp['masc'] = dat.masc
            tmp['masn'] = dat.masn
            //tmp['birthdate'] = moment(dat.birthdate).format('YYYY-MM-DD')
            tmp[
              'btnedit'
            ] = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
            this.cdketoans.push(tmp)
            this.updaterec = !(this.cdketoan.id === '') // Nếu Đang AddNew thì Nhập tiếp
            this.restore() // Nếu đang sửa thì phục hồi lại list
            this.setAddnew()
            this.$toastr.success('', 'CREATE chứng từ thành công.')
          } else {
            this.$toastr.warning('', 'CREATE chứng từ KHÔNG thành công.')
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

      var cdketoan = this.cdketoan
      apiService
        .patch(`${this.model}/${cdketoan.id}`, cdketoan)
        .then((r) => {
          if (r.status === 200) {
            this.updaterec = false // Đóng screen update
            this.cdketoanB = {}
            this.$toastr.success('', 'CẬP NHẬT chứng từ thành công.')
          }
        })
        .catch((err) => {
          this.$toastr.error('', 'CẬP NHẬT chứng từ KHÔNG thành công.')
          console.log(err)
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
    // console.log(this)

    //this.fromtodate = this.$jwtAcn.getDateTime()
    //this.infoketoan = this.$jwtAcn.getKetoan()
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
