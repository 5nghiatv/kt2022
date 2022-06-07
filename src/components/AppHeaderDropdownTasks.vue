<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" :caret="false">
      <CIcon class="my-1 mx-2" icon="cil-list" size="lg" />
      <CBadge
        class="position-absolute top-0 end-0"
        color="warning-gradient"
        shape="rounded-pill"
        >{{ itemsCount }}</CBadge
      >
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader class="bg-light" style="text-align: center">
        <strong>Account</strong>
      </CDropdownHeader>
      <CDropdownItem class="d-block" @click="calRouter('/users/0')">
        <CIcon icon="cil-user-follow" class="text-success" />
        Thông tin người dùng
      </CDropdownItem>
      <CDropdownItem class="d-block" @click="editUserinfo()">
        <CIcon icon="cil-user-follow" class="text-warning" />
        Sửa thông tin người dùng
      </CDropdownItem>
      <CDropdownItem class="d-block" @click="calRouter('/ketoan/contact')">
        <CIcon icon="cil-user-follow" class="text-primary" />
        Thông tin tác giả
      </CDropdownItem>

      <CDropdownHeader class="bg-light" style="text-align: center">
        <strong>Development</strong>
      </CDropdownHeader>

      <CDropdownItem
        class="d-block"
        href="https://coreui.io/demo/4.0/index.html"
        target="_blank"
      >
        <div class="small mb-1">
          CoreUI Vue Pro-Demo
          <span class="float-right"><strong>60%</strong></span>
        </div>
        <CProgress thin color="info-gradient" :value="60" />
      </CDropdownItem>
      <CDropdownItem
        class="d-block"
        href="https://coreui.io/vue/docs/4.1/getting-started/introduction.html"
        target="_blank"
      >
        <div class="small mb-1">
          CoreUI Vue Pro-Doc
          <span class="float-right"><strong>80%</strong></span>
        </div>
        <CProgress thin color="warning-gradient" :value="80" />
      </CDropdownItem>
      <CDropdownItem
        class="d-block"
        href="https://v3.vuejs.org/guide/introduction.html"
        target="_blank"
      >
        <!-- target="_blank"  Mở trang mới -->
        <div class="small mb-1">
          VueJS 3.x
          <span class="float-right"><strong>100%</strong></span>
        </div>
        <CProgress thin color="success-gradient" :value="100" />
      </CDropdownItem>
      <!-- <CDropdownItem class="text-center border-top">
        <strong>Ketoan.ACN</strong>
      </CDropdownItem> -->
      <!-- <CDropdownDivider /> -->
      <hr />
      <CDropdownHeader class="bg-light" style="text-align: center">
        <strong>Server</strong>
      </CDropdownHeader>

      <CDropdownItem @click="routeExp()">
        <CIcon icon="cil-speedometer" class="text-danger" /><strong>
          Back-End JS</strong
        >
        <CBadge style="float: right" color="success" class="ml-auto">{{
          itemsCount
        }}</CBadge>
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'TheHeaderDropdownTasks',
  data() {
    return { itemsCount: 15 }
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const routeExp = () => {
      location.href = process.env.VUE_APP_URL_LOCAL + '/exp'
    }

    const calRouter = (query) => {
      router.push(query)
    }

    const editUserinfo = () => {
      let id =
        typeof store.state.loggedUser.id != 'undefined'
          ? store.state.loggedUser.id
          : store.state.loggedUser._id
      let path = `/pages/register/${id}`
      store.dispatch('logout')
      router.push(path)
    }

    return {
      calRouter,
      editUserinfo,
      routeExp,
    }
  },
}
</script>
