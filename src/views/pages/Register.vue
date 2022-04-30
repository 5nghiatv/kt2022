<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CForm @submit.prevent="submitForm">
                <h1>{{ updateuser ? 'Update' : title }}</h1>
                <p class="text-medium-emphasis">Your account</p>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    v-model="username"
                    placeholder="Username"
                    autocomplete="username"
                  />
                </CInputGroup>

                <CInputGroup v-if="updateuser" class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-People" />
                  </CInputGroupText>
                  <CFormInput
                    v-model="name"
                    placeholder="Name"
                    autocomplete="name"
                  />
                </CInputGroup>

                <CInputGroup v-if="!updateuser" class="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    v-model="email"
                    placeholder="Email"
                    autocomplete="email"
                  />
                </CInputGroup>

                <CInputGroup v-if="!updateuser" class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    v-model="password"
                    placeholder="Password"
                    type="password"
                    autocomplete="new-password"
                  />
                </CInputGroup>

                <CInputGroup v-if="updateuser" class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    v-model="newPassword"
                    placeholder="New password"
                    type="password"
                    autocomplete="new-password"
                  />
                </CInputGroup>

                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    v-model="password2"
                    placeholder="Repeat password"
                    type="password"
                    autocomplete="new-password"
                  />
                </CInputGroup>

                <CInputGroup v-if="updateuser" class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-File" />
                  </CInputGroupText>
                  <CFormInput v-model="image" placeholder="image" />
                </CInputGroup>

                <CCardFooter class="p-4">
                  <CRow v-if="updateuser">
                    <CCol md="4" class="d-flex justify-content-center">
                      <CButton @click="updateTodo()" color="info" block
                        >Update Account</CButton
                      >
                    </CCol>
                    <CCol md="4" class="d-flex justify-content-center">
                      <CButton
                        :disabled="this.$route.params.id == '0'"
                        @click="deleteTodo()"
                        color="warning"
                        block
                        >Delete Account</CButton
                      >
                    </CCol>
                    <CCol md="4" class="d-flex justify-content-center">
                      <CButton @click="gotoHome()" color="success" block
                        >Home page</CButton
                      >
                    </CCol>
                  </CRow>
                  <CRow v-if="!updateuser">
                    <CCol md="6" class="d-flex justify-content-center">
                      <CButton @click="register()" color="info" block
                        >Create Account</CButton
                      >
                    </CCol>
                    <CCol md="6" class="d-flex justify-content-center">
                      <CButton @click="gotoHome()" color="success" block
                        >Home page</CButton
                      >
                    </CCol>
                  </CRow>
                </CCardFooter>
              </CForm>
            </CCardBody>

            <!-- <CCardFooter id="social-icon">
              <a id="fa-facebook" href="javascript:void(0)" class="fa fa-facebook"></a>
              <a id="fa-twitter" href="javascript:void(0)" class="fa fa-twitter"></a>
              <a id="fa-google" href="javascript:void(0)" class="fa fa-google"></a>
              <a id="fa-youtube" href="javascript:void(0)" class="fa fa-youtube"></a>
              <a id="fa-instagram" href="javascript:void(0)" class="fa fa-instagram"></a>
              <a id="fa-skype" href="javascript:void(0)" class="fa fa-skype"></a>
            </CCardFooter> -->
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Register',
  components: {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath.includes('users')
    })
  },

  data() {
    return {
      user: this.$jwtAcn.getUser(),
      models: 'user',
      title: 'Register',
      updateuser: false,
      id_: '',
      name: '',
      username: '',
      email: '',
      role: '',
      status: '',
      image: '',
      isAdmin: false,
      password: '',
      newPassword: '',
      password2: '',
    }
  },
  methods: {
    submitForm() {},
    async gotoHome() {
      await this.$router.push('/')
      //location.reload()
    },
    onSelectAdmin() {
      this.isAdmin = document.getElementById('mySelectAdmin').value
    },
    onSelectRole() {
      this.role = document.getElementById('mySelectRole').value
    },
    onSelectStatus() {
      this.status = document.getElementById('mySelectStatus').value
    },
    checkValid() {
      this.password = this.updateuser ? this.newPassword : this.password // For check error
      if (
        (!this.updateuser && this.password != this.password2) ||
        (this.updateuser && this.newPassword != this.password2)
      ) {
        this.$toastr.warning('', 'Password does not match...')
        return false
      }
      if (this.password == '' || this.username == '' || this.email == '') {
        this.$toastr.warning('', 'Data entered must not be blank...')
        return false
      }
      if (!this.email.includes('@')) {
        this.$toastr.warning('', 'Please enter a valid email...')
        return false
      }
      if (this.password.length < 6) {
        this.$toastr.warning('', 'Password entered must length > 5 ')
        return false
      }
      return true
    },
    register() {
      if (!this.checkValid()) {
        return
      }

      this.$apiAcn
        .post('register', {
          name: this.username,
          username: this.username,
          email: this.email,
          password: this.password,
        })
        .then(async () => {
          // this.$store.dispatch('login', data);
          //alert("Register successFully ,You can login ..")
          await this.$router.push('/pages/login')
          //location.reload()
          //console.log(data.data) ;
          // console.log(data.data.user) ;
        })
        .catch((error) => {
          let mess =
            error.response.status == 400
              ? 'User này đã được đăng ký ...'
              : 'Lỗi đăng ký người dùng...'
          this.$toastr.error('', mess)
          console.log(error, error.response.status)
        })
    },

    updateTodo() {
      if (!this.checkValid()) {
        return
      }
      let url = this.models + '/' + this.$route.params.id
      let item = {
        name: this.name,
        username: this.username,
        email: this.email,
        role: this.role,
        status: this.status,
        isAdmin: this.isAdmin,
        image: this.image,
        password: this.password,
        newPassword: this.newPassword,
      }
      //console.log(111,item) ;

      this.$apiAcn
        .patch(url, item)
        .then(async () => {
          await this.$router.push('/pages/login')
          //location.reload()
        })
        .catch((error) => {
          this.$toastr.error('', 'Update Error...')
          console.log(error)
        })
    },

    deleteTodo() {
      if (
        this.$route.params.id == '0' ||
        !confirm('Are you sure to delete this user : ' + this.email + ' ?')
      ) {
        return
      }
      let url = this.models + '/' + this.$route.params.id
      this.$apiAcn
        .delete(url)
        .then(() => {
          this.$toastr.warning('', 'Đã xóa user : ' + this.email)
          this.name = ''
          this.username = ''
          this.email = ''
          this.image = ''
          this.password = ''
          this.newPassword = ''
          this.$router.push('/pages/register/0')
        })
        .catch((error) => {
          this.$toastr.error('', 'Delete Error...')
          console.log(error)
        })
    },

    getTodos() {
      if (this.$route.params.id == '0') {
        return
      }

      let url = this.models + '/' + this.$route.params.id
      this.$apiAcn
        .get(url)
        .then((data) => {
          let todos = data.data.User
          return todos
        })
        .then((todos) => {
          //console.log(todos)
          //const id = this.$route.params.id
          if (this.$route.params.id && this.$route.params.id != '0') {
            this.updateuser = true
            this.id_ = todos._id
            this.name = todos.name
            this.username = todos.username
            this.email = todos.email
            this.role = todos.role
            this.status = todos.status
            this.isAdmin = todos.isAdmin || false
            this.image = todos.image
          }
        })
        .catch((error) => {
          this.$toastr.error('', 'User ID chưa được đăng ký.')
          console.log(error)
        })
    },
  }, // methods

  mounted() {
    this.getTodos()
    // console.log(this.user)
  },
} // export
</script>
