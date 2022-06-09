<template>
  <!-- eslint-disable -->
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <!-- <div class="c-app flex-row align-items-center"> -->
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="submitForm">
                  <h1>Login</h1>
                  <p class="text-medium-emphasis">
                    Đăng nhập vào tài khoản của bạn
                  </p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="email"
                      placeholder="Username"
                      autocomplete="username"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="password"
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton
                        type="submit"
                        @click="login()"
                        color="primary"
                        class="px-4"
                      >
                        Login
                      </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton
                        type="submit"
                        @click="changePasw()"
                        color="link"
                        class="px-0"
                        >Forgot password</CButton
                      >
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard color="primary" text-color="white" body-wrapper>
              <!-- class="text-center py-5 d-md-down-none" -->

              <CCardBody>
                <CRow>
                  <CCol col="12" class="text-left">
                    <CInputGroup class="mb-4">
                      <CInputGroupText>From date </CInputGroupText>
                      <CFormInput
                        :is-valid="testValidator('pd_fromdate')"
                        v-model="fromtodate.pd_fromdate"
                        type="date"
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol col="12" class="text-right">
                    <CInputGroup class="mb-4">
                      <CInputGroupText>To date .... </CInputGroupText>
                      <CFormInput
                        :is-valid="testValidator('pd_todate')"
                        v-model="fromtodate.pd_todate"
                        type="date"
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="12">
                    <Multiselect
                      v-model="company.connect_id"
                      placeholder="Select your character"
                      :searchable="true"
                      trackBy="taxcode"
                      label="company"
                      class="form-control"
                      :class="{
                        'multiselect-blue': !testTheme('dark'),
                        'multiselect-dark': testTheme('dark'),
                      }"
                      :options="connects"
                      @select="getCompanyName()"
                      :is-valid="testValidator('masothue')"
                    >
                      <!-- <template v-slot:singlelabel="{ value }">
                        <div class="multiselect-single-label">
                          {{ value.taxcode }}
                        </div>
                      </template> -->
                      <template v-slot:option="{ option }">
                        {{ option.taxcode }} {{ option.company }}
                      </template>
                    </Multiselect>
                  </CCol>
                </CRow>

                <br />

                <div class="wrapper_">
                  <div class="danhmuc">
                    <label style="color: blueviolet; cursor: pointer">
                      <a
                        title="Refresh Database..."
                        v-on:click="readDanhmuc('connects', true)"
                      >
                        Company...</a
                      ></label
                    >
                  </div>
                  <div class="author">
                    <label style="color: blueviolet; cursor: pointer">
                      <a title="Liên hệ tác giả..." @click="contactAuthor()">
                        Author...</a
                      ></label
                    >
                  </div>
                  <div class="d-flex flex-row-reverse">
                    <CFormSelect
                      title="Chứng từ đã nhập"
                      style="width: 40px; height: 30px"
                      horizontal
                      :options="options"
                      placeholder="Please select"
                      size="sm"
                      class="mb-3"
                      @change="gioihanthoigian()"
                      id="mySelect"
                    >
                    </CFormSelect>
                  </div>
                </div>
                <CFormCheck
                  id="flexCheckChecked"
                  label="Doanh nghiệp lớn"
                  title="Kế toán áp dụng cho DN lớn"
                  v-model="company.dnlon"
                />

                <br />
                <h2>Sign up</h2>
                <CRow>
                  <CCol sm="6">
                    <CButton
                      color="light"
                      variant="outline"
                      @click="register()"
                    >
                      Register Now!
                    </CButton>
                  </CCol>
                  <CCol sm="6">
                    <!-- <CButton color="light" variant="outline"  @click="changePasw()" > Change Password!  </CButton> -->
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import moment from 'moment'
import { ref } from 'vue'
import Multiselect from '@vueform/multiselect'
import utility from '@/common/utility'

export default {
  name: 'Login',
  mixins: [utility],
  components: { Multiselect },
  data() {
    return {
      valueSelect: null,
      options: [
        '--- Chứng từ đã nhập ---',
        'Đơn vị: ...',
        'Từ ngày...',
        'Đến ngày...',
        '--- Giới hạn thời gian ---',
        'Quí 1',
        'Quí 2',
        'Quí 3',
        'Quí 4',
        '6 tháng đầu năm',
        '6 tháng cuối năm',
        'Năm',
      ],
      danhap: {
        fromdate: '',
        todate: '',
      },
      locale: 'vn',
      email: '',
      password: '',
      connects: [],
      connect: [],
      company: {
        masothue: '',
        company: 'XuânMai.Corpt',
        address: '118/63 Bạch Đằng, P24, Bình Thạnh - HCM',
        connect_id: '', // for login gửi server
        dnlon: true,
        thongtutc: '',
        database: '',
      },
      fromtodate: [],
      Validator: {
        pd_fromdate: false,
        pd_todate: false,
        masothue: false,
        email: false,
      },
    }
  },
  setup() {
    const model = ref(null)
    const options2 = ref([
      { name: 'Vue.js', language: 'JavaScript' },
      { name: 'Rails', language: 'Ruby' },
      { name: 'Sinatra', language: 'Ruby' },
      { name: 'Laravel', language: 'PHP' },
      { name: 'Phoenix', language: 'Elixir' },
    ])

    return {
      model,
      options2,
    }
  },
  methods: {
    submitForm() {
      console.log('Login: ', this.email)
    },
    gioihanthoigian() {
      const selectVal = document.getElementById('mySelect').value
      var year = moment(this.fromtodate.pd_fromdate)
        .format('YYYY-MM-DD')
        .substr(0, 4)
      // Default Cả năm
      this.fromtodate.pd_fromdate = year + '-01-01'
      this.fromtodate.pd_todate = year + '-12-31'
      switch (selectVal) {
        case 'Quí 1':
          this.fromtodate.pd_fromdate = year + '-01-01'
          this.fromtodate.pd_todate = year + '-03-31'
          break
        case 'Quí 2':
          this.fromtodate.pd_fromdate = year + '-04-01'
          this.fromtodate.pd_todate = year + '-06-30'
          break
        case 'Quí 3':
          this.fromtodate.pd_fromdate = year + '-07-01'
          this.fromtodate.pd_todate = year + '-09-30'
          break
        case 'Quí 4':
          this.fromtodate.pd_fromdate = year + '-10-01'
          this.fromtodate.pd_todate = year + '-12-31'
          break
        case '6 tháng đầu năm': // 6 tháng đầu năm
          this.fromtodate.pd_fromdate = year + '-01-01'
          this.fromtodate.pd_todate = year + '-06-30'
          break
        case '6 tháng cuối năm': // 6 tháng cuối năm
          this.fromtodate.pd_fromdate = year + '-07-01'
          this.fromtodate.pd_todate = year + '-12-31'
          break
        default:
          // Cả năm
          this.fromtodate.pd_fromdate = year + '-01-01'
          this.fromtodate.pd_todate = year + '-12-31'
          break
      }
    },
    getCompanyName() {
      this.connects.forEach((item, index) => {
        if (item._id == this.company.connect_id) {
          this.company.masothue = item.taxcode
          this.company.company = item.company
          this.company.address = item.address
          this.company.email = item['email']
          this.company.database = item // || this.connects[index] => lưu cùng this.company
          this.connect = this.connects[index]
          //console.log(this.company, this.connect)
          this.options[1] = 'Đơn vị : ' + this.company.company
          this.options[2] =
            '- Từ ngày  : ' + moment(item.fromdate).format('DD-MM-YYYY')
          this.options[3] =
            '- Đến ngày: ' + moment(item.todate).format('DD-MM-YYYY')
          this.danhap.fromdate = item.fromdate
          this.danhap.todate = item.todate
        }
      })
    },
    testValidator(field) {
      var fryear = new Date(this.fromtodate.pd_fromdate)
        .toISOString()
        .replace('T', ' ')
        .substr(0, 4)
      var toyear = new Date(this.fromtodate.pd_todate)
        .toISOString()
        .replace('T', ' ')
        .substr(0, 4)
      if (field == 'pd_fromdate')
        return (this.Validator.pd_fromdate = fryear == toyear)
      if (field == 'pd_todate')
        return (this.Validator.pd_todate = fryear == toyear)
      if (field == 'masothue')
        return (this.Validator.masothue = this.company.masothue != '')
      if (field == 'email') return (this.Validator.email = this.email != '')
      let passe =
        this.email &&
        this.Validator.masothue &&
        this.Validator.pd_fromdate &&
        new Date(this.fromtodate.pd_todate) >=
          new Date(this.fromtodate.pd_fromdate)
      var mess = 'Vui lòng nhập đầy đủ thông tin ...'
      if (!passe) {
        if (fryear !== toyear) mess = 'Từ NGÀY và Đến ngày phải cùng NĂM ..'
        if (!this.Validator.masothue)
          mess = 'Phải chọn mã số thuế cho Công ty ..'
        if (
          new Date(this.fromtodate.pd_todate) <
          new Date(this.fromtodate.pd_fromdate)
        )
          mess = 'Từ NGÀY phải nhỏ hơn Đến ngày và phải cùng NĂM ..'
        //this.$message({ message: mess, type: 'warning' })
        this.$toastr.warning('', mess)
      }
      return passe
    },
    contactAuthor() {
      this.$router.push('/pages/author')
    },
    register() {
      this.$router.push('/pages/register/0')
    },
    sendMail(userid) {
      //return console.log(window.location.origin)
      let url = window.location.origin + '/#/pages/register/' + userid
      let message = {
        mailto: this.email,
        subject: 'Ketoan.ACN Send link for change password',
        html: 'Link thay đổi mật khẩu của bạn: ' + url,
      }
      this.$apiAcn
        .post('sendmail', message)
        .then(() => {
          //console.log(data);
          if (window.location.origin.includes('localhost')) console.log(url)
          this.$toastr.success(
            '',
            'Vui lòng check email để nhận link thay đổi Password.',
          )
        })
        .catch((error) => {
          this.$toastr.error('', 'Gửi email không thành công.')
          console.log(error)
        })
    },
    changePasw() {
      if (!this.email)
        return this.$toastr.warning('', 'Bạn chưa nhập địa chỉ email...')
      this.$apiAcn
        .get('useremail/' + this.email)
        .then((data) => {
          let userid = ''
          if (data.data.User.id) userid = data.data.User.id
          if (data.data.User._id) userid = data.data.User._id
          //console.log('id:',id, data.data.User)
          if (userid) {
            this.sendMail(userid)
          } else
            this.$toastr.warning(
              '',
              'Email: ' + this.email + ' chưa được đăng ký.',
            )
        })
        .catch((error) => {
          if (error.response.status == 404) {
            this.$toastr.warning(
              '',
              'Email: ' + this.email + ' chưa được đăng ký.',
            )
          } else this.$toastr.error('', 'Server error. Please try again.')
          console.log(error)
        })
    },

    login() {
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .post('connects', { email: this.email })
        .then((data) => {
          var ret = false
          data.data['connects'].forEach((item) => {
            if (item._id == this.company.connect_id) {
              ret = true
            }
          })
          if (!ret || !this.testValidator()) {
            this.company.connect_id = ''
            var mess = 'Vui lòng chọn dữ liệu Công ty...'
            if (data.data['connects'].length == 0)
              mess =
                'Email chưa đăng ký hoặc chưa cấp quyền sử dụng Database...'
            //this.$message({ message: mess, type: 'warning' ,duration: 6000 })
            this.$toastr.warning('', mess)
            this.readDanhmuc('connects', true)
            return
          }
          // ============ Begin function login()
          this.$apiAcn
            .post('login', {
              email: this.email,
              password: this.password,
              connect: this.connect,
            })
            .then(async (data) => {
              data.data['company'] = this.company
              var tt200 =
                '(Ban hành theo TT số: 200/2014/TT-BTC ngày 22/12/2014 của Bộ trưởng BTC)'
              var tt133 =
                '(Ban hành theo TT số: 133/2016/TT-BTC ngày 26/08/2016 của Bộ trưởng BTC)'
              data.data['fromtodate'] = this.fromtodate
              data.data['fromtodate']['tungay'] = moment(
                this.fromtodate.pd_fromdate,
              ).format('DD-MM-YYYY')
              data.data['fromtodate']['denngay'] = moment(
                this.fromtodate.pd_todate,
              ).format('DD-MM-YYYY')
              data.data['email'] = this.email
              data.data['company']['thongtutc'] = this.company.dnlon
                ? tt200
                : tt133
              data.data['locale'] = this.locale // giữ nguyên khi this.$jwtAcn.getKetoan()
              await this.$store.dispatch('login', data)
              var cmess = 'Đăng nhập thành công...'
              if (
                this.fromtodate.pd_fromdate >
                  moment(this.danhap.todate, 'YYYY-MM-DD').add(
                    'YYYY-MM-DD',
                    1,
                  ) ||
                this.fromtodate.pd_todate < this.danhap.fromdate
              ) {
                cmess = cmess + 'Nhưng từ đến ngày đã chọn CHƯA CÓ CHỨNG TỪ.'
              }
              // Bổ sung thông tin Công ty
              this.$apiAcn
                .get('custaxcode/' + this.company.masothue)
                .then((ret) => {
                  // eslint-disable-next-line
                  if (typeof ret && typeof data && typeof customer_) {
                    if (ret.data.customer_.length == 0) {
                      cmess =
                        cmess +
                        ' (...Mã số thuế Công ty chưa có trong danh mục )'
                    } else {
                      let item = ret.data.customer_[0]
                      this.company['company'] = item['company']
                      this.company['address'] = item['address']
                      this.company['phone'] = item['phone1']
                      this.company['fax'] = item['fax1']
                      this.company['account'] = item['account']
                      this.company['bank'] = item['bank']
                      this.company['citibank'] = item['citibank']
                      data.data['company'] = this.company
                      this.$store.dispatch('login', data)
                      //console.log(data.data['company'],this.email) ;
                    }
                    //this.$message({ title: 'Success', message: cmess, type: ctype ,duration: 3000 })
                    this.$toastr.success('', cmess)
                  }
                })
                .then(async () => {
                  this.$store.commit('set', ['isLoading', false])
                  await this.$router.push('/')
                  // await location.reload()
                })
              // console.log(data.data.token) ;
              // console.log(this.$jwtAcn.getDateTime()) ;
            })
            .catch((error) => {
              let mess = 'Lỗi hệ thống, hãy đăng nhập lần sau.'
              switch (error.response.status || '') {
                case 404:
                  mess = 'This user is not registered ...'
                  break
                case 401:
                  mess = 'Access denied, Incorrect username or password ...'
                  break
              }
              this.$toastr.error('', mess)
              console.log(error)
              this.$store.commit('set', ['isLoading', false])
            })

          // ============ Begin function login()
        })
        .catch((error) => {
          this.$toastr.error('', 'Kiểm tra Database ERROR ...')
          //this.$notify({ title: 'ERROR', message: 'Kiểm tra Database ERROR ...',  type: 'error'})
          console.log(error)
          this.$store.commit('set', ['isLoading', false])
        })
    },
    readDanhmuc(models, post = false) {
      this.$store.commit('set', ['isLoading', true])
      if (post)
        this.$apiAcn.post(models, { email: this.email }).then((data) => {
          this[models] = data.data[models]
          this[models].forEach((item) => {
            item['value'] = item._id
          })
          //console.log(this.email, data.data, this[models])
          this.getCompanyName()
          this.$store.commit('set', ['isLoading', false])
        })
      else
        this.$apiAcn
          .get(models)
          .then((data) => {
            this[models] = data.data[models]
            this.$store.commit('set', ['isLoading', false])
          })
          .then(() => {
            //console.log(this[models])
          })
          .catch((err) => {
            console.log(err)
            this.$store.commit('set', ['isLoading', false])
          })
    },
  },
  created() {
    var info = this.$jwtAcn.getKetoan()
    this.fromtodate = info.fromtodate
    this.company = info.company
    this.email = info.email
    this.locale = info.locale
  },
  mounted() {
    //this.fromtodate = this.$jwtAcn.getDateTime()
    this.readDanhmuc('connects', true)
  },
}
</script>

<style scoped>
.card-body {
  flex: 1 1 auto;
  padding: 2rem 2rem;
}
.wrapper_ {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>

<style>
.multiselect-green {
  --ms-tag-bg: #d1fae5;
  --ms-tag-color: #059669;
}
.multiselect-blue {
  --ms-bg: white;
  --ms-border-color: white;
}
.multiselect-dark {
  --ms-bg: #1e2139;
  --ms-border-color: #1e2139;
}
.multiselect-option {
  width: 530px;
  color: burlywood;
  background-color: var(--ms-bg);
}
.multiselect-search {
  background-color: var(--ms-bg);
  border-radius: 4px;
  outline: var(--ms-bg);
}
.multiselect-dropdown {
  width: 550px;
  height: 550px;
  border: var(--ms-bg);
}
.multiselect-clear-icon {
  background-color: var(--ms-bg);
  display: none;
}
.multiselect-option {
  width: 530px;
  background-color: var(--ms-bg);
  color: burlywood;
}
.multiselect-search {
  background-color: var(--ms-bg);
  border-radius: 4px;
  outline: var(--ms-bg);
}
.typo__label {
  margin-top: 10px;
}
</style>
