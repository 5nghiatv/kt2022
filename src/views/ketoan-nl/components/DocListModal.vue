<template>
  <div
    @click="checkClick"
    ref="invoiceWrap"
    class="invoice-wrap flex flex-column"
  >
    <ModalPublic @resSubmit="resSubmit" v-if="modalActiveNew" />

    <form @submit.prevent="submitForm" class="invoice-content">
      <Loading v-show="loading" />
      <!-- <h1 v-if="!editInvoice">New Document</h1>
      <h1 v-else>Edit Document</h1> -->
      <div class="save flex">
        <button
          class="left"
          :class="{
            paid: setColorNumber('paid'),
            draft: setColorNumber('draft'),
            pending: setColorNumber('pending'),
          }"
          disabled
          style="
            font: caption;
            font-weight: 600;
            margin-top: 45px;
            margin-bottom: 40px;
          "
        >
          DANH MỤC KẾ TOÁN
        </button>
      </div>

      <!-- header flex -->
      <div class="header flex">
        <ModalPublic @resSubmit="resSubmit" v-if="modalActiveNew" />

        <div class="left flex">
          <span>Status</span>
          <div
            class="status-button flex"
            :class="{
              paid: setColorNumber('paid'),
              draft: setColorNumber('draft'),
              pending: setColorNumber('pending'),
            }"
          >
            <span v-if="setColorNumber('paid')">Options</span>
            <span v-if="setColorNumber('draft')">Options</span>
            <span v-if="setColorNumber('pending')">Options</span>

            <div class="radio">
              <label
                ><input
                  @click="chonOptKetoan(0)"
                  type="radio"
                  id="optradio_0"
                  checked
                />{{ optKetoan[0] }}</label
              >
            </div>
            <div class="radio">
              <label
                ><input
                  @click="chonOptKetoan(1)"
                  type="radio"
                  id="optradio_1"
                />{{ optKetoan[1] }}</label
              >
            </div>
            <div class="radio">
              <label
                ><input
                  @click="chonOptKetoan(2)"
                  type="radio"
                  id="optradio_2"
                />{{ optKetoan[2] }}</label
              >
            </div>
            <div class="radio">
              <label
                ><input
                  @click="chonOptKetoan(3)"
                  type="radio"
                  id="optradio_3"
                />{{ optKetoan[3] }}</label
              >
            </div>
          </div>
        </div>
      </div>

      <hr />
      <br />
      <!-- <VueMultiSelect
        @getCurrentList="getCurrentList"
        :reloadList="reloadList"
        :currentOpt="currentOpt"
        :modelOpt="modelOpt"
        :titleOpt="2"
      /> -->

      <!-- currentOpt==0 : Tài khoản From -->
      <div v-if="currentOpt == 0" class="bill-from flex flex-column">
        <Multiselect
          v-model="sotk"
          placeholder="Số tài khoản"
          :searchable="true"
          trackBy="value"
          label="value"
          :class="{
            'multiselect-blue': !testTheme('dark'),
            'multiselect-dark': testTheme('dark'),
          }"
          :options="danhmucTaikhoan"
          @select="getDanhmuc()"
        >
          <template v-slot:option="{ option }">
            {{ option.value }} {{ option.tentk }}
          </template>
        </Multiselect>

        <div class="flexbox">
          <div class="flex20 flex-column">
            <label for="billerCity">Tài khoản</label>
            <input
              required
              type="text"
              v-model="taikhoan.sotk"
              minlength="4"
              maxlength="15"
            />
          </div>
          <div class="flex2 flex-column">
            <label for="inputsotien">Tên tài khoản</label>
            <input
              required
              v-model="taikhoan.tentk"
              type="text"
              minlength="10"
            />
          </div>
        </div>
      </div>

      <!-- currentOpt==1 : Khách hàng From -->
      <div v-if="currentOpt == 1" class="bill-from flex flex-column">
        <Multiselect
          v-model="maso"
          placeholder="Mã số thuế"
          :searchable="true"
          trackBy="value"
          label="value"
          :class="{
            'multiselect-blue': !testTheme('dark'),
            'multiselect-dark': testTheme('dark'),
          }"
          :options="danhmucCustomer"
          @select="getDanhmuc()"
        >
          <template v-slot:option="{ option }">
            {{ option.value }} {{ option.company }}
          </template>
        </Multiselect>

        <div class="flexbox">
          <div class="flex70 flex-column">
            <label for="billerCity">Công ty</label>
            <input
              required
              type="text"
              v-model="khachhang.company"
              minlength="10"
            />
          </div>
          <div class="flex2 flex-column">
            <label for="inputsotien">Mã số thuế</label>
            <input
              required
              v-model="khachhang.maso"
              type="text"
              pattern="^[0-9]\d{9,12}$"
            />
          </div>
        </div>
        <div class="flexbox">
          <div class="flex70 flex-column">
            <label for="billerCity">Địa chỉ</label>
            <input
              required
              type="text"
              v-model="khachhang.address"
              minlength="10"
            />
          </div>
          <div class="flex2 flex-column">
            <label for="inputsotien">Mặt hàng</label>
            <input
              required
              v-model="khachhang.ghichu"
              type="text"
              minlength="10"
            />
          </div>
        </div>
      </div>

      <!-- currentOpt==2 : Hàng hóa From -->
      <div v-if="currentOpt == 2" class="bill-from flex flex-column">
        <Multiselect
          v-model="mahang"
          placeholder="Mã hàng"
          :searchable="true"
          trackBy="value"
          label="value"
          :class="{
            'multiselect-blue': !testTheme('dark'),
            'multiselect-dark': testTheme('dark'),
          }"
          :options="danhmucTenhang"
          @select="getDanhmuc()"
        >
          <template v-slot:option="{ option }">
            {{ option.value }} {{ option.tenhang }}
          </template>
        </Multiselect>

        <div class="flexbox">
          <div class="flex60 flex-column">
            <label for="billerCity">Mã hàng</label>
            <input
              required
              type="text"
              v-model="hanghoa.mahang"
              minlength="4"
              maxlength="15"
            />
          </div>
          <div class="flex2 flex-column">
            <label for="inputsotien">Đơn vị</label>
            <input
              required
              v-model="hanghoa.donvi"
              type="text"
              minlength="2"
              maxlength="10"
            />
          </div>
        </div>

        <div class="flexbox">
          <div class="flex2 flex-column">
            <label for="inputsotien">Tên hàng hóa</label>
            <input
              required
              v-model="hanghoa.tenhang"
              type="text"
              minlength="10"
            />
          </div>
        </div>
      </div>

      <!-- currentOpt==3 : Kho hàng From -->
      <div v-if="currentOpt == 3" class="bill-from flex flex-column">
        <Multiselect
          v-model="makho"
          placeholder="Mã kho"
          :searchable="true"
          trackBy="value"
          label="value"
          :class="{
            'multiselect-blue': !testTheme('dark'),
            'multiselect-dark': testTheme('dark'),
          }"
          :options="danhmucKhohang"
          @select="getDanhmuc()"
        >
          <template v-slot:option="{ option }">
            {{ option.value }} {{ option.tengoi }}
          </template>
        </Multiselect>

        <div class="flexbox">
          <div class="flex20 flex-column">
            <label for="billerCity">Mã kho</label>
            <input
              required
              type="text"
              v-model="khohang.makho"
              minlength="3"
              maxlength="3"
            />
          </div>
          <div class="flex2 flex-column">
            <label for="inputsotien">Tên kho hàng</label>
            <input
              required
              v-model="khohang.tengoi"
              type="text"
              minlength="10"
            />
          </div>
        </div>
        <div class="flexbox">
          <div class="flex2 flex-column">
            <label for="inputsotien">Địa chỉ</label>
            <input
              required
              v-model="khohang.diachi"
              type="text"
              minlength="10"
            />
          </div>
        </div>
      </div>

      <!-- Save/Exit -->
      <div class="save flex">
        <div class="left" style="flex: 1">
          <button type="button" @click="closeInvoice" class="red">
            Go Back Docs
          </button>
        </div>
        <div class="right flex" style="flex: 2">
          <button type="submit" class="orange">Delete</button>
          <button type="submit" class="dark-purple">Update</button>
          <button type="submit" class="purple">Create New</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import ModalPublic from './ModalPublic'
import Loading from './Loading'
import { mapActions, mapMutations, mapState } from 'vuex'
const { numberFormat, setColorNumber } = require('../utility')
//import VueMultiSelect from '../components/VueMultiSelect'
import Multiselect from '@vueform/multiselect'
import utility from '@/common/utility'

export default {
  name: 'DocListModal',
  mixins: [utility],
  components: {
    Loading,
    ModalPublic,
    Multiselect,
  },
  data() {
    return {
      optKetoan: ['Tài khoản', 'Khách hàng', 'Hàng hóa', 'Kho hàng'],
      currentOpt: null,
      currentOptValue: null,
      sotk: null,
      maso: null,
      mahang: null,
      makho: null,
      taikhoan: [],
      khachhang: [],
      hanghoa: [],
      khohang: [],
      loading: null,
      selectOpt: {
        options: [],
        code: '',
        name: '',
      },
      options_: null,
      modelOpt: null,
      reloadList: 0,
    }
  },
  updated() {
    //this.setAttributeTag();
  },
  mounted() {
    this.chonOptKetoan(0)
    //console.log(this.selectOpt)
  },
  created() {
    // Phải khởi động mới được
  },
  methods: {
    ...mapMutations('myDocument', ['TOGGLE_DOCUMENT', 'TOGGLE_MODAL_NEW']),

    ...mapActions('myDocument', [
      'DM_ACCOUNT_LOADED',
      'ADD_ACCOUNT_LIST',
      'UPDATE_ACCOUNT_LIST',
      'DELETE_ACCOUNT_LIST',
    ]),

    // getCurrentList(CurrentList) {
    //   this.taikhoan = CurrentList.taikhoan
    //   this.khachhang = CurrentList.khachhang
    //   this.hanghoa = CurrentList.hanghoa
    //   this.khohang = CurrentList.khohang
    // },
    getDanhmuc() {
      if (this.currentOpt == 0) {
        this.taikhoan = this.danhmucTaikhoan.filter(
          (item) => item.value === this.sotk,
        )
        this.taikhoan = this.taikhoan[0]
      }
      if (this.currentOpt == 1) {
        this.khachhang = this.danhmucCustomer.filter(
          (item) => item.value === this.maso,
        )
        this.khachhang = this.khachhang[0]
      }
      if (this.currentOpt == 2) {
        this.hanghoa = this.danhmucTenhang.filter(
          (item) => item.value === this.mahang,
        )
        this.hanghoa = this.hanghoa[0]
      }
      if (this.currentOpt == 3) {
        this.khohang = this.danhmucKhohang.filter(
          (item) => item.value === this.makho,
        )
        this.khohang = this.khohang[0]
      }
    },
    chonOptKetoan(opt) {
      document.getElementById('optradio_0').checked = false
      document.getElementById('optradio_1').checked = false
      document.getElementById('optradio_2').checked = false
      document.getElementById('optradio_3').checked = false
      document.getElementById('optradio_' + opt).checked = true
      this.currentOpt = opt
      this.currentOptValue = null
    },
    numberFormat(x) {
      return numberFormat(x)
    },
    setColorNumber(opt) {
      // Dòng này quá nguy hiểm
      var sotien = 0
      if (this.currentDocumentArray.length > 0)
        sotien = this.currentDocumentArray[0].sotien
      return setColorNumber(opt, sotien)
    },
    resSubmit(ret) {
      this.TOGGLE_MODAL_NEW()
      if (!this.currentModel) {
        if (ret === 'No') {
          setTimeout(() => {
            // Chờ đóng model xong đã
            this.closeInvoice()
          }, 300)
        }
      } else {
        if (ret == 'Yes') this.updateAddDoc('delete')
        else {
          this.currentModel = null
          this.$store.commit('set', ['isLoading', false])
        }
      }
    },
    returnView() {
      setTimeout(() => {
        if (this.currentDocumentArray.length > 0)
          this.$router.push({
            name: 'DocumentView',
            params: { ctid: this.currentDocumentArray[0].ctid },
          })
      }, 1000)
    },
    checkClick(e) {
      // Khi click ngoài cửa sổ hiện hành thì e.target = <div> ngoài cùng = this.$refs.invoiceWrap
      if (e.target === this.$refs.invoiceWrap) {
        this.TOGGLE_MODAL_NEW(
          'Xác nhận tiếp tục Thực hiện bổ sung danh mục hoặc Kết thúc ?',
        )
      }
    },
    closeInvoice() {
      this.TOGGLE_DOCUMENT(4) // Khác nhau với DocumentModal - 4 là edit danh mục
      // this.returnView();
      //console.log(this.editInvoice, this.editAddInvoice)
    },

    async updateAddDoc(mission) {
      this.$store.commit('set', ['isLoading', true])
      //alert(this.optKetoan[this.currentOpt]);
      const danhmuc = {
        ...this.taikhoan,
        ...this.khachhang,
        ...this.hanghoa,
        ...this.khohang,
      }
      var ret = false
      if (mission == 'create')
        ret = await this.ADD_ACCOUNT_LIST({
          danhmuc: { ...danhmuc },
          currentOpt: this.currentOpt,
        })
      if (mission == 'update')
        ret = await this.UPDATE_ACCOUNT_LIST({
          danhmuc: { ...danhmuc },
          currentOpt: this.currentOpt,
        })
      // if(mission == "delete") ret = await this.DELETE_ACCOUNT_LIST({
      //     danhmuc: {...danhmuc},
      //     currentOpt: this.currentOpt
      // });
      if (mission == 'delete') {
        if (!this.currentModel) {
          this.currentModel = mission
          this.TOGGLE_MODAL_NEW(
            'Xác nhận tiếp tục Thực hiện XÓA danh mục hoặc Kết thúc ?',
          )
          return
        } else {
          this.currentModel = null // Phải có
          ret = await this.DELETE_ACCOUNT_LIST({
            danhmuc: { ...danhmuc },
            currentOpt: this.currentOpt,
          })
        }
      }

      if (ret) {
        // await this.DM_ACCOUNT_LOADED()
        //this.reloadList++ // for children Update list & reset var
        this.taikhoan = []
        this.khachhang = []
        this.hanghoa = []
        this.khohang = []
        this.sotk = null
        this.maso = null
        this.mahang = null
        this.makho = null
        this.$toastr.success(
          '',
          mission.toUpperCase() +
            ' danh mục ' +
            this.optKetoan[this.currentOpt] +
            ' thành công.',
        )
      }
      this.$toastr.warning(
        '',
        mission.toUpperCase() +
          ' danh mục ' +
          this.optKetoan[this.currentOpt] +
          ' KHÔNG thành công.',
      )
      this.$store.commit('set', ['isLoading', false])
    },

    submitForm(e) {
      var mission = 'create'
      if (e.submitter.className == 'orange') mission = 'delete'
      if (e.submitter.className == 'dark-purple') mission = 'update'
      if (e.submitter.className == 'purple') mission = 'create'
      this.updateAddDoc(mission)
    },
  },
  computed: {
    ...mapState('myDocument', [
      'danhmucKhohang',
      'danhmucTenhang',
      'danhmucCustomer',
      'danhmucTaikhoan',
      'editInvoice',
      'editAddInvoice',
      'currentDocumentArray',
      'currentInvoiceArray',
      'modalActiveNew',
    ]),
  },

  watch: {
    currentOpt() {
      this.modelOpt = null
    },
  },
}
</script>

<style lang="scss" scoped>
.invoice-wrap {
  button,
  .button {
    padding: 16px 24px !important; // Quá nguy hiểm
  }

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }

  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 750px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: #fff;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }

    h4 {
      color: #7c5dfa;
      font-size: 14px;
      margin-bottom: 24px;
    }

    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    // Invoice Work

    .save {
      margin-top: 40px;

      div {
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }
    }
  }

  .input {
    margin-bottom: 24px;
  }

  label {
    font-size: 14px;
    margin-bottom: 6px;
  }

  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;

    &:focus {
      outline: none;
    }
  }

  .inner-button {
    margin-right: 8px;
    border-radius: 50%;
    padding: 8px;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    img {
      width: 10px;
      height: 10px;
    }
  }

  .radio {
    padding: 10px 10px;
  }
  .status-button {
    width: -webkit-fill-available;
  }
  .header,
  .invoice-details {
    background-color: #1e2139;
    border-radius: 20px;
  }

  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 14px;

    .left {
      flex: 1;
      align-items: center;

      span {
        color: #dfe3fa;
        margin-right: 16px;
      }
    }

    .right {
      flex: 1;
      justify-content: flex-end;

      button {
        color: #fff;
      }
    }
  }

  .flexbox {
    display: flex;
  }
  .flex70 {
    flex: 0 0 70%;
    margin-top: 15px;
    margin-right: 15px;
  }
  .flex60 {
    flex: 0 0 60%;
    margin-top: 15px;
    margin-right: 15px;
  }
  .flex20 {
    flex: 0 0 20%;
    margin-top: 15px;
    margin-right: 15px;
  }
  .flex1 {
    flex: 1;
    margin-top: 15px;
    margin-right: 15px;
  }
  .flex2 {
    flex: 1;
    margin-top: 15px;
  }
  .flex3 {
    flex: 1;
    margin-top: 15px;
  }
}
</style>
