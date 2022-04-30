//import { ref } from 'vue'
import { createStore } from 'vuex'
import { myDocument } from '../views/ketoan-nl/store/myDocument.js'
import JwtService from '@/common/jwt.service'
import { encryptUser } from '@/common/authService'

const types = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
}
const settings_default = {
  Dropbox: false,
  Company: false,
  FirstMonth: false,
}

export default createStore({
  state: {
    asideVisible: false,
    sidebarVisible: '',
    sidebarUnfoldable: false,
    theme: 'lte',
    fontsize: 'medium',

    // Ký tự đầu in Hoa - Truy xuất phải ghi chính xác tên biến
    settings: settings_default,
    cartProducts: [],
    loggedUser: {}, // NEW 7-4-21
    logged: !!window.localStorage.getItem('token'),
    isLoading: false,
    isPrinting: false,
    right_open: false,
    sidebarShow: 'responsive',
    sidebarMinimize: false,
    RightMenuColllape: false,
    username: '',
    locale: 'vn',
    isAdmin: false,
  },
  mutations: {
    toggleAside(state) {
      state.asideVisible = !state.asideVisible
    },
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleTheme(state, payload) {
      state.theme = payload.value || payload // Phải có ||
      localStorage.setItem('user-theme', state.theme)
    },
    toggleFontsize(state, payload) {
      state.fontsize = payload.value || payload // Phải có ||
      localStorage.setItem('user-fontsize', state.fontsize)
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },

    REP_SETTINGS: (state, settings) => {
      if (!settings) {
        Object.keys(settings_default).forEach(function (key) {
          if (settings_default[key]) settings_default[key] = false
        })
      }
      state.settings = settings ? settings : settings_default
      // Vue.set(state, 'settings', settings ? settings : settings_default)
      localStorage.setItem('setting_acn', JSON.stringify(state.settings))
    },
    ADD_CART_LOCAL: (state, product) => {
      state.cartProducts.push(product)
      localStorage.setItem('iki-cart', JSON.stringify(state.cartProducts))
    },

    REP_CART_LOCAL: (state, product) => {
      let products = state.cartProducts
      for (let i = 0; i < products.length; i++) {
        if (products[i]._id === product._id) {
          products[i] = product
        }
      }
      state.cartProducts = products
      localStorage.setItem('iki-cart', JSON.stringify(state.cartProducts))
    },

    ADD_LOGGED_USER: (state, user) => {
      state.loggedUser = user
      localStorage.setItem('_auth', encryptUser(user))
      if (user) {
        state.username = user.username || null
        state.isAdmin = user.admin || false
      }
    },

    SET_CART_PRODUCTS: (state, products) => {
      state.cartProducts = []
      state.cartProducts = products
    },

    [types.LOGIN](state) {
      state.logged = true
    },

    [types.LOGOUT](state) {
      state.logged = false
    },

    toggleSidebarDesktop(state) {
      const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
      state.sidebarShow = sidebarOpened ? false : 'responsive'
    },
    toggleSidebarMobile(state) {
      const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
      state.sidebarShow = sidebarClosed ? true : 'responsive'
    },
    // this.$store.commit('toggleMenuColllape') --> run toggleMenuColllape()
    toggleMenuColllape(state) {
      state.RightMenuColllape = !state.RightMenuColllape
    },
    // this.$store.commit('set', ['RightMenuColllape', true]);
    set(state, [variable, value]) {
      state[variable] = value
    },
  },

  getters: {
    cartProducts: (state) => {
      return state.cartProducts
    },
    getLoggedUser: (state) => {
      return state.loggedUser
    }, // NEW 7-4-21
    isLogged: (state) => state.logged,
    isLoading: (state) => state.isLoading,
    isAdmin: (state) => state.isAdmin,
    RightMenuColllape: (state) => state.RightMenuColllape,
    username: (state) => (state.username ? state.username : 'Trần Văn Nghĩa'),
    locate: (state) => state.locate,
  },

  // for this.$store.dispatch('login', data)
  actions: {
    login(state, response) {
      // token at: response.headers.authorization
      // response.data.token  - response.data.expiresIn
      let data = response.data
      state.loggedUser = data.user // NEW 7-4-21
      localStorage.setItem('_auth', encryptUser(data.user)) // NEW 7-4-21
      JwtService.saveToken(data.Token, data.expiresIn)
      JwtService.saveRefreshToken(data.RefreshToken)

      JwtService.saveUser(data.user)
      JwtService.saveDateTime(data.fromtodate)
      JwtService.saveKetoan(data)
      state.username = data.user.username
      state.isAdmin = data.user.admin
    },
    social(response) {
      JwtService.saveSocial(response)
    },
    logout(state) {
      JwtService.destroyToken()
      JwtService.destroyUser()
      JwtService.destroySocial()
      localStorage.removeItem('_auth') // NEW 7-4-21
      state.loggedUser = {} // NEW 7-4-21
    },
  },
  modules: { myDocument },
})
