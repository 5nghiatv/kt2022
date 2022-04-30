<template>
  <CRow>
    <CCol :md="12">
      <CCard class="mb-4">
        <CCardHeader> Danh sách người dùng </CCardHeader>
        <CCardBody>
          <CTable align="middle" class="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell class="text-center">
                  <CIcon name="cil-people" />
                </CTableHeaderCell>
                <CTableHeaderCell>User</CTableHeaderCell>
                <CTableHeaderCell class="text-center">Country</CTableHeaderCell>
                <CTableHeaderCell>Usage</CTableHeaderCell>
                <CTableHeaderCell class="text-center"
                  >Payment Method</CTableHeaderCell
                >
                <CTableHeaderCell>Activity</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="item in tableExample" :key="item.name">
                <CTableDataCell class="text-center">
                  <CAvatar
                    size="md"
                    :src="item.avatar.src"
                    :status="item.avatar.status"
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <div>{{ item.user.name }}</div>
                  <div class="small text-medium-emphasis">
                    <span>{{ item.user.new ? 'New' : 'Recurring' }}</span> |
                    {{ item.user.registered }}
                  </div>
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CIcon
                    size="xl"
                    :name="item.country.flag"
                    :title="item.country.name"
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <div class="clearfix">
                    <div class="float-start">
                      <strong>{{ item.usage.value }}%</strong>
                    </div>
                    <div class="float-end">
                      <small class="text-medium-emphasis">
                        {{ item.usage.period }}
                      </small>
                    </div>
                  </div>
                  <CProgress
                    thin
                    :color="item.usage.color"
                    :value="item.usage.value"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CIcon size="xl" :name="item.payment.icon" />
                </CTableDataCell>
                <CTableDataCell>
                  <div class="small text-medium-emphasis">Last login</div>
                  <strong>{{ item.activity }}</strong>
                </CTableDataCell>
              </CTableRow>
              <CTableRow> </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  <CRow>
    <CCol :md="12">
      <CCard class="mb-4">
        <CCardBody>
          <SmartTableUsers />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  <!-- <CRow>
    <CCol :md="12">
      <CCard class="mb-4">
        <CCardBody>
          <SmartTablecdKetoan />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow> -->
</template>

<script>
//import avatar1 from '/public/img/avatars/1.jpg'
import avatar1 from '@/assets/images/avatars/1.jpg'
import avatar2 from '@/assets/images/avatars/2.jpg'
import avatar3 from '@/assets/images/avatars/3.jpg'
import avatar4 from '@/assets/images/avatars/4.jpg'
import avatar5 from '@/assets/images/avatars/5.jpg'
import avatar6 from '@/assets/images/avatars/6.jpg'
//import { useStore } from 'vuex'
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'
//import { onBeforeMount, onMounted, ref, inject } from "vue"
import { mapState } from 'vuex'
import SmartTableUsers from './SmartTableUsers'
//import SmartTablecdKetoan from './SmartTablecdKetoan'

export default {
  name: 'Users',
  components: {
    SmartTableUsers,
    //SmartTablecdKetoan,
  },
  data() {
    return {
      googletheme: '',
      models: 'users',
      todos: [],
      path: '',
    }
  },
  computed: {
    ...mapState(['theme']),
  },
  watch: {
    theme() {
      this.googletheme = this.theme === 'default' ? '' : 'nocturnal'
    },
  },

  setup() {
    //const store = useStore()
    onMounted(async () => {
      //await store.dispatch('myDocument/GET_DM_KHOHANG')
      // console.log(
      //   2000,
      //   'onMounted on Dashboard! in setup()',
      //   'GET_DM_KHOHANG',
      //   store.state.myDocument.danhmucKhohang,
      // )
    })
    onUpdated(() => {
      //console.log('updated!')
    })
    onUnmounted(() => {
      //console.log('unmounted!')
    })

    // store.state.myDocument.danhmucKhohang.forEach((item) => {
    //   console.log(item)
    // })

    // watch(
    //   () => store.state.myDocument.danhmucKhohang,
    //   function () {
    //     console.log(
    //       2000,
    //       'value changes detected',
    //       store.state.myDocument.danhmucKhohang,
    //     )
    //   },
    // )

    const progressGroupExample1 = [
      { title: 'Monday', value1: 34, value2: 78 },
      { title: 'Tuesday', value1: 56, value2: 94 },
      { title: 'Wednesday', value1: 12, value2: 67 },
      { title: 'Thursday', value1: 43, value2: 91 },
      { title: 'Friday', value1: 22, value2: 73 },
      { title: 'Saturday', value1: 53, value2: 82 },
      { title: 'Sunday', value1: 9, value2: 69 },
    ]
    const progressGroupExample2 = [
      { title: 'Male', icon: 'cil-user', value: 53 },
      { title: 'Female', icon: 'cil-user-female', value: 43 },
    ]
    const progressGroupExample3 = [
      {
        title: 'Organic Search',
        icon: 'cib-google',
        percent: 56,
        value: '191,235',
      },
      { title: 'Facebook', icon: 'cib-facebook', percent: 15, value: '51,223' },
      { title: 'Twitter', icon: 'cib-twitter', percent: 11, value: '37,564' },
      { title: 'LinkedIn', icon: 'cib-linkedin', percent: 8, value: '27,319' },
    ]

    // ==========================================>>>>  Phải có ref()
    const tableExample = ref([
      {
        avatar: { src: avatar1, status: 'success' },
        user: {
          name: 'Yiorgos Avraamu',
          new: true,
          registered: 'Jan 1, 2021',
        },
        country: { name: 'USA', flag: 'cif-us' },
        usage: {
          value: 50,
          period: 'Jun 11, 2021 - Jul 10, 2021',
          color: 'success',
        },
        payment: { name: 'Mastercard', icon: 'cib-cc-mastercard' },
        activity: '10 sec ago',
      },
      {
        avatar: { src: avatar2, status: 'danger' },
        user: {
          name: 'Avram Tarasios',
          new: false,
          registered: 'Jan 1, 2021',
        },
        country: { name: 'Brazil', flag: 'cif-br' },
        usage: {
          value: 22,
          period: 'Jun 11, 2021 - Jul 10, 2021',
          color: 'info',
        },
        payment: { name: 'Visa', icon: 'cib-cc-visa' },
        activity: '5 minutes ago',
      },
      {
        avatar: { src: avatar3, status: 'warning' },
        user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
        country: { name: 'India', flag: 'cif-in' },
        usage: {
          value: 74,
          period: 'Jun 11, 2021 - Jul 10, 2021',
          color: 'warning',
        },
        payment: { name: 'Stripe', icon: 'cib-cc-stripe' },
        activity: '1 hour ago',
      },
      {
        avatar: { src: avatar4, status: 'secondary' },
        user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
        country: { name: 'France', flag: 'cif-fr' },
        usage: {
          value: 98,
          period: 'Jun 11, 2021 - Jul 10, 2021',
          color: 'danger',
        },
        payment: { name: 'PayPal', icon: 'cib-cc-paypal' },
        activity: 'Last month',
      },
      {
        avatar: { src: avatar5, status: 'success' },
        user: {
          name: 'Agapetus Tadeáš',
          new: true,
          registered: 'Jan 1, 2021',
        },
        country: { name: 'Spain', flag: 'cif-es' },
        usage: {
          value: 22,
          period: 'Jun 11, 2021 - Jul 10, 2021',
          color: 'primary',
        },
        payment: { name: 'Google Wallet', icon: 'cib-cc-apple-pay' },
        activity: 'Last week',
      },
      {
        avatar: { src: avatar6, status: 'danger' },
        user: {
          name: 'Friderik Dávid',
          new: true,
          registered: 'Jan 1, 2021',
        },
        country: { name: 'Poland', flag: 'cif-pl' },
        usage: {
          value: 43,
          period: 'Jun 11, 2021 - Jul 10, 2021',
          color: 'success',
        },
        payment: { name: 'Amex', icon: 'cib-cc-amex' },
        activity: 'Last week',
      },
    ])

    return {
      tableExample,
      progressGroupExample1,
      progressGroupExample2,
      progressGroupExample3,
    }
  },
  methods: {
    backupData(url) {
      this.$apiAcn.get('/getenv/process.env.DB_DATABASE').then((ret) => {
        //console.log(ret.data.connect_config)
        var connect = ret.data.connect_config
        url.includes('Table')
        this.infoketoan['filename'] =
          (url.includes('Table') ? 'Backup-' : 'Backups-') +
          connect.database +
          '.zip'
        this.$store.commit('set', ['isLoading', true])
        //this.$apiAcn.download('/'+url,this.infoketoan)
        var mess = url.includes('restore') ? 'Phục hồi' : 'Sao lưu'
        this.$apiAcn
          .get('/' + url, this.infoketoan)
          .then((ret) => {
            // console.log(1,'xong roi',ret)
            if (ret.status === 200) {
              //this.$message({ title: 'Success', message: 'Thực hiện < '+mess+' > Dữ liệu thành công ...', type: 'success' ,duration: 3000 })
              this.$toastr.success(
                '',
                'Thực hiện < ' + mess + ' > Dữ liệu thành công.',
              )
            } else {
              this.$toastr.warning(
                '',
                'Thực hiện < ' + mess + ' > Dữ liệu KHÔNG thành công.',
              )
            }
            this.$store.commit('set', ['isLoading', false])
            this.$router.replace('/dashboard')
          })
          .catch((error) => {
            mess = 'Thực hiện < ' + mess + ' > Dữ liệu KHÔNG thành công.'
            mess =
              error.response.status === 503
                ? mess +
                  '(Tập tin: ' +
                  (error.response.data.message || error.message) +
                  ')'
                : mess
            this.$toastr.warning('', mess)
            this.$store.commit('set', ['isLoading', false])
            console.log(error.response.status, error.status)
            this.$router.replace('/dashboard')
          })
      })
    },
    getTodos() {
      // apiService.getTodos(this.models).then((data) => {
      //this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .get(this.models)
        .then((data) => {
          //console.log(data.data)
          this.items =
            typeof data.data['usersqls'] != 'undefined'
              ? data.data['usersqls']
              : data.data.users
          this.items.forEach((item, index) => {
            //this.$set(item, "avatar",{ url: 'img/avatars/1.jpg', status: 'success' })
            let ite = this.tableItems[Math.floor(index % 6)]
            let item2 = {
              avatar: ite.avatar,
              user: {
                name: item.username,
                new: item.admin,
                registered: item.email,
              },
              country: ite.country,
              usage: ite.usage,
              payment: ite.payment,
              activity: ite.activity,
            }
            this.tableItems2.push(item2)
            // this.$store.state.isLoading = false ;
          })
        })
        .then(() => {
          //console.log(this.tableItems2)
          //this.$store.commit('set', ['isLoading', false ])
          //this.$toastr.success("",'Thực hiện THÀNH CÔNG...');
        })
        .catch((error) => {
          this.$toastr.error('', 'Không nhận được dữ liệu từ máy chủ.')
          // this.$notify({ title: 'error', message: 'Get Data ERROR ...', type: 'error', duration: 3000 })
          console.log(error)
        })
    },
    //=====================================
    vfpUpload() {
      this.$router.replace('/users/0') // luôn trở về default tránh liên tục
      if (
        !confirm(
          'Thực hiện upload phần mềm Kế toán VFP ( từ ./public/vfp-data/data/dataXX ) sang Kế toán Vue-Nodejs ( database ketoan_upload ) ?',
        )
      ) {
        return //this.$router.replace('/dashboard')
      }
      var respond = prompt(
        'Chứng từ upload thuộc năm đầu: Data(??) hoặc năm kế tiếp: Data(??+) ',
        '**',
      )
      if (!respond) {
        return this.$toastr.warning(
          '',
          'Thư mục không được chọn, chương trình kết thúc.',
        )
      }
      this.infoketoan['firstYear'] = !respond.includes('+')
      respond = respond.replace('+', '')
      this.infoketoan['path'] = './data/vfp/data/data' + respond

      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .post('vfpupload', this.infoketoan)
        .then((dat) => {
          this.$store.commit('set', ['isLoading', false])
          if (dat.status == 218) {
            console.log(dat.data)
            this.$toastr.warning('', dat.data.message)
          } else
            this.$toastr.success('', 'Upload from Vfp thực hiện THÀNH CÔNG.')
        })
        .catch((error) => {
          this.$store.commit('set', ['isLoading', false])
          this.$toastr.error('', 'Upload from Vfp KHÔNG thành công.')
          console.log(error)
        })
        .then(() => {
          this.$router.replace('/dashboard')
        })
    },
    uynhiemchi() {
      this.$router.replace('/users/0') // luôn trở về default tránh liên tục
      var sotien = prompt('Nhập số tiền ủy nhiệm chi ?')
      if (!sotien) return
      var unc = {
        filename: 'UyNhiemChi.xlsx', // Phải CÓ
        ngay: new Date(),
        sotk: '003947450002',
        tentk: 'DNTN Tin học Xuân Mai',
        address: '118/63 Bạch Đằng, P24, Bình Thạnh -HCM',
        bank: 'Đông Á - Sở Giao dịch HCM',
        sotk2: '0531002130846',
        tentk2: 'Trần Văn Nghĩa',
        address2: '118/63 Bạch Đằng, P24, Bình Thạnh -HCM',
        bank2: 'VCB Chi Nhánh Đông Sài Gòn',
        sotien: sotien * 1,
        noidung: 'Thanh toán giao khoán',
      }
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .download('/uynhiemchi', unc)
        .then(() => {
          this.$store.commit('set', ['isLoading', false])
        })
        .catch((error) => {
          this.$notify({
            title: 'error',
            message: 'ERROR Download file : Uynhiemchi.xlsx',
            type: 'error',
            duration: 3000,
          })
          console.log(error)
          this.$store.commit('set', ['isLoading', false])
        })
        .then(() => {
          this.$router.replace('/dashboard')
        })
    },
    downloadReport() {
      if (
        this.$route.path == '/users' ||
        this.$route.path == '/users/0' ||
        this.path == this.$route.path
      )
        return
      this.path = this.$route.path

      if (this.$route.path.includes('/users/ACCOUNT-vfpupload'))
        return this.vfpUpload()
      if (this.$route.path.includes('/users/ACCOUNT-uynhiemchi'))
        return this.uynhiemchi()

      this.infoketoan = this.$jwtAcn.getKetoan() // Load lại thiết lập hệ thống
      //alert(location.origin)
      this.infoketoan['user'] = []
      var url = ''
      if (this.$route.path.includes('/users/KK-GTGT-')) {
        this.infoketoan['filename'] = 'BangKeHoaDon.xlsx'
        this.infoketoan['patern'] = this.$route.path.replace(
          '/users/KK-GTGT-',
          '',
        )
        url = '/thuegtgtXLSX'
      } else {
        if (this.$route.path.includes('/users/ACCOUNT-')) {
          url = this.$route.path.replace('/users/ACCOUNT-', '')
          //if(!location.host.includes('localhost')) {confirm('Đang thiết kế ... !!!') ; return;}
          if (url.includes('restore')) {
            this.$router.replace('/users/0')
            var namnay = this.infoketoan.fromtodate.pd_fromdate.substr(0, 4)
            var tenfilezip =
              'Table_' +
              (this.infoketoan.company.database.database ||
                this.infoketoan.company.database.dataname) +
              '_' +
              this.infoketoan.company.database.username +
              '.zip'
            window.navigator.clipboard.writeText(tenfilezip) // The navigator object contains information about the browser.

            if (!confirm('Phục hồi toàn bộ chứng từ & năm : ' + namnay)) {
              return
            }
            var respond = prompt(
              "Lưu ý: Phục hồi dữ liệu sẽ thay thế dữ liệu hiện tại bằng dữ liệu đã sao lưu. Để xác nhận thực hiện hãy nhập 4 ký tự năm '????' hoặc Tên file : " +
                tenfilezip +
                '  đã sao lưu : ',
              '****',
            )
            if (
              respond == null ||
              (respond != namnay && !respond.includes('.zip'))
            ) {
              return this.$toastr.warning('', 'Xác nhận không đúng định dạng.')
            }
            //respond = {file: respond, dropbox: this.infoketoan.settings.Dropbox} ;
            respond = { file: respond, dropbox: false } // Không dùng 2 tài khoản dropbox cho ứng dụng
            return this.backupData(url + '/' + JSON.stringify(respond))
          } else {
            if (
              !confirm(
                'Thực hiện Sao lưu sẽ thay thế bản sao lưu cũ bằng dữ liệu hiện hành. Xác nhận chắc chắn rằng dữ liệu hiện hành đang hoạt động tốt và cần phải sao lưu ?',
              )
            ) {
              return
            }
            this.backupData(url)
          }
        } else {
          this.infoketoan['filename'] = this.$route.path.replace('/users/', '')
          url = '/baocaotc'
        }
      }
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .download(url, this.infoketoan)
        .then(() => {
          this.$store.commit('set', ['isLoading', false])
          this.$toastr.success('', 'Thực hiện THÀNH CÔNG ...')
        })
        .catch((error) => {
          this.$toastr.error('', 'Thực hiện KHÔNG thành công...')
          console.log(error)
          this.$store.commit('set', ['isLoading', false])
        })
        .then(() => {
          this.$router.replace('/dashboard')
        })
    },
    // ==========================
  }, // methods
  created() {
    this.infoketoan = this.$jwtAcn.getKetoan()
    //this.$i18n.locale = this.$store.state.locale
    // console.log(this.infoketoan)
  },
  async mounted() {
    this.downloadReport()
    await this.$store.dispatch('myDocument/GET_DM_USERS')
    let users = this.$store.state.myDocument.danhmucUsers
    // console.log(this.tableExample, this.$store.state.myDocument.danhmucUsers)
    // let temp = []
    // for (let i = 0; i < users.length; i++) {
    //   if (i > this.tableExample.length)
    //     temp.push(this.tableExample[this.tableExample.length - 1])
    // }
    // if (temp.length > 0) this.tableExample.push(temp)
    // console.log(temp, this.tableExample)

    await this.tableExample.forEach((item, index) => {
      if (users.length >= index)
        this.tableExample[index].user.name = users[index].username
    })
  },
  beforeRouteUpdate(to, from, next) {
    next()
    this.downloadReport()
  },
}
</script>
