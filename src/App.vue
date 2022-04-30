<template>
  <router-view />
</template>
<script>
import { watch } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
import { isLoggedIn, getLoggedInUser } from '@/common/authService'

export default {
  data() {
    return {
      cartValue: 0,
    }
  },
  mounted() {
    // Ensure that you have proper reference to HTMLElement
  },
  created() {
    // Phục hồi biến trong store khi refresh trang web , Nếu không sẽ mất hết
    //====================================================================
    this.getSettings()
    this.getLocalProducts()
    const loggedUser = getLoggedInUser()
    this.ADD_LOGGED_USER(loggedUser)
  },
  beforeCreate: function () {
    var info = this.$jwtAcn.getKetoan()
    console.log(
      1,
      'Change language: ',
      this.$i18n.locale,
      ' Replace = ',
      info.locale,
    )
    this.$i18n.locale = info.locale // Cho bên bên trái & hệ thống ( this.$i18n.locate)
    this.$store.state.locale = info.locale // Dành cho bên trên & phải (this.$store.state.locale)
  },
  computed: {
    ...mapState(['cartProducts', 'loggedUser', 'settings']),
    CheckCreate: function () {
      // Chạy khi thực hiện router
      if (!this.$route.path.includes('/reports/')) {
        // eslint-disable-next-line
        this.$store.state.isPrinting = false
      } // Không in luôn faLse
      // if (this.$i18n.locale != this.$store.state.locale) {
      //   {
      //     this.$i18n.locale = this.$store.state.locale
      //   } // Cho bên trên & bên phải - Khi thay router-view
      // }
      return true
    },
  },
  methods: {
    ...mapMutations(['SET_CART_PRODUCTS', 'ADD_LOGGED_USER', 'REP_SETTINGS']),
    getSettings() {
      const settings = JSON.parse(localStorage.getItem('setting_acn'))
      if (settings) this.REP_SETTINGS(settings)
    },

    getLocalProducts() {
      const products = JSON.parse(localStorage.getItem('iki-cart'))

      if (products) {
        this.SET_CART_PRODUCTS(products)
      }
    },

    isLogged() {
      return isLoggedIn()
    },

    loc_logout() {
      localStorage.removeItem('_auth')
      this.$router.push('/')
      location.reload()
    },
  },
  setup() {
    const store = useStore()
    //console.log(111, 'setup:', store.state.loggedUser)
    store.state.theme = localStorage.getItem('user-theme') || 'default' // setItem in store.toggleTheme
    store.state.fontsize = localStorage.getItem('user-fontsize') || 'medium' // setItem in store.toggleTheme

    watch(store.state, () => {
      store.state.theme === 'dark'
        ? document.body.classList.add('dark-theme')
        : document.body.classList.remove('dark-theme')

      document.documentElement.setAttribute('data-theme', store.state.theme) // sets the data-theme attribute
      document.documentElement.setAttribute(
        'data-font-size',
        store.state.fontsize,
      )

      /** Replace custom stylesheet */
      // if (document.querySelector('link[id="customStyle"]')) {
      //   document.head.removeChild(
      //     document.querySelector('link[id="customStyle"]'),
      //   )
      // }
      // let lk = document.createElement('link')
      // lk.setAttribute('id', 'customStyle')
      // lk.setAttribute('rel', 'stylesheet')
      // lk.setAttribute('href', `/css/${store.state.theme}.css`)
      // document.head.appendChild(lk)
      // console.log(9999, lk)
    })

    store.state.theme === 'dark'
      ? document.body.classList.add('dark-theme')
      : document.body.classList.remove('dark-theme')

    document.documentElement.setAttribute('data-theme', store.state.theme) // sets the data-theme attribute
    document.documentElement.setAttribute(
      'data-font-size',
      store.state.fontsize,
    ) // sets the data-theme attribute
  },
}
</script>

<style lang="scss">
// Import Main styles for this application
@import 'styles/style';
@import 'toastr/toastr.scss';
.container-xl,
.container-lg,
.container-md,
.container-sm,
.container {
  max-width: 1440px !important;
}

// [data-theme='default'] {
//   --cui-sidebar-bg: green;
// }
[data-theme='windows'] {
  --cui-sidebar-bg: #2b2b2b;
  --cui-sidebar-nav-dropdown-bg: #414141;
  --cui-sidebar-nav-link-hover-bg: #505050;
  --cui-sidebar-nav-link-active-bg: #1a1919;
}
[data-theme='winword'] {
  --cui-sidebar-bg: #2b579a;
  --cui-sidebar-nav-dropdown-bg: #3369b9;
  --cui-sidebar-nav-link-hover-bg: #124078;
  --cui-sidebar-nav-link-active-bg: #002050;
}
[data-theme='lte'] {
  --cui-sidebar-bg: rgb(26, 34, 38);
  --cui-sidebar-nav-dropdown-bg: rgb(44, 59, 65);
  --cui-sidebar-nav-link-hover-bg: rgb(24, 48, 58);
  --cui-sidebar-nav-link-active-bg: rgb(34, 52, 59);
}
[data-theme='legacy'] {
  --cui-sidebar-bg: #2f353a;
  --cui-sidebar-nav-dropdown-bg: #24272b;
  --cui-sidebar-nav-link-hover-bg: #1e2124;
  --cui-sidebar-nav-link-active-bg: #3a3f44;
}

.sidebar-nav {
  --scrollbarBG: --cui-sidebar-nav-link-active-bg;
  --thumbBG: #90a4ae;
  scrollbar-width: thin;
  scrollbar-color: var(--thumbBG) var(--scrollbarBG);
  overflow: hidden;
}
.sidebar-nav:hover {
  overflow-y: auto;
}

.sidebar-nav::-webkit-scrollbar {
  width: 11px;
}
.sidebar-nav::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
}
.sidebar-nav::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG);
  border-radius: 6px;
  border: 3px solid var(--scrollbarBG);
}
:root {
  --ms-font-size: var(--cui-body-font-size);
  --ms-option-font-size: var(--cui-body-font-size);
  .form-control {
    font-size: var(--cui-body-font-size);
  }
  table.vgt-table {
    font-size: var(--cui-body-font-size);
  }
}
// Phải đặt sau <--:root {} <-- Đặt font-size theo biến hết để Set sau

[data-font-size='small'] {
  --cui-body-font-size: 0.9rem;
  --ms-tag-font-size: 0.775rem;
}
[data-font-size='medium'] {
  --cui-body-font-size: 0.94rem;
  --ms-tag-font-size: 0.825rem;
}
[data-font-size='large'] {
  --cui-body-font-size: 0.98rem;
  --ms-tag-font-size: 0.875rem;
}
</style>
<style src="@vueform/multiselect/themes/default.css"></style>
