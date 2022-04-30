import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import {
  CBadge,
  CSidebarNav,
  CNavItem,
  CNavGroup,
  CNavTitle,
} from '@coreui/vue-pro'
//import nav from '@/_nav.js'
let nav = [] // dùng trong setup() & phải khai báo tại đây
import { useStore } from 'vuex'
//import { watch } from 'vue'

const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

const isActiveLink = (route, link) => {
  if (link === undefined) {
    return false
  }

  if (route.hash === link) {
    return true
  }

  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)

  return currentPath === targetPath
}

const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) {
    return true
  }

  if (item.items) {
    return item.items.some((child) => isActiveItem(route, child))
  }

  return false
}

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  mounted() {},
  setup() {
    const store = useStore()

    // =================== Phải init store.state từ đây mới chính xác
    const user = JSON.parse(window.localStorage.getItem('user'))
    store.state.loggedUser = user
    store.state.username = user.username
    store.state.isAdmin = user.admin
    //console.log('Setup AppSidebarNav:', store.state.loggedUser)

    // console.log('store.state: SẼ LOAD nav..', store.state)
    let { nav1 } = require('@/_nav1.js')
    const { nav2 } = require('@/_nav2.js')
    let lang = require(`@/locales/${store.state.locale}.json`)

    nav1.forEach((element) => {
      // console.log('--' + element.name)
      if (typeof lang.navRight[element.name] != 'undefined') {
        element.name = lang.navRight[element.name]
        //console.log(777, lang.navRight[element.name])
      }
      if (element.items) {
        element.items.forEach((el) => {
          if (typeof lang.navRight[el.name] != 'undefined') {
            el.name = lang.navRight[el.name]
          }
        })
      }
    })
    if (store.state.isAdmin && process.env.VUE_APP_URL.includes('localhost')) {
      nav = [...nav1, ...nav2]
    } else {
      nav = [...nav1]
    }

    const route = useRoute()
    const firstRender = ref(true)

    onMounted(() => {
      firstRender.value = false
    })

    const renderItem = (item) => {
      if (item.items) {
        return h(
          CNavGroup,
          {
            ...(firstRender.value && {
              visible: item.items.some((child) => isActiveItem(route, child)),
            }),
          },
          {
            togglerContent: () => [
              h(resolveComponent('CIcon'), {
                customClassName: 'nav-icon',
                name: item.icon,
              }),
              item.name,
            ],
            default: () => item.items.map((child) => renderItem(child)),
          },
        )
      }

      return item.to
        ? h(
            RouterLink,
            {
              to: item.to,
              custom: true,
            },
            {
              default: (props) =>
                h(
                  resolveComponent(item.component),
                  {
                    active: props.isActive,
                    href: props.href,
                    onClick: () => props.navigate(),
                  },
                  {
                    default: () => [
                      item.icon &&
                        h(resolveComponent('CIcon'), {
                          customClassName: 'nav-icon',
                          name: item.icon,
                        }),
                      item.name,
                      item.badge &&
                        h(
                          CBadge,
                          {
                            class: 'ms-auto',
                            color: item.badge.color,
                          },
                          {
                            default: () => item.badge.text,
                          },
                        ),
                    ],
                  },
                ),
            },
          )
        : h(
            resolveComponent(item.component),
            {},
            {
              default: () => item.name,
            },
          )
    }

    return () =>
      h(
        CSidebarNav,
        {},
        {
          default: () => nav.map((item) => renderItem(item)),
        },
      )
  },
})
export { AppSidebarNav }
