<template>
  <CSmartTable
    :active-page="1"
    cleaner
    column-sorter
    :columns="columns"
    clickable-rows
    header
    :items-per-page="7"
    :items-per-page-options="[5, 10, 20, 50, 100]"
    items-per-page-label="Số dòng /trang"
    items-per-page-select
    :items="items"
    pagination
    table-filter
    :table-props="{
      striped: true,
      hover: true,
    }"
    :tableHeadProps="{
      color: 'info',
    }"
  >
    <template #status="{ item }">
      <td>
        <CBadge :color="getBadge(item.status)">{{ item.status }}</CBadge>
      </td>
    </template>
    <template #show_details="{ item, index }">
      <td class="py-2">
        <a
          @click="toggleDetails(item, index)"
          class="fa fa-pencil-square-o text-info mr-1"
          id="1"
        ></a>
        <a
          @click="toggleDetails(item, index)"
          class="fa fa-trash-o text-warning mr-1"
          id="2"
        ></a>

        <CBadge
          @click="toggleDetails(item, index)"
          :color="getBadge(item.status)"
          >{{ Boolean(item._toggled) ? 'Hide' : 'Show' }}</CBadge
        >
        <!-- <CButton
          color="primary"
          variant="outline"
          square
          size="sm"
          @click="toggleDetails(item, index)"
        >
          {{ Boolean(item._toggled) ? 'Hide' : 'Show' }}
        </CButton> -->
      </td>
    </template>
    <template #details="{ item }">
      <CCollapse :visible="Boolean(item._toggled)">
        <CCardBody>
          <h4>
            {{ item.username }}
          </h4>
          <p class="text-muted">
            Databases: {{ item.database || item.databases }}
          </p>
          <CButton
            @click="toggleDetails(item, index)"
            size="sm"
            color="info"
            class=""
          >
            User Settings
          </CButton>
          <CButton
            @click="toggleDetails(item, index)"
            size="sm"
            color="danger"
            class="ml-1"
          >
            Delete
          </CButton>
        </CCardBody>
      </CCollapse>
    </template>
  </CSmartTable>
</template>

<script>
import { ref } from 'vue'
//import data from '../smart-table/_data'
// import { onMounted } from 'vue'
// import { useStore } from 'vuex'

export default {
  name: 'SmartTableUsers',
  data() {
    return {}
  },
  async mounted() {
    await this.$store.dispatch('myDocument/GET_DM_USERS')
    this.items = this.$store.state.myDocument.danhmucUsers
    //console.log(111, this.items)
  },

  setup() {
    // const store = useStore()
    // onMounted(async () => {
    //   await store.dispatch('myDocument/GET_DM_USERS')
    // })

    const columns = [
      {
        key: 'username',
        _style: { width: '40%' },
      },
      'email',
      { key: 'registered', _style: { width: '20%' } },
      { key: 'role', _style: { width: '20%' } },
      {
        key: 'show_details',
        label: 'Thực hiện',
        _style: { width: '1%' },
        filter: false,
        sorter: false,
      },
    ]

    // Phải có ref()
    const items = ref([
      {
        username: null,
        registered: null,
        email: null,
        role: null,
        status: null,
      },
    ])

    const getBadge = (status) => {
      switch (status) {
        case 'Active':
          return 'success'
        case 'Inactive':
          return 'secondary'
        case 'Pending':
          return 'warning'
        case 'Banned':
          return 'danger'
        default:
          'primary'
      }
    }

    const toggleDetails = (item) => {
      item._toggled = !item._toggled
      items.value[item.id] = {
        ...item,
        // _toggled: !item._toggled,
      }
    }

    return {
      columns,
      items,
      getBadge,
      toggleDetails,
    }
  },
}
</script>
