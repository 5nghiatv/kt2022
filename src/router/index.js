import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
      },
      {
        path: '/theme',
        name: 'Theme',
        redirect: '/theme/typography',
      },
      {
        path: '/theme/colors',
        name: 'Colors',
        component: () => import('@/views/theme/Colors.vue'),
      },
      {
        path: '/theme/typography',
        name: 'Typography',
        component: () => import('@/views/theme/Typography.vue'),
      },
      {
        path: '/base',
        name: 'Base',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/base/breadcrumbs',
        children: [
          {
            path: '/base/accordion',
            name: 'Accordion',
            component: () => import('@/views/base/Accordion.vue'),
          },
          {
            path: '/base/breadcrumbs',
            name: 'Breadcrumbs',
            component: () => import('@/views/base/Breadcrumbs.vue'),
          },
          {
            path: '/base/cards',
            name: 'Cards',
            component: () => import('@/views/base/Cards.vue'),
          },
          {
            path: '/base/carousels',
            name: 'Carousels',
            component: () => import('@/views/base/Carousels.vue'),
          },
          {
            path: '/base/collapses',
            name: 'Collapses',
            component: () => import('@/views/base/Collapses.vue'),
          },
          {
            path: '/base/list-groups',
            name: 'List Groups',
            component: () => import('@/views/base/ListGroups.vue'),
          },
          {
            path: '/base/navs',
            name: 'Navs',
            component: () => import('@/views/base/Navs.vue'),
          },
          {
            path: '/base/paginations',
            name: 'Paginations',
            component: () => import('@/views/base/Paginations.vue'),
          },
          {
            path: '/base/placeholders',
            name: 'Placeholders',
            component: () => import('@/views/base/Placeholders.vue'),
          },
          {
            path: '/base/popovers',
            name: 'Popovers',
            component: () => import('@/views/base/Popovers.vue'),
          },
          {
            path: '/base/progress',
            name: 'Progress',
            component: () => import('@/views/base/Progress.vue'),
          },
          {
            path: '/base/spinners',
            name: 'Spinners',
            component: () => import('@/views/base/Spinners.vue'),
          },
          {
            path: '/base/tables',
            name: 'Tables',
            component: () => import('@/views/base/Tables.vue'),
          },
          {
            path: '/base/tooltips',
            name: 'Tooltips',
            component: () => import('@/views/base/Tooltips.vue'),
          },
        ],
      },
      {
        path: '/buttons',
        name: 'Buttons',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/buttons/standard-buttons',
        children: [
          {
            path: '/buttons/standard-buttons',
            name: 'Buttons',
            component: () => import('@/views/buttons/Buttons.vue'),
          },
          {
            path: '/buttons/dropdowns',
            name: 'Dropdowns',
            component: () => import('@/views/buttons/Dropdowns.vue'),
          },
          {
            path: '/buttons/button-groups',
            name: 'Button Groups',
            component: () => import('@/views/buttons/ButtonGroups.vue'),
          },
        ],
      },
      {
        path: '/forms',
        name: 'Forms',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/forms/form-control',
        children: [
          {
            path: '/forms/form-control',
            name: 'Form Control',
            component: () => import('@/views/forms/FormControl.vue'),
          },
          {
            path: '/forms/select',
            name: 'Select',
            component: () => import('@/views/forms/Select.vue'),
          },
          {
            path: '/forms/multi-select',
            name: 'Multi Select',
            component: () => import('@/views/forms/MultiSelect.vue'),
          },
          {
            path: '/forms/checks-radios',
            name: 'Checks & Radios',
            component: () => import('@/views/forms/ChecksRadios.vue'),
          },
          {
            path: '/forms/range',
            name: 'Range',
            component: () => import('@/views/forms/Range.vue'),
          },
          {
            path: '/forms/input-group',
            name: 'Input Group',
            component: () => import('@/views/forms/InputGroup.vue'),
          },
          {
            path: '/forms/floating-labels',
            name: 'Floating Labels',
            component: () => import('@/views/forms/FloatingLabels.vue'),
          },
          {
            path: '/forms/layout',
            name: 'Layout',
            component: () => import('@/views/forms/Layout.vue'),
          },
          {
            path: '/forms/validation',
            name: 'Validation',
            component: () => import('@/views/forms/Validation.vue'),
          },
        ],
      },
      {
        path: '/charts',
        name: 'Charts',
        component: () => import('@/views/charts/Charts.vue'),
      },
      {
        path: '/icons',
        name: 'Icons',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/icons/coreui-icons',
        children: [
          {
            path: '/icons/coreui-icons',
            name: 'CoreUI Icons',
            component: () => import('@/views/icons/CoreUIIcons.vue'),
          },
          {
            path: '/icons/brands',
            name: 'Brands',
            component: () => import('@/views/icons/Brands.vue'),
          },
          {
            path: '/icons/flags',
            name: 'Flags',
            component: () => import('@/views/icons/Flags.vue'),
          },
        ],
      },
      {
        path: '/notifications',
        name: 'Notifications',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/notifications/alerts',
        children: [
          {
            path: '/notifications/alerts',
            name: 'Alerts',
            component: () => import('@/views/notifications/Alerts.vue'),
          },
          {
            path: '/notifications/badges',
            name: 'Badges',
            component: () => import('@/views/notifications/Badges.vue'),
          },
          {
            path: '/notifications/modals',
            name: 'Modals',
            component: () => import('@/views/notifications/Modals.vue'),
          },
        ],
      },
      {
        path: '/widgets',
        name: 'Widgets',
        component: () => import('@/views/widgets/Widgets.vue'),
      },
      {
        path: '/smart-table',
        name: 'Smart Table',
        component: () => import('@/views/smart-table/SmartTable.vue'),
      },
      {
        path: '/calendar',
        name: 'Calendar',
        component: () => import('@/views/plugins/Calendar.vue'),
      },
      {
        path: 'apps',
        name: 'Apps',
        redirect: '/apps/invoicing/invoice',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'invoicing',
            redirect: '/apps/invoicing/invoice',
            name: 'Invoicing',
            component: {
              render() {
                return h(resolveComponent('router-view'))
              },
            },
            children: [
              {
                path: 'invoice',
                name: 'Invoice',
                component: () => import('@/views/apps/invoicing/Invoice.vue'),
              },
            ],
          },
        ],
      },
      {
        path: '/games',
        redirect: '/games/peek-a-vue-main',
        name: 'Games',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'peek-a-vue-main',
            name: 'Peek-a-vue-main',
            component: () =>
              import('@/views/games/peek-a-vue-main/peek-a-vue-main.vue'),
          },
        ],
      },
      {
        path: 'ketoan/dm-ketoan',
        redirect: '/ketoan/dm-ketoan/dmtkhoan-kt',
        name: 'dm-ketoan',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: '/ketoan/dm-ketoan/dmtkhoan-kt',
            name: 'Dmtkhoan-kt',
            component: () => import('@/views/ketoan/dm-ketoan/Dmtkhoan-kt'),
          },
          {
            path: '/ketoan/dm-ketoan/dmtiente-kt',
            name: 'Dmtiente-kt',
            component: () => import('@/views/ketoan/dm-ketoan/Dmtiente-kt'),
          },
          {
            path: '/ketoan/dm-ketoan/customer-kt',
            name: 'Customer-kt',
            component: () => import('@/views/ketoan/dm-ketoan/Customer-kt'),
          },
          {
            path: '/ketoan/dm-ketoan/Dmsodutk-kt',
            name: 'Dmsodutk-kt',
            component: () => import('@/views/ketoan/dm-ketoan/Dmsodutk-kt'),
          },
        ],
      },
      {
        path: 'ketoan/dm-hanghoa',
        redirect: '/ketoan/dm-hanghoa/tenhang-kt',
        name: 'dm-hanghoa',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: '/ketoan/dm-hanghoa/tenhang-kt',
            name: 'tenhang-kt',
            component: () => import('@/views/ketoan/dm-hanghoa/Tenhang-kt'),
          },
          {
            path: '/ketoan/dm-hanghoa/dmtenkho-kt',
            name: 'dmtenkho-kt',
            component: () => import('@/views/ketoan/dm-hanghoa/Dmtenkho-kt'),
          },
          {
            path: '/ketoan/dm-hanghoa/dmkhohang-kt',
            name: 'dmkhohang-kt',
            component: () => import('@/views/ketoan/dm-hanghoa/Dmkhohang-kt'),
          },
        ],
      },
      {
        path: '/users',
        redirect: '/users',
        name: 'Users',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: '/users',
            name: 'Users',
            component: () => import('@/views/users/Users'),
          },
          {
            path: '/users/:file',
            name: 'Users_',
            meta: { isAdmin: true },
            component: () => import('@/views/users/Users'),
          },
          // {
          //   path: ':id',
          //   name: 'User',
          //   component: () => import('@/views/users/User'),
          // }
        ],
      },
      {
        path: '/ketoan',
        redirect: '/ketoan/chungtu-kt',
        name: 'Ketoan',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'chungtu-kt',
            name: 'Chungtu-kt',
            component: () => import('@/views/ketoan/Chungtu-kt.vue'),
          },
          {
            path: 'connect_kt',
            name: 'Connect_kt',
            component: () => import('@/views/ketoan/Connect-kt.vue'),
          },
          {
            path: 'connect_kt',
            name: 'Connect_kt',
            component: () => import('@/views/ketoan/Connect-kt.vue'),
          },
          {
            path: 'user_kt',
            name: 'User_kt',
            component: () => import('@/views/ketoan/User-kt.vue'),
          },
          {
            path: 'contact',
            name: 'Contact',
            component: () => import('@/views/ketoan/Contact.vue'),
          },
          {
            path: 'reports/inphieuketoan/:ctid',
            name: 'Inphieuketoan',
            component: () => import('@/views/ketoan/reports/Inphieuketoan'),
          },
          {
            path: 'reports/inphieunhapxuat/:ctid',
            name: 'Inphieunhapxuat',
            component: () => import('@/views/ketoan/reports/Inphieunhapxuat'),
          },
          {
            path: 'reports/inphieuthuchi/:ctid',
            name: 'Inphieuthuchi',
            component: () => import('@/views/ketoan/reports/Inphieuthuchi'),
          },
          {
            path: 'reports/inhoadon/:ctid',
            name: 'Inphoadon',
            component: () => import('@/views/ketoan/reports/Inhoadon'),
          },
          {
            path: 'bc-ketoan/cdketoan-kt',
            name: 'Cdketoan',
            component: () => import('@/views/ketoan/bc-ketoan/Cdketoan-kt'),
          },
          {
            path: 'bc-ketoan/ketquakd-kt',
            name: 'Ketquakd',
            component: () => import('@/views/ketoan/bc-ketoan/Ketquakd-kt'),
          },
          {
            path: 'bc-ketoan/lctiente-kt',
            name: 'Lctiente',
            component: () => import('@/views/ketoan/bc-ketoan/Lctiente-kt'),
          },
          {
            path: 'bc-ketoan/invoices-e',
            name: 'Invoices-E',
            component: () => import('@/views/ketoan/bc-ketoan/Invoices-E'),
          },
          {
            path: '/documents',
            name: 'Documents',
            component: () => import('@/views/ketoan-nl/DocumentList'),
          },
        ],
      },
      // ================ ecommerce =============
      {
        path: 'ecommerce',
        redirect: '/e-commerce/home',
        name: 'ecommerce',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: '/e-commerce/home',
            name: 'homecomerce',
            component: () => import('@/views/e-commerce/Homecomerce'),
          },
          {
            path: '/e-commerce/products',
            name: 'products',
            component: () => import('@/views/e-commerce/Products'),
          },
          {
            path: '/e-commerce/transaction',
            name: 'transaction',
            component: () => import('@/views/e-commerce/Transaction'),
          },
          {
            path: '/e-commerce/orders',
            name: 'orders',
            component: () => import('@/views/e-commerce/Orders'),
          },
          {
            path: '/e-commerce/about',
            name: 'about',
            component: () => import('@/views/e-commerce/About'),
          },
          {
            path: '/e-commerce/products/:id',
            name: 'productDetails',
            component: () => import('@/components/products/ProductDetail.vue'),
          },
          {
            path: '/e-commerce/cart',
            name: 'cart',
            component: () =>
              import('@/components/products/cart/CartProducts.vue'),
          },
          {
            path: '/e-commerce/checkout',
            name: 'checkout',
            component: () => import('@/components/products/cart/Checkout.vue'),
          },
          {
            path: '/e-commerce/success',
            name: 'success',
            component: () => import('@/views/e-commerce/Homecomerce'),
            // Xử lý thành công ----> created().CardTemplate()
          },
        ],
      },
    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: 'register/:id',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
      {
        path: 'author',
        name: 'Author',
        component: () => import('@/views/pages/Author'),
      },
    ],
  },
  {
    path: '/apps/email',
    redirect: '/apps/email/inbox',
    name: 'Email',
    component: () => import('@/views/apps/email/EmailApp.vue'),
    children: [
      {
        path: 'compose',
        name: 'Compose',
        component: () => import('@/views/apps/email/Compose.vue'),
      },
      {
        path: 'inbox',
        name: 'Inbox',
        component: () => import('@/views/apps/email/Inbox.vue'),
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('@/views/apps/email/Message.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
