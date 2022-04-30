<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderBrand class="mx-auto d-lg-none" to="/">
        <!-- <CIcon :icon="logo" height="48" alt="Logo" /> -->
        <img
          src="logo_black.png"
          class="c-avatar-img"
          style="width 80%; height: 60%; border-radius: 50em;"
        />
      </CHeaderBrand>
      <CHeaderNav class="d-none d-md-flex me-auto">
        <CNavItem>
          <CNavLink href="#/dashboard"> {{ $t('nav.dashboard') }} </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#/users/0"> {{ $t('nav.users') }}</CNavLink>
        </CNavItem>
        <CNavItem>
          <!-- <CNavLink href="#" @click="logout">Settings</CNavLink> -->
          <CNavLink href="#" @click="logout">{{ $t('nav.settings') }}</CNavLink>
        </CNavItem>
      </CHeaderNav>
      <CHeaderNav class="ms-auto me-4">
        <CButtonGroup aria-label="Theme switch">
          <CFormCheck
            id="btn-light-theme"
            type="radio"
            :button="{ color: 'primary' }"
            name="theme-switch"
            autocomplete="off"
            :checked="$store.state.theme === 'default'"
            @change="
              (event) =>
                $store.commit({
                  type: 'toggleTheme',
                  value: 'default',
                })
            "
          >
            <template #label><CIcon icon="cil-sun" /></template>
          </CFormCheck>
          <CFormCheck
            id="btn-dark-theme"
            type="radio"
            :button="{ color: 'primary' }"
            name="theme-switch"
            autocomplete="off"
            :checked="$store.state.theme === 'dark'"
            @change="
              (event) =>
                $store.commit({
                  type: 'toggleTheme',
                  value: 'dark',
                })
            "
          >
            <template #label><CIcon icon="cil-moon" /></template>
          </CFormCheck>
        </CButtonGroup>
      </CHeaderNav>
      <CHeaderNav class="me-4">
        <AppHeaderLanguage />
        <!-- <AppHeaderDropdownNotif /> -->
        <AppHeaderDropdownTasks />
        <!-- <AppHeaderDropdownMssgs /> -->
      </CHeaderNav>
      <CHeaderNav class="ms-3 me-4">
        <AppHeaderDropdownAccnt />
      </CHeaderNav>
      <CHeaderToggler class="px-md-0 me-md-3">
        <CIcon
          icon="cil-applications-settings"
          size="lg"
          @click="$store.commit('toggleAside')"
        />
      </CHeaderToggler>
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid>
      <AppBreadcrumb />
      <!-- isLoading -->
      <!-- <div v-if="this.$store.getters.isLoading" class="pull-right-progress"> -->
      <div
        v-if="this.$store.getters.isLoading"
        class="pull-right-progress"
        style="height: 2rem; margin-top: -0.4rem"
      >
        <button class="btn btn-primary" type="button" disabled>
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span class="visually-hidden">Loading...</span></button
        >&nbsp;
        <button class="btn btn-primary" type="button" disabled>
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Loading...
        </button>
      </div>
      <!-- isLoading -->
    </CContainer>
  </CHeader>
</template>

<script>
import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
// import AppHeaderDropdownMssgs from './AppHeaderDropdownMssgs'
// import AppHeaderDropdownNotif from './AppHeaderDropdownNotif'
import AppHeaderDropdownTasks from './AppHeaderDropdownTasks'
import AppHeaderLanguage from './AppHeaderLanguage'

//import { logo } from '@/assets/brand/logo'
import { useStore } from 'vuex'

export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
    AppHeaderDropdownAccnt,
    // AppHeaderDropdownMssgs,
    // AppHeaderDropdownNotif,
    AppHeaderDropdownTasks,
    AppHeaderLanguage,
  },
  setup() {
    const store = useStore()
    const logout = () => {
      //if(!confirm('Đăng xuất và thiết lập thông tin - chứng từ - Doanh nhiệp ? ')){ return;}
      store.dispatch('logout')
      //delete window.axios.defaults.headers.common['Authorization']
      console.log('loggout !!!')
      //this.$router.push('/page/login')
      location.reload()
    }
    return {
      // logo,
      logout,
    }
  },
}
</script>
