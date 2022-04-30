import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'

import CoreuiVue from '@coreui/vue-pro'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsCallout from '@/components/DocsCallout'
import DocsExample from '@/components/DocsExample'

import VueGoodTablePlugin from 'vue-good-table-next'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import VueMask from '@devindex/vue-mask'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(VueGoodTablePlugin)
app.use(VueMask)

app.use(VueAxios, axios)
app.provide('axios', axios)
app.provide('VueAxios', VueAxios)
axios.defaults.withCredentials = true

//-------------NGHIA-----------------
//import BootstrapVue3 from 'bootstrap-vue-3'
// Optional, since every component import their Bootstrap funcionality
// the following line is not necessary
// import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

//import VueMask from 'v-mask' // Kết hợp với plusgin text-mask-addons MỚI ĐƯỢC
import ApiService from './common/api.service'
import JwtService from './common/jwt.service'
//import 'core-js/stable'
import i18n from './i18n'
app.use(i18n)
//import _ from 'lodash'
//import utility from './common/utility'
// import Element from 'element-ui'
//import Cookies from 'js-cookie'
// import enLang from 'element-ui/lib/locale/lang/en'
//import viLang from 'element-ui/lib/locale/lang/vi'
// import * as filters from './filters' // global filters

//app.use(VueMask)
//app.use(BootstrapVue3)

// app.use(Element, {
//   size: Cookies.get('size') || 'medium', // set element-ui default size
//   locale: viLang,
// })

// register global utility filters
// Object.keys(filters).forEach((key) => {
//   app.filter(key, filters[key])
// })

axios.defaults.appURL = process.env.VUE_APP_URL
if (process.env.VUE_APP_URL.includes('localhost')) {
  axios.defaults.appURL = process.env.VUE_APP_URL_LOCAL
}
console.log(
  'process.env.VUE_APP_URL (for VueJS) thay đổi khi (npm run dev) : ',
  axios.defaults.appURL,
)
//Vue.axios.defaults.appURL = 'http://localhost:8080';
axios.defaults.baseURL = axios.defaults.appURL + '/api/'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
//-------------NGHIA-----------------
import toastr from 'toastr'
toastr.options.closeMethod = 'fadeOut'
toastr.options.showMethod = 'slideDown'
toastr.options.hideMethod = 'slideUp'
toastr.options.closeEasing = 'swing'
toastr.options.preventDuplicates = true
toastr.options.timeOut = 3000
// import 'toastr/toastr.scss'
//import './assets/css/toastr.min.css'

app.config.globalProperties.$jwtAcn = JwtService
app.config.globalProperties.$apiAcn = ApiService
app.config.globalProperties.$author = 'Tác giả: Trần Văn Nghĩa - 0903917963'
app.config.globalProperties.$toastr = toastr
app.config.globalProperties.$i18n = i18n

app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsCallout', DocsCallout)
app.component('DocsExample', DocsExample)

app.mount('#app')

router.beforeEach((to, from, next) => {
  // use the language from the routing param or default language
  let language = to.params.lang
  if (!language) {
    language = 'vn'
  }
  // set the current language for i18n.
  i18n.locale = language
  const loggedIn = localStorage.getItem('token') !== null

  if (
    !(to.path.includes('/pages/register') || to.path.includes('/pages/author'))
  ) {
    if (!loggedIn && to.path !== '/pages/login') {
      return next('/pages/login')
    }
  }
  //console.log(store.state.isAdmin, to)
  if (
    (to.path.includes('-restoreData') || to.path.includes('-vfpupload')) &&
    !store.state.isAdmin
  ) {
    alert('Chức năng này dành riêng cho Quản trị hệ thống ...')
    return next(from.path)
  }
  next()
})

//console.log(1000, 'app.config in  main.js ', app.config)
