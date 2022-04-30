<template>
  <CSidebar
    color-scheme="light"
    size="lg"
    overlaid
    placement="end"
    :visible="asideVisible"
  >
    <CSidebarHeader class="bg-transparent p-0">
      <CNav variant="underline">
        <CNavItem>
          <CNavLink @click="updateActiveKey(1)">
            <CIcon icon="cil-List" alt="CoreUI Icons List" />
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink @click="updateActiveKey(2)">
            <CIcon icon="cil-speech" alt="CoreUI Icons Speech" />
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink @click="updateActiveKey(3)">
            <CIcon icon="cil-settings" alt="CoreUI Icons Settings" />
          </CNavLink>
        </CNavItem>
        <CNavItem class="ms-auto me-2 d-flex align-items-center">
          <CCloseButton @click="$store.commit('toggleAside')" />
        </CNavItem>
      </CNav>
    </CSidebarHeader>
    <CTabContent>
      <CTabPane :visible="activeKey == 1">
        <CListGroup flush>
          <CListGroupItem
            class="list-group-item border-start-4 border-start-secondary bg-light text-center fw-bold text-medium-emphasis text-uppercase small"
          >
            Today
          </CListGroupItem>
          <CListGroupItem href="#" class="border-start-4 border-start-warning">
            <CAvatar :src="avatar1" size="lg" class="float-end" />
            <div>Meeting with <strong>Lucas</strong></div>
            <small class="text-medium-emphasis me-3">
              <CIcon icon="cil-calendar" /> 1 - 3pm
            </small>
            <small class="text-medium-emphasis">
              <CIcon icon="cil-location-pin" /> Palo Alto, CA
            </small>
          </CListGroupItem>
          <CListGroupItem href="#" class="border-start-4 border-start-info">
            <CAvatar :src="avatar6" size="lg" class="float-end" />
            <div>Skype with <strong>Megan</strong></div>
            <small class="text-medium-emphasis me-3">
              <CIcon icon="cil-calendar" /> 4 - 5pm
            </small>
            <small class="text-medium-emphasis">
              <CIcon icon="cib-skype" /> On-line
            </small>
          </CListGroupItem>
          <CListGroupItem
            class="border-start-4 border-start-secondary bg-light text-center fw-bold text-medium-emphasis text-uppercase small"
          >
            Tomorrow
          </CListGroupItem>
          <CListGroupItem
            accent="danger"
            href="#"
            class="border-start-4 border-start-danger"
          >
            <div>New UI Project - <strong>deadline</strong></div>
            <small class="text-medium-emphasis me-3">
              <CIcon icon="cil-calendar" /> 10 - 11pm
            </small>
            <small class="text-medium-emphasis">
              <CIcon icon="cil-home" /> creativeLabs HQ
            </small>
            <div class="avatars-stack mt-2">
              <CAvatar :src="avatar2" size="sm" />
              <CAvatar :src="avatar3" size="sm" />
              <CAvatar :src="avatar4" size="sm" />
              <CAvatar :src="avatar5" size="sm" />
              <CAvatar :src="avatar6" size="sm" />
            </div>
          </CListGroupItem>
          <CListGroupItem href="#" class="border-start-4 border-start-success">
            <div><strong>#10 Startups.Garden</strong> Meetup</div>
            <small class="text-medium-emphasis me-3">
              <CIcon icon="cil-calendar" /> 1 - 3pm
            </small>
            <small class="text-medium-emphasis">
              <CIcon icon="cil-location-pin" /> Palo Alto, CA
            </small>
          </CListGroupItem>
          <CListGroupItem
            href="#"
            class="border-start-4 border-start-primary border-bottom"
          >
            <div>
              <strong>Team meeting</strong>
            </div>
            <small class="text-medium-emphasis me-3">
              <CIcon icon="cil-calendar" /> 4 - 6pm
            </small>
            <small class="text-medium-emphasis">
              <CIcon icon="cil-home" /> creativeLabs HQ
            </small>
            <div class="/avatars-stack mt-2">
              <CAvatar :src="avatar2" size="sm" />
              <CAvatar :src="avatar3" size="sm" />
              <CAvatar :src="avatar4" size="sm" />
              <CAvatar :src="avatar5" size="sm" />
              <CAvatar :src="avatar6" size="sm" />
              <CAvatar :src="avatar7" size="sm" />
              <CAvatar :src="avatar8" size="sm" />
            </div>
          </CListGroupItem>
        </CListGroup>
      </CTabPane>
      <CTabPane class="p-3" :visible="activeKey == 2">
        <div class="message">
          <div class="py-3 pb-5 me-3 float-start">
            <CAvatar :src="avatar6" status="success" size="md" />
          </div>
          <div>
            <small class="text-medium-emphasis">Lukasz Holeczek</small>
            <small class="text-medium-emphasis float-end mt-1">1:52 PM</small>
          </div>
          <div class="text-truncate fw-semibold">
            Lorem ipsum dolor sit amet
          </div>
          <small class="text-medium-emphasis">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt...
          </small>
        </div>
        <hr />
        <div class="message">
          <div class="py-3 pb-5 me-3 float-start">
            <CAvatar :src="avatar6" status="success" size="md" />
          </div>
          <div>
            <small class="text-medium-emphasis">Lukasz Holeczek</small>
            <small class="text-medium-emphasis float-end mt-1">1:52 PM</small>
          </div>
          <div class="text-truncate fw-semibold">
            Lorem ipsum dolor sit amet
          </div>
          <small class="text-medium-emphasis">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt...
          </small>
        </div>
        <hr />
        <div class="message">
          <div class="py-3 pb-5 me-3 float-start">
            <CAvatar :src="avatar6" status="success" size="md" />
          </div>
          <div>
            <small class="text-medium-emphasis">Lukasz Holeczek</small>
            <small class="text-medium-emphasis float-end mt-1">1:52 PM</small>
          </div>
          <div class="text-truncate fw-semibold">
            Lorem ipsum dolor sit amet
          </div>
          <small class="text-medium-emphasis">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt...
          </small>
        </div>
        <hr />
        <div class="message">
          <div class="py-3 pb-5 me-3 float-start">
            <CAvatar :src="avatar7" status="success" size="md" />
          </div>
          <div>
            <small class="text-medium-emphasis">Lukasz Holeczek</small>
            <small class="text-medium-emphasis float-end mt-1">1:52 PM</small>
          </div>
          <div class="text-truncate fw-semibold">
            Lorem ipsum dolor sit amet
          </div>
          <small class="text-medium-emphasis">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt...
          </small>
        </div>
        <hr />
        <div class="message">
          <div class="py-3 pb-5 me-3 float-start">
            <CAvatar :src="avatar7" status="success" size="md" />
          </div>
          <div>
            <small class="text-medium-emphasis">Lukasz Holeczek</small>
            <small class="text-medium-emphasis float-end mt-1">1:52 PM</small>
          </div>
          <div class="text-truncate fw-semibold">
            Lorem ipsum dolor sit amet
          </div>
          <small class="text-medium-emphasis">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt...
          </small>
        </div>
      </CTabPane>
      <CTabPane class="p-3" :visible="activeKey == 3">
        <h6>Settings</h6>
        <div>
          <CFormLabel for="customRange4"
            >Thiết lập font-size (
            <strong>{{ fontsize }} </strong>
            )</CFormLabel
          >
          <CFormRange
            @click="changeFontsize()"
            id="customRange4"
            :min="0"
            :max="10"
            :step="5"
            v-model="valueFontsize"
          />

          <div class="clearfix mt-3">
            <CFormSwitch
              @change="settingSwitch('theme')"
              id="DarkMode"
              size="lg"
              label="Dark Mode"
              :checked="getSettingSwitch(theme, 'dark')"
            />
          </div>
          <div>
            <small class="text-medium-emphasis">
              Chế độ màn hình Sáng ( default) hoặc tối ( nocturnal hoặc Dark )
            </small>
          </div>
        </div>

        <div>
          <div class="clearfix mt-4">
            <CFormSwitch
              @change="settingSwitch('Dropbox')"
              id="Dropbox"
              size="lg"
              label="Dropbox"
              :checked="getSettingSwitch(settings.Dropbox, true)"
            />
          </div>
          <div>
            <small class="text-medium-emphasis">
              Sao lưu Database vào tài khoản DropBox 5nghiatv@gmail.com hay
              5nghiatv.acn@gmail.com.
            </small>
          </div>
        </div>

        <div>
          <div class="clearfix mt-3">
            <CFormSwitch
              @change="settingSwitch('Company')"
              id="Company"
              size="lg"
              label="Company"
              :checked="getSettingSwitch(settings.Company, true)"
            />
          </div>
          <div>
            <small class="text-medium-emphasis">
              Chế độ Kế toán dành cho Doanh nghiệp loại nào : Công ty ( Doanh
              nghiệp lớn) hoặc ngược lại là doanh nghiệp nhỏ.
            </small>
          </div>
        </div>

        <div>
          <div class="clearfix mt-3">
            <CFormSwitch
              @change="settingSwitch('FirstMonth')"
              id="FirstMonth"
              size="lg"
              label="FirstMonth"
              :checked="getSettingSwitch(settings.FirstMonth, true)"
            />
          </div>
          <div>
            <small class="text-medium-emphasis">
              Nhập ngày và tháng trong phạm vi `Từ ngày Đến ngày` hoặc chỉ nhập
              ngày trong tháng theo Từ ngày
            </small>
          </div>
        </div>
        <hr />
        <h6>System Utilization</h6>
        <div class="text-uppercase mb-1 mt-4">
          <small>
            <b>CPU Usage</b>
          </small>
        </div>
        <CProgress thin color="info-gradient" :value="25" />
        <small class="text-medium-emphasis">348 Processes. 1/4 Cores.</small>
        <div class="text-uppercase mb-1 mt-2">
          <small>
            <b>Memory Usage</b>
          </small>
        </div>
        <CProgress thin color="warning-gradient" :value="70" />
        <small class="text-medium-emphasis">11444GB/16384MB</small>
        <div class="text-uppercase mb-1 mt-2">
          <small>
            <b>SSD 1 Usage</b>
          </small>
        </div>
        <CProgress thin color="danger-gradient" :value="95" />
        <small class="text-medium-emphasis">243GB/256GB</small>
        <div class="text-uppercase mb-1 mt-2">
          <small>
            <b>SSD 2 Usage</b>
          </small>
        </div>
        <CProgress thin color="success-gradient" :value="10" />
        <small class="text-medium-emphasis">25GB/256GB</small>
      </CTabPane>
    </CTabContent>
  </CSidebar>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import avatar1 from '@/assets/images/avatars/1.jpg'
import avatar2 from '@/assets/images/avatars/2.jpg'
import avatar3 from '@/assets/images/avatars/3.jpg'
import avatar4 from '@/assets/images/avatars/4.jpg'
import avatar5 from '@/assets/images/avatars/5.jpg'
import avatar6 from '@/assets/images/avatars/6.jpg'
import avatar7 from '@/assets/images/avatars/7.jpg'
import avatar8 from '@/assets/images/avatars/8.jpg'

export default {
  name: 'AppAside',
  setup() {
    const store = useStore()
    //console.log(store.state.fontsize)
    const valueFontsize = ref(
      store.state.fontsize == 'small'
        ? 0
        : store.state.fontsize == 'medium'
        ? 5
        : 10,
    )
    const changeFontsize = () => {
      store.state.fontsize =
        valueFontsize.value == 0
          ? 'small'
          : valueFontsize.value == 5
          ? 'medium'
          : 'large'
      store.commit('toggleFontsize', store.state.fontsize)
    }
    const activeKey = ref(1)
    const settingSwitch = (opt) => {
      if (opt == 'theme') {
        store.state.theme = store.state.theme == 'dark' ? 'default' : 'dark'
      } else {
        store.state.settings[opt] = !store.state.settings[opt]
        store.commit('REP_SETTINGS', store.state.settings)
      }
    }
    const getSettingSwitch = computed(() => (opt, value) => {
      //console.log(opt, value)
      return opt == value
    })

    const updateActiveKey = (key) => {
      activeKey.value = key
    }

    return {
      asideVisible: computed(() => store.state.asideVisible),
      theme: computed(() => store.state.theme),
      settings: computed(() => store.state.settings),
      fontsize: computed(() => store.state.fontsize),
      valueFontsize,
      changeFontsize,
      avatar1,
      avatar2,
      avatar3,
      avatar4,
      avatar5,
      avatar6,
      avatar7,
      avatar8,
      activeKey,
      updateActiveKey,
      settingSwitch,
      getSettingSwitch,
    }
  },
}
</script>
