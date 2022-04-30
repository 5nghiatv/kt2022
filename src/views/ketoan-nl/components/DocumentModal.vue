<template>
  <div ref="invoiceWrap" class="invoice-wrap flex flex-column">
    <!-- <div @click="checkClick" ref="invoiceWrap" class="invoice-wrap flex flex-column"> -->
    <!-- <ModalPublic @resSubmit="resSubmit"  v-if="modalActiveNew" /> -->
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
            margin-top: 40px;
            margin-bottom: 40px;
          "
        >
          NHẬP LIỆU KẾ TOÁN
        </button>
      </div>

      <!-- Bill From -->
      <div class="bill-from flex flex-column">
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">Số chứng từ</label>
            <input
              required
              type="text"
              id="billerCity"
              v-model="soct"
              minlength="4"
              maxlength="8"
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Ngày tháng</label>
            <input
              v-mask="'##-##-####'"
              required
              type="text"
              pattern="(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])-\d{4}"
              v-model="ngay"
              title="Dạng ngày DD-MM-YYYY"
            />
          </div>
          <div class="input flex flex-column">
            <label for="inputsotien">Số tiền</label>
            <input
              required
              v-mask-decimal.br="0"
              v-model="sotien"
              type="text"
            />
          </div>
        </div>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Diển giãi</label>
          <input
            required
            type="text"
            id="billerStreetAddress"
            v-model="diengiai"
          />
        </div>
        <div class="location-details flex">
          <label class="typo__label">Tài khoản Nợ</label>
          <Multiselect
            v-model="tkno"
            placeholder="Số tài khoản"
            :searchable="true"
            trackBy="value"
            label="value"
            class="form-control"
            :class="{
              'multiselect-blue': !testTheme('dark'),
              'multiselect-dark': testTheme('dark'),
            }"
            :options="danhmucTaikhoan"
          >
            <template v-slot:option="{ option }">
              <!-- <img class="character-option-icon" :src="option.icon" /> -->
              {{ option.value }} {{ option.tentk }}
            </template>
          </Multiselect>
        </div>

        <div class="location-details flex">
          <label class="typo__label">Tài khoản Có</label>
          <Multiselect
            v-model="tkco"
            placeholder="Số tài khoản"
            :searchable="true"
            trackBy="value"
            label="value"
            class="form-control"
            :class="{
              'multiselect-blue': !testTheme('dark'),
              'multiselect-dark': testTheme('dark'),
            }"
            :options="danhmucTaikhoan"
          >
            <template v-slot:option="{ option }">
              <!-- <img class="character-option-icon" :src="option.icon" /> -->
              {{ option.value }} {{ option.tentk }}
            </template>
          </Multiselect>
        </div>
      </div>

      <!-- Save/Exit -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">
            Cancel
          </button>
        </div>
        <div class="right flex">
          <button v-if="!editInvoice" type="submit" class="purple">
            Create Document
          </button>
          <button
            v-if="editInvoice && !editAddInvoice"
            type="sumbit"
            class="purple"
          >
            Update Document
          </button>
          <button
            v-if="editInvoice && editAddInvoice"
            type="sumbit"
            class="purple"
          >
            Add Document
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
// $(document).ready(function(){
//     console.log("Welcome..."+ new Date());
// });
// import db from "../firebase/firebaseInit";
// let db = window.firebase.firestore();
//import ModalPublic from './ModalPublic'
import Loading from './Loading'
import { mapActions, mapMutations, mapState } from 'vuex'
import moment from 'moment'
const { numberFormat, setColorNumber } = require('../utility')
import Multiselect from '@vueform/multiselect'
import utility from '@/common/utility'
export default {
  name: 'documentModal',
  mixins: [utility],
  components: {
    Loading,
    //ModalPublic,
    Multiselect,
  },
  data() {
    return {
      soct: null,
      ngay: moment(new Date()).format('DD-MM-YYYY'),
      diengiai: null,
      tkno: null,
      tkco: null,
      sotien: null,
      loading: null,
    }
  },
  updated() {
    //this.setAttributeTag();
  },
  mounted() {
    //console.log(this.danhmucTaikhoan);
    // this.options = this.danhmucTaikhoan
    // this.tkno = this.danhmucTaikhoan.filter((item) => item.sotk === this.tkno)
    // this.tkco = this.danhmucTaikhoan.filter((item) => item.sotk === this.tkco)
    // if (this.tkno.length > 0) this.tkno = this.tkno[0]
    // if (this.tkco.length > 0) this.tkco = this.tkco[0]
  },
  created() {
    if (this.editInvoice) {
      // Trừ Edit & add
      const currentDocument = this.currentDocumentArray[0]
      this.id = currentDocument.id
      this.ctid = currentDocument.ctid
      this.soct = currentDocument.soct
      this.ngay = currentDocument.ngay //moment(currentDocument.ngay).format('DD-MM-YYYY');
      this.diengiai = currentDocument.diengiai
      this.tkno = currentDocument.tkno
      this.tkco = currentDocument.tkco
      this.sotien = currentDocument.sotien
    }

    if (this.editAddInvoice) {
      this.id = null
      this.ctid = null
    }
  },
  methods: {
    ...mapMutations('myDocument', [
      'SET_CURRENT_DOCUMENT',
      'TOGGLE_DOCUMENT',
      'TOGGLE_MODAL',
      'TOGGLE_EDIT_DOCUMENT',
      'TOGGLE_EDIT_ADD_DOCUMENT',
      'TOGGLE_MODAL_NEW',
    ]),

    ...mapActions('myDocument', [
      'CREATE_DOCUMENT',
      'UPDATE_DOCUMENT',
      'GET_DOCUMENTS',
    ]),

    getCurrentListNo(CurrentList) {
      this.tkno = CurrentList.taikhoan
    },
    getCurrentListCo(CurrentList) {
      this.tkco = CurrentList.taikhoan
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

    isValidDate() {
      if (!moment(this.ngay, 'DD-MM-YYYY').isValid()) {
        this.$toastr.warning('Ngày không hợp lệ !!')
        return false
      }
      const infoketoan = this.$jwtAcn.getKetoan()
      let testngay = moment(this.ngay, 'DD-MM-YYYY').format('YYYY-MM-DD')
      testngay = new Date(moment(this.ngay, 'DD-MM-YYYY').format('YYYY-MM-DD'))
      if (
        testngay < new Date(infoketoan.fromtodate.pd_fromdate) ||
        testngay > new Date(infoketoan.fromtodate.pd_todate)
      ) {
        let tungay = moment(
          infoketoan.fromtodate.pd_fromdate,
          'YYYY-MM-DD',
        ).format('DD-MM-YYYY')
        let denngay = moment(
          infoketoan.fromtodate.pd_todate,
          'YYYY-MM-DD',
        ).format('DD-MM-YYYY')
        this.$toastr.warning(
          'Ngày không nằm trong giới hạn ' +
            'từ ngày: ' +
            tungay +
            ' - ' +
            denngay,
        )
        return false
      }
      if (
        !this.tkno ||
        this.tkno.length <= 0 ||
        !this.tkco ||
        this.tkco.length <= 0
      ) {
        this.$toastr.warning('', 'Vui lòng nhập số tài khoản.')
        return false
      }
      return true
    },
    closeInvoice() {
      this.TOGGLE_DOCUMENT(0)
      if (this.editInvoice) {
        this.TOGGLE_EDIT_DOCUMENT()
      }
      if (this.editAddInvoice) {
        this.TOGGLE_EDIT_ADD_DOCUMENT()
      }
    },

    async updateAddDoc() {
      if (!this.isValidDate()) return
      this.$store.commit('set', ['isLoading', true])
      if (!this.editInvoice || this.editAddInvoice) {
        // for Add-Edit && add
        const ret = await this.CREATE_DOCUMENT({
          chungtu: {
            id: null,
            ctid: null,
            // null Server sẽ tạo
            soct: this.soct,
            ngay: moment(this.ngay, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            diengiai: this.diengiai,
            tkno: this.tkno, // new new
            tkco: this.tkco,
            sotien: this.sotien.split('.').join('').split(',').join('.'),
            // ngoaite: newdata.ngoaite,
          },
        })
        if (ret) {
          this.$toastr.success('', 'Create chứng từ thành công.')
        } else this.$toastr.warning('', 'Create chứng từ KHÔNG thành công.')
        this.$store.commit('set', ['isLoading', false])
        this.$emit('refreshDoc')
        this.closeInvoice()
      } else {
        // for Edit Oncly
        // return console.log(this.tkno.sotk,this.tkco.sotk);
        const ret = await this.UPDATE_DOCUMENT({
          chungtu: {
            id: this.id,
            soct: this.soct,
            ngay: moment(this.ngay, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            // moment(this.ngay).format('YYYY-MM-DD'),
            diengiai: this.diengiai,
            tkno: this.tkno, // new new
            tkco: this.tkco,
            //sotien: this.sotien.replace(/\,/g, ''),
            sotien: this.sotien.split('.').join('').split(',').join('.'),
            //ngoaite: this.ngoaite,
          },
          // routeId: this.$route.params.ctid,
          routeId: this.ctid,
        })
        if (ret) {
          this.$toastr.success('', 'Update chứng từ thành công.')
        } else this.$toastr.warning('', 'Update chứng từ KHÔNG thành công.')
        this.$store.commit('set', ['isLoading', false])
        this.$emit('refreshDoc')
        this.closeInvoice()
      }
    },

    submitForm() {
      this.updateAddDoc()
    },
  },
  computed: {
    ...mapState('myDocument', [
      'danhmucTaikhoan',
      'editInvoice',
      'editAddInvoice',
      'currentDocumentArray',
      'currentInvoiceArray',
      'modalActiveNew',
    ]),
  },

  watch: {
    paymentTerms() {
      const futureDate = new Date()
      this.paymentDueDateUnix = futureDate.setDate(
        futureDate.getDate() + parseInt(this.paymentTerms),
      )
      this.paymentDueDate = new Date(
        this.paymentDueDateUnix,
      ).toLocaleDateString('en-us', this.dateOptions)
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
      margin-bottom: 0px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    // Invoice Work

    .save {
      margin-top: 50px;

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
}
</style>
