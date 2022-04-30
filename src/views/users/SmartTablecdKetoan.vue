<template>
  <CSmartTable
    :active-page="1"
    cleaner
    column-sorter
    :columns="columns"
    clickable-rows
    header
    :items-per-page="10"
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
        <!-- <a
          @click="toggleDetails(item, index)"
          class="fa fa-eye text-secondary mr-1"
          id="3"
        ></a> -->
        <a
          @click="toggleDetails(item, index)"
          class="fa fa-trash-o text-warning mr-1"
          id="2"
        ></a>

        <!-- <CBadge
          @click="toggleDetails(item, index)"
          :color="getBadge(item.status)"
          >{{ Boolean(item._toggled) ? 'Hide' : 'Show' }}</CBadge
        > -->
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
            Tên tài sản: {{ item.tentsc + ' # ' + item.tentsn }}
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
const { numberFormat } = require('@/views/ketoan-nl/utility')

export default {
  name: 'SmartTablecdKetoan',
  data() {
    return {}
  },
  created() {
    this.infoketoan = this.$jwtAcn.getKetoan()
  },
  async mounted() {
    //await this.$store.dispatch('myDocument/GET_CDKETOAN')
    this.$store.commit('set', ['isLoading', true])
    this.$apiAcn
      .post('/cdketoan', this.infoketoan)
      .then((data) => {
        this.items = data.data['cdketoan']
        this.items.forEach((item) => {
          item.tscd = numberFormat(item['tscd'], 0, ',', '.')
          item.tscc = numberFormat(item['tscc'], 0, ',', '.')
          item.tsnd = numberFormat(item['tsnd'], 0, ',', '.')
          item.tsnc = numberFormat(item['tsnc'], 0, ',', '.')
        })
      })
      .then(() => {
        this.$store.commit('set', ['isLoading', false])
        //console.log(this.items)
      })
      .catch((err) => {
        console.log(err)
        this.$store.commit('set', ['isLoading', false])
      })
  },

  setup() {
    // const store = useStore()
    // onMounted(async () => {
    //   await store.dispatch('myDocument/GET_DM_USERS')
    // })
    const columns = [
      'masc',
      'tentsc',
      'tscc',
      'tscd',
      'masn',
      'tentsn',
      'tsnc',
      'tsnd',
      {
        key: 'show_details',
        label: 'Thực hiện',
        filter: false,
        sorter: false,
      },
    ]

    // Phải có ref()
    const items = ref([
      {
        masc: null,
        tentsc: null,
        tscc: null,
        tscd: null,
        masn: null,
        tentsn: null,
        tsnc: null,
        tsnd: null,
      },
    ])

    const getBadge = (masc) => {
      switch (masc) {
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
