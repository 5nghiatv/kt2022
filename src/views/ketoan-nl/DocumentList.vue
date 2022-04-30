<template>
  <div class="invoicefb">
    <Loading v-show="loading" />
    <div v-if="documentsLoaded">
      <div v-if="!mobile" class="appinv flex flex-column">
        <Navigation />
        <div class="appinv-content flex flex-column">
          <!-- <Modal v-if="modalActive" /> -->
          <!-- Chú ý: Chữ in & thường -->
          <!-- <router-view /> -->
          <DocumentView v-if="showDocumentView" />
          <!-- ========Thứ tự trên dưới RẤT QUAN TRỌNG============ -->
          <HomeDocument />
          <transition name="invoice">
            <DocumentModal v-if="documentModal" />
          </transition>
          <transition name="invoice">
            <DocListModal v-if="docListModal" />
          </transition>
        </div>
      </div>
      <div v-else class="mobile-message flex flex-column">
        <h2>Sorry, this app is not supported on Mobile Devices</h2>
        <p>To use this app, please use a computer or Tablet</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Navigation from './components/Navigation'
import DocListModal from './components/DocListModal' // Dùng cho Add-New-List
import DocumentModal from './components/DocumentModal' // Dùng cho Add-Edit- EditAdd
import HomeDocument from './views/HomeDocument'
import DocumentView from './views/DocumentView'
import Loading from './components/Loading'

export default {
  data() {
    return {
      mobile: null,
      loading: null,
    }
  },
  components: {
    Navigation,
    HomeDocument,
    DocumentView,
    DocListModal,
    DocumentModal,
    Loading,
  },
  beforeMount() {},
  mounted() {
    //this.$store.commit('toggleSidebarDesktop');
    //console.log(111,'at mounted:',this.documentModal, this.modalActive, this.documentsLoaded)
  },
  async created() {
    //this.loading = true;  // Không tác dụng
    this.$store.commit('set', ['isLoading', true])
    await this.GET_DOCUMENTS()
    this.$store.commit('set', ['isLoading', false])
    //this.loading = false;
    this.DM_ACCOUNT_LOADED()
    this.checkScreen()
    window.addEventListener('resize', this.checkScreen)
  },
  methods: {
    ...mapActions('myDocument', [
      'DM_ACCOUNT_LOADED',
      'GET_DOCUMENTS',
      'GET_DM_TAIKHOAN',
      'GET_DM_CUSTOMER',
      'GET_DM_TENHANG',
      'GET_DM_KHOHANG',
    ]),
    checkScreen() {
      const windowWidth = window.innerWidth
      if (windowWidth <= 750) {
        this.mobile = true
        return
      }
      this.mobile = false
    },
  },
  computed: {
    ...mapState('myDocument', [
      'showDocumentView',
      'docListModal',
      'documentModal',
      'docChitietModal',
      'docVattuModal',
      'docHoadonModal',
      'modalActive',
      'documentsLoaded',
    ]),
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.invoicefb {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.appinv {
  background-color: #141625;
  min-height: 100vh;

  @media (min-width: 900px) {
    flex-direction: row !important;
  }
  .appinv-content {
    padding: 0 20px;
    flex: 1;
    position: relative;
  }
}

.mobile-message {
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141625;
  color: #fff;

  p {
    margin-top: 16px;
  }
}

// animated invoice

.invoice-enter-active,
.invoice-leave-active {
  transition: 0.8s ease all;
}

.invoice-enter-from,
.invoice-leave-to {
  transform: translateX(-700px);
}

button,
.button {
  cursor: pointer;
  //padding: 16px 24px; // Quá nguy hiểm phải chuyển vào trong scoped
  border-radius: 30px;
  border: none;
  font-size: 14px;
  margin-right: 8px;
  color: #fff;
}

.dark-purple {
  background-color: #252945;
}

.red {
  background-color: #ec5757;
}

.purple {
  background-color: #7c5dfa;
}

.green {
  background-color: #33d69f;
}

.orange {
  background-color: #ff8f00;
}

// utility classes

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.container {
  width: 100%;
  padding: 40px 10px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 900px) {
    padding-top: 0px;
  }
}

.nav-link {
  text-decoration: none;
  color: initial;
}

// Status Button Styling

.status-button {
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }
  font-size: 14px;
  margin-right: 30px;
  align-items: center;
  padding: 5px 20px;
  border-radius: 10px;
}
.status-no-button {
  &::before {
    width: 0px;
    height: 0px;
  }
}
.paid {
  &::before {
    background-color: #33d69f;
  }
  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);
}

.pending {
  &::before {
    background-color: #ff8f00;
  }
  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);
}

.draft {
  &::before {
    background-color: #aea0e9;
  }
  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);
}
.draft_old {
  &::before {
    background-color: #dfe3fa;
  }
  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);
}

.work-items {
  .item-list {
    width: 100%;

    // Item Table Styling
    .table-heading,
    .table-items {
      gap: 16px;
      font-size: 14px;

      .item-name {
        flex-basis: 50%;
      }
      .item50 {
        flex-basis: 50%;
      }
      .item45 {
        flex-basis: 45%;
      }
      .item40 {
        flex-basis: 40%;
      }
      .item30 {
        flex-basis: 30%;
      }
      .item25 {
        flex-basis: 25%;
      }
      .item20 {
        flex-basis: 20%;
      }
      .item15 {
        flex-basis: 15%;
      }
      .item10 {
        flex-basis: 10%;
      }
      .item7 {
        flex-basis: 7%;
      }
      .item5 {
        flex-basis: 5%;
      }

      .qty {
        flex-basis: 10%;
      }

      .price {
        flex-basis: 20%;
      }

      .total {
        flex-basis: 20%;
        align-self: center;
      }
    }

    .table-heading {
      margin-bottom: 16px;

      th {
        text-align: left;
      }
    }

    .table-items {
      position: relative;
      margin-bottom: 24px;

      img {
        position: absolute;
        top: 15px;
        right: 0;
        width: 12px;
        height: 16px;
      }
    }
  }

  .button {
    color: #fff;
    background-color: #252945;
    align-items: center;
    justify-content: center;
    width: 100%;

    img {
      margin-right: 4px;
    }
  }
}
</style>

<style>
.multiselect-green {
  --ms-tag-bg: #d1fae5;
  --ms-tag-color: #059669;
}
.multiselect-blue {
  --ms-bg: white;
  --ms-border-color: white;
}
.multiselect-dark {
  --ms-bg: #1e2139;
  --ms-border-color: #1e2139;
}
.multiselect-option {
  width: 530px;
  color: burlywood;
  background-color: var(--ms-bg);
}
.multiselect-search {
  background-color: var(--ms-bg);
  border-radius: 4px;
  outline: var(--ms-bg);
}
.multiselect-dropdown {
  width: 550px;
  height: 550px;
  border: var(--ms-bg);
}
.multiselect-clear-icon {
  background-color: var(--ms-bg);
  display: none;
}
.multiselect-option {
  width: 530px;
  background-color: var(--ms-bg);
  color: burlywood;
}
.multiselect-search {
  background-color: var(--ms-bg);
  border-radius: 4px;
  outline: var(--ms-bg);
}
.typo__label {
  margin-top: 10px;
}
</style>
