<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" :caret="false">
      <!-- <CIcon class="my-1 mx-2" icon="cil-bell" size="lg" /> -->
      <img
        :src="`/flag_${$i18n.locale}.svg`"
        alt="flag"
        style="height: 23px; width: 23px"
      />
      <!-- <CBadge
        class="position-absolute top-0 end-0"
        color="danger-gradient"
        shape="rounded-pill"
        >{{ itemsCount }}</CBadge
      > -->
    </CDropdownToggle>

    <!-- <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img
            :src="`/flag_${$i18n.locale}.svg`"
            alt="flag"
            style="height: 23px; width: 23px"
          />
        </div>
        <p class="user_name_max">{{ $t('navRight.Display') }}</p>
      </CHeaderNavLink>
    </template> -->

    <!-- <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>{{ $t('Language') }}</strong>
    </CDropdownHeader> -->

    <CDropdownMenu class="pt-0">
      <CDropdownHeader tag="div" class="text-center" color="light">
        <strong>{{ $t('Language') }}</strong>
      </CDropdownHeader>
      <CDropdownItem @click="setLocale('vn')">
        <img src="/flag_vn.svg" alt="flag" style="height: 20px; width: 20px" />
        <CIcon /> Việt Nam
      </CDropdownItem>

      <CDropdownItem @click="setLocale('en')">
        <img src="/flag_en.svg" alt="flag" style="height: 20px; width: 20px" />
        <CIcon /> English
      </CDropdownItem>

      <CDropdownItem @click="setLocale('ko')">
        <img src="/flag_ko.svg" alt="flag" style="height: 20px; width: 20px" />
        <CIcon /> Koréa
      </CDropdownItem>

      <CDropdownItem @click="setLocale('ar')">
        <img src="/flag_ar.svg" alt="flag" style="height: 20px; width: 20px" />
        <CIcon /> Ả Rập
      </CDropdownItem>

      <CDropdownHeader tag="div" class="text-center" color="light">
        <strong>{{ $t('navRight.Colors') }}</strong>
      </CDropdownHeader>
      <CDropdownItem @click="setColor('default')">
        <img src="/he.svg" alt="flag" style="height: 20px; width: 20px" />
        <CIcon /> CoreUI Vue
      </CDropdownItem>

      <CDropdownItem @click="setColor('lte')">
        <img src="/su.svg" alt="flag" style="height: 20px; width: 20px" />
        <CIcon /> AdminLTE Vue
      </CDropdownItem>
      <CDropdownItem @click="setColor('windows')">
        <img src="/lb.svg" alt="flag" style="height: 20px; width: 20px" />
        <CIcon /> Windows Vue
      </CDropdownItem>
      <CDropdownItem @click="setColor('winword')">
        <img src="/hn.svg" alt="flag" style="height: 20px; width: 20px" />
        <CIcon /> Winword Vue
      </CDropdownItem>
      <CDropdownItem @click="setColor('legacy')">
        <img src="/lb.svg" alt="flag" style="height: 20px; width: 20px" />
        <CIcon /> Legacy Vue
      </CDropdownItem>
      <CDropdownItem @click="setColor('dark')">
        <img src="/hn.svg" alt="flag" style="height: 20px; width: 20px" />
        <CIcon /> Dark Mode
      </CDropdownItem>

      <!-- <CDropdownHeader class="bg-light">
        <strong>You have {{ itemsCount }} notifications</strong>
      </CDropdownHeader>
      <CDropdownItem>
        <CIcon icon="cil-user-follow" class="text-success" /> New user
        registered
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-user-unfollow" class="text-danger" /> User deleted
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-chart-pie" class="text-info" /> Sales report is ready
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-basket" class="text-primary" /> New client
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-speedometer" class="text-warning" /> Server overloaded
      </CDropdownItem>
      <CDropdownHeader class="bg-light">
        <strong>Server</strong>
      </CDropdownHeader>
      <CDropdownItem class="d-block">
        <div class="text-uppercase mb-1">
          <small><b>CPU Usage</b></small>
        </div>
        <CProgress thin color="info-gradient" :value="25" />
        <small class="text-muted">348 Processes. 1/4 Cores.</small>
      </CDropdownItem>
      <CDropdownItem class="d-block">
        <div class="text-uppercase mb-1">
          <small><b>Memory Usage</b></small>
        </div>
        <CProgress thin color="warning-gradient" :value="70" />
        <small class="text-muted">11444GB/16384MB</small>
      </CDropdownItem>
      <CDropdownItem class="d-block">
        <div class="text-uppercase mb-1">
          <small><b>SSD 1 Usage</b></small>
        </div>
        <CProgress thin color="danger-gradient" :value="90" />
        <small class="text-muted">243GB/256GB</small>
      </CDropdownItem> -->
    </CDropdownMenu>
  </CDropdown>
</template>
<script>
export default {
  name: 'TheHeaderLanguage',
  data() {
    return {
      itemsCount: 42,
      username: '',
    }
  },
  methods: {
    setColor(theme) {
      this.$store.commit('toggleTheme', theme)
    },
    setLocale(locale) {
      this.$i18n.locale = locale
      this.$store.state.locale = locale
      var info = this.$jwtAcn.getKetoan()
      info.locale = locale
      this.$jwtAcn.saveKetoan(info) // Cho load TheSidebar.vue & Change view trong App.vue
      //this.$message({ message: 'Switch Language : ' + locale, type: 'success' })
      //if(!this.$route.path.includes('dashboard')) this.$router.push('/')
      location.reload() // ;this.$router.push('/')
    },
    routeExp() {
      // console.log(this);
      location.href = location.origin + '/exp'
    },
  },
  mounted() {
    //console.log(this.$jwtAcn.getUser('username'))
    this.username = this.$store.getters.username
    // console.log('this.$i18n.locale: ', this.$i18n.locale)
  },
}
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>
