<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader tag="div" class="text-center" color="light">
        <strong>Shopping</strong>
      </CDropdownHeader>
      <CDropdownItem href="#/e-commerce/cart">
        <CIcon class="text-warning" name="cil-cart" /> Giỏ hàng
        <CBadge color="info" class="ml-auto">{{
          this.$store.getters.cartProducts.length
        }}</CBadge>
      </CDropdownItem>

      <CDropdownDivider />

      <CDropdownItem href="#/e-commerce/home">
        <CIcon class="text-info" name="cil-bell" /> Home
        <CBadge color="info" class="ml-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem href="#/e-commerce/products">
        <CIcon class="text-primary" name="cil-Layers" /> All Products
        <!-- <CBadge color="success" class="ml-auto">{{ itemsCount }}</CBadge> -->
      </CDropdownItem>
      <CDropdownItem href="#/e-commerce/transaction">
        <CIcon class="text-success" name="cil-task" /> Transactions
        <CBadge color="danger" class="ml-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem href="#/e-commerce/orders">
        <CIcon name="cil-comment-square" /> Orders
        <CBadge color="warning" class="ml-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>

      <!-- <CDropdownItem href="#/invoice/invoicefb">
        <CIcon name="cilMagnifyingGlass" /> Invoices
        <CBadge color="info" class="ml-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->

      <CDropdownDivider />
      <!-- <CDropdownItem href="#/games/dicegame">
        <CIcon name="cil-basket" /> Dice game
        <CBadge color="secondary" class="ml-auto"></CBadge>
      </CDropdownItem> -->
      <CDropdownHeader tag="div" class="text-center" color="light">
        <strong>Games</strong>
      </CDropdownHeader>
      <CDropdownItem href="#/games/peek-a-vue-main">
        <CIcon class="text-danger" name="cil-basket" /> FipCard game
        <CBadge color="secondary" class="ml-auto"></CBadge>
      </CDropdownItem>

      <!-- <CDropdownItem href="#/games/dragonconquer">
        <CIcon name="cil-basket" /> Dragon conquer
        <CBadge color="secondary" class="ml-auto"></CBadge>
      </CDropdownItem> -->

      <CDropdownDivider />
      <CDropdownItem href="#/e-commerce/about">
        <CIcon class="text-warning" name="cil-User-Female" /> About
        <CBadge color="success" class="ml-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>

      <!-- <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Account
      </CDropdownHeader>
      <CDropdownItem>
        <CIcon icon="cil-bell" /> Updates
        <CBadge color="info-gradient" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-envelope-open" /> Messages
        <CBadge color="success-gradient" class="ms-auto">{{
          itemsCount
        }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-task" /> Tasks
        <CBadge color="danger-gradient" class="ms-auto">{{
          itemsCount
        }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-comment-square" /> Comments
        <CBadge color="warning-gradient" class="ms-auto">{{
          itemsCount
        }}</CBadge>
      </CDropdownItem>
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Settings
      </CDropdownHeader>
      <CDropdownItem> <CIcon icon="cil-user" /> Profile </CDropdownItem>
      <CDropdownItem> <CIcon icon="cil-settings" /> Settings </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-dollar" /> Payments
        <CBadge color="secondary" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-file" /> Projects
        <CBadge color="primary-gradient" class="ms-auto">{{
          itemsCount
        }}</CBadge>
      </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem>
        <CIcon icon="cil-shield-alt" /> Lock Account
      </CDropdownItem>
      <CDropdownItem> <CIcon icon="cil-lock-locked" /> Logout </CDropdownItem> -->
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import avatar1 from '@/assets/images/avatars/8.jpg'
import avatar2 from '@/assets/images/avatars/6.jpg'
import { useStore } from 'vuex'

export default {
  name: 'AppHeaderDropdownAccnt',
  setup() {
    const store = useStore()
    const avatar = store.state.isAdmin ? avatar1 : avatar2

    return {
      avatar: avatar,
      itemsCount: 42,
    }
  },
}
</script>
