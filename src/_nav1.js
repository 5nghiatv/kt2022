//export default [
exports.nav1 = [
  {
    component: 'CNavItem',
    name: 'ACN',
    to: '/documents',
    icon: 'cil-speedometer',
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: 'CNavTitle',
    name: 'Corporate accounting',
  },
  {
    component: 'CNavItem',
    name: 'Accounting Data Entry',
    to: '/ketoan/chungtu-kt',
    icon: 'cil-drop',
  },
  {
    component: 'CNavGroup',
    name: 'Print vouchers',
    to: '/ketoan/reports/inphieuthuchi/All',
    icon: 'cil-print',
    items: [
      {
        component: 'CNavItem',
        name: 'Print the Receipt',
        to: '/ketoan/reports/inphieuthuchi/All',
      },
      {
        component: 'CNavItem',
        name: 'Print the Imp-Export slip',
        to: '/ketoan/reports/inphieunhapxuat/All',
      },
      {
        component: 'CNavItem',
        name: 'Print the Accounting slip',
        to: '/ketoan/reports/inphieuketoan/All',
      },
      {
        component: 'CNavItem',
        name: 'Print invoices',
        to: '/ketoan/reports/inhoadon/All',
      },
      {
        component: 'CNavItem',
        name: 'Print authorization',
        to: '/users/ACCOUNT-uynhiemchi',
        badge: {
          color: 'info',
          text: 'unc',
        },
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Accounting Directory',
    to: '/ketoan/dm-ketoan/dmtkhoan-kt',
    icon: 'cil-cursor',
    items: [
      {
        component: 'CNavItem',
        name: 'Account categories',
        to: '/ketoan/dm-ketoan/dmtkhoan-kt',
      },
      {
        component: 'CNavItem',
        name: 'Currency Category',
        to: '/ketoan/dm-ketoan/dmtiente-kt',
      },
      {
        component: 'CNavItem',
        name: 'Customer Category',
        to: '/ketoan/dm-ketoan/customer-kt',
      },
      {
        component: 'CNavItem',
        name: 'Arising balances',
        to: '/ketoan/dm-ketoan/dmsodutk-kt',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Menu of goods',
    to: '/buttons',
    icon: 'cil-cursor',
    items: [
      {
        component: 'CNavItem',
        name: 'Menu of goods',
        to: '/ketoan/dm-hanghoa/tenhang-kt',
      },
      {
        component: 'CNavItem',
        name: 'Warehouse list',
        to: '/ketoan/dm-hanghoa/dmtenkho-kt',
      },
      {
        component: 'CNavItem',
        name: 'Import Export inventory',
        to: '/ketoan/dm-hanghoa/dmkhohang-kt',
      },
    ],
  },
  //============= Báo cáo Kế toán
  {
    component: 'CNavTitle',
    name: 'Accounting report',
  },
  {
    component: 'CNavItem',
    name: 'Balance Sheet',
    to: '/ketoan/bc-ketoan/cdketoan-kt',
    icon: 'cil-drop',
  },
  {
    component: 'CNavItem',
    name: 'Business results',
    to: '/ketoan/bc-ketoan/ketquakd-kt',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavItem',
    name: 'Cash Flow',
    to: '/ketoan/bc-ketoan/lctiente-kt',
    icon: 'cil-pencil',
  },
  //============= Khai báo Thuế
  {
    component: 'CNavTitle',
    name: 'Tax return',
  },
  {
    component: 'CNavItem',
    name: 'Declaration 01/VAT',
    to: '/users/KK_01_GTGT.xml',
    icon: 'cil-drop',
  },
  {
    component: 'CNavItem',
    name: 'BC26 Invoice Report',
    to: '/users/KK-HOADON-BC26.xml',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavItem',
    name: 'Financial Report-xml',
    to: '/users/KK-BC-TAICHINH.xml',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavItem',
    name: 'Financial Report-xls',
    to: '/users/TM-BC-TAICHINH.xlsx',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavItem',
    name: 'Declaration 03/TNDN',
    to: '/users/KK-03-TNDN.xml',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavGroup',
    name: 'Invoice List',
    to: '/games',
    icon: 'cil-cursor',
    items: [
      {
        component: 'CNavItem',
        name: 'Electronic invoices',
        to: '/ketoan/bc-ketoan/invoices-e',
        icon: 'cil-share-all',
      },
      {
        component: 'CNavItem',
        name: 'List of Input Invoices',
        to: '/users/KK-GTGT-10',
        icon: 'cil-arrow-circle-right',
      },
      {
        component: 'CNavItem',
        name: 'List of Input VAT',
        to: '/users/KK-GTGT-11',
        icon: 'cil-arrow-circle-right',
      },
      {
        component: 'CNavItem',
        name: 'Outcome Invoice List',
        to: '/users/KK-GTGT-20',
        icon: 'cil-arrow-circle-left',
      },
      {
        component: 'CNavItem',
        name: 'List of Output VAT',
        to: '/users/KK-GTGT-21',
        icon: 'cil-arrow-circle-left',
      },
    ],
  },
  // ============= Quản lý Kế toán
  {
    component: 'CNavTitle',
    name: 'Management Accountant',
  },
  {
    component: 'CNavGroup',
    name: 'Backup-restore',
    to: '/games',
    icon: 'cil-cursor',
    items: [
      {
        component: 'CNavItem',
        name: 'Full backup',
        to: '/users/ACCOUNT-backupData',
      },
      {
        component: 'CNavItem',
        name: 'Data sheet backup',
        to: '/users/ACCOUNT-backupTable',
      },
      {
        component: 'CNavItem',
        name: 'Database restore',
        to: '/users/ACCOUNT-restoreData',
        meta: { isAdmin: true },
        badge: {
          color: 'danger',
          text: 'ad',
        },
      },
      {
        component: 'CNavItem',
        name: 'Upgrade Accounting',
        to: '/users/ACCOUNT-vfpupload',
        meta: { isAdmin: true },
        badge: {
          color: 'warning',
          text: 'Vfp',
        },
      },
    ],
  },
  // Quản trị hệ thống
  {
    component: 'CNavGroup',
    name: 'Administrator',
    to: '/games',
    icon: 'cil-cursor',
    items: [
      {
        component: 'CNavItem',
        name: 'Connect Databases',
        to: '/ketoan/connect_kt',
      },
      {
        component: 'CNavItem',
        name: 'Users List',
        to: '/ketoan/user_kt',
      },
    ],
  },
]
