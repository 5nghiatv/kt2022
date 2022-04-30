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
          NHẬP LIỆU HÓA ĐƠN
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
              disabled
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Ngày tháng</label>
            <input
              required
              type="text"
              pattern="(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])-\d{4}"
              id="billerZipCode"
              v-model="ngay"
              disabled
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientCity1">TK Nợ</label>
            <input
              required
              type="text"
              id="clientCity1"
              v-model="tkno"
              disabled
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">TK Có</label>
            <input
              required
              type="text"
              id="clientZipCode"
              v-model="tkco"
              disabled
            />
          </div>
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity2">Diển giãi</label>
            <input
              required
              type="text"
              id="clientCity2"
              v-model="diengiai"
              disabled
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">Số tiền</label>
            <p
              id="displaySotien"
              :class="{
                paid: setColorNumber('paid'),
                draft: setColorNumber('draft'),
                pending: setColorNumber('pending'),
              }"
            >
              {{ numberFormat(sotien) }}
            </p>
          </div>
          <div class="send-to flex flex-column">
            <h4>Chênh lệch</h4>
            <p
              id="displayChenhlech"
              :class="{
                paid: setColorNumber('paid'),
                draft: setColorNumber('draft'),
                pending: setColorNumber('pending'),
              }"
            >
              {{ numberFormat(chenhlechChitiet) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-column">
        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item20">Số Hóa đơn</th>
              <th class="item15">Ngày tháng</th>
              <th class="item15">Mã số Thuế</th>
              <th class="item7">Thuế suất</th>
              <th class="item15">Số tiền</th>
              <th class="item15">Thuế gtgt</th>
              <!-- <th class="total">Thành tiền</th> -->
            </tr>
            <tr
              class="table-items flex"
              v-for="(item, index) in chitietItem"
              :key="index"
            >
              <td class="item25">
                <input
                  required
                  type="text"
                  v-model="item.sohd"
                  pattern="(?=^.{10,}$)(?=.*[-]).*$"
                  title="Mẫu HĐ và Số cách nhau dấu -"
                  onkeyup="this.value = this.value.toUpperCase();"
                />
              </td>
              <td class="item15">
                <input
                  required
                  type="text"
                  pattern="(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])-\d{4}"
                  v-model="item.ngay"
                  title="Dạng ngày DD-MM-YYYY"
                />
              </td>
              <!-- <td class="item25"><input required type="text" v-model="item.masothue" /></td> -->
              <td class="item25">
                <div class="location-details flex">
                  <label class="typo__label"></label>
                  <Multiselect
                    v-model="item.masothue"
                    placeholder="Mã thuế"
                    :searchable="true"
                    trackBy="value"
                    label="value"
                    class="form-control"
                    :class="{
                      'multiselect-blue': !testTheme('dark'),
                      'multiselect-dark': testTheme('dark'),
                    }"
                    :options="danhmucCustomer"
                  >
                    <template v-slot:option="{ option }">
                      {{ option.value }} {{ option.company }}
                    </template>
                  </Multiselect>
                </div>
              </td>

              <td class="item7">
                <input
                  @change="tinhTienThue(index)"
                  required
                  type="text"
                  pattern="%|(5|\d{2})%"
                  v-model="item.thuesuat"
                />
              </td>
              <td class="item20">
                <input
                  @change="tinhTienThue(index)"
                  v-on:change="signalChange()"
                  v-mask-decimal.br="0"
                  required
                  type="text"
                  v-model="item.giaban"
                />
              </td>
              <td class="item15">
                <input
                  v-mask-decimal.br="0"
                  required
                  type="text"
                  v-model="item.thuegtgt"
                />
              </td>
              <!-- <td class="total flex"><input type="text" value="item.giaban+ item.thuegtgt" disabled/></td> -->
              <div class="table-items flex">
                <a
                  @click="deleteItem(item.id)"
                  class="fa fa-trash-o text-warning mr-1"
                  id="2"
                ></a>
                <a
                  @click="copyItem(item.id)"
                  class="fa fa-plus text-info mr-1"
                  id="1"
                ></a>
              </div>

              <!-- <div class="table-items flex">
                <img
                  @click="deleteItem(item.id)"
                  src="../assets/icon-delete.svg"
                  alt=""
                />
              </div>
              <div class="table-items flex">
                <img
                  @click="copyItem(item.id)"
                  src="../assets/icon-plus.svg"
                  alt=""
                />
              </div> -->
            </tr>
          </table>

          <div @click="addNewItem" class="flex button">
            <img src="../assets/icon-plus.svg" alt="" />
            Add New Item
          </div>
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
          <div class="checkbox-inline">
            <label style="color: #ff8f00"
              ><input
                v-model="updateVat"
                type="checkbox"
                title="Tiền hàng & thuế cập nhật vào Tài khoản Chi tiết"
              />Cập nhật tiền hàng & Thuế</label
            >
          </div>

          <!-- <button v-if="!editInvoice" type="submit" @click="saveDraft" class="dark-purple">Save Draft</button> -->
          <!-- <button v-if="!editInvoice" type="submit" @click="publishInvoice" class="purple">Create Invoices</button> -->
          <button
            v-if="editInvoice && !editAddInvoice"
            type="sumbit"
            class="purple"
          >
            Update Invoices
          </button>
          <!-- <button v-if="editInvoice && editAddInvoice" @click="saveDraft" type="sumbit" class="dark-purple">Add Draft</button> -->
          <!-- <button v-if="editInvoice && editAddInvoice" @click="publishInvoice" type="sumbit" class="purple">Add Document</button> -->
        </div>
      </div>
    </form>
  </div>
</template>

<script>
// import db from "../firebase/firebaseInit";
//let db = window.firebase.firestore();
//import ModalPublic from './ModalPublic'
import Loading from './Loading'
import { mapActions, mapMutations, mapState } from 'vuex'
import moment from 'moment'
const { numberFormat, setColorNumber } = require('../utility')
import Multiselect from '@vueform/multiselect'
import utility from '@/common/utility'

export default {
  name: 'docHoadonModal',
  mixins: [utility],
  components: {
    Loading,
    //ModalPublic,
    Multiselect,
  },
  data() {
    return {
      updateVat: false,
      soct: null,
      ngay: null,
      diengiai: null,
      tkno: null,
      tkco: null,
      sotien: null,
      loading: null,
      chitietItem: [],
      chenhlechChitiet: null,
      options: null,
    }
  },
  mounted() {
    // this.options = this.danhmucCustomer
    if (this.documentDataHoadon) {
      this.chitietItem = this.documentDataHoadon
      // this.chitietItem.forEach((element) => {
      //   // Lưu Hóa đơn.masothue <---> Customer.maso ( chú ý khi mount ,addNewItem & updateItem)
      //   var maso = this.danhmucCustomer.filter(
      //     (item) => item.maso === element.masothue,
      //   )
      //   if (maso.length > 0) {
      //     this.$set(element, 'maso', maso[0])
      //   }
      // })
      //console.log(222,this.chitietItem)
    }
  },
  created() {
    if (this.editInvoice) {
      const currentDocument = this.currentDocumentArray[0]
      //const currentDocChitiet = this.documentDataChitiet
      this.ctid = currentDocument.ctid // Phải có
      this.soct = currentDocument.soct
      this.ngay = currentDocument.ngay
      this.diengiai = currentDocument.diengiai
      this.tkno = currentDocument.tkno
      this.tkco = currentDocument.tkco
      this.sotien = currentDocument.sotien
    }
  },
  methods: {
    async CallGanTienHangHoadon(tongtien = 0, tienthue = 0) {
      if (!this.updateVat || this.chitietItem.length == 0) return
      const currentDoc = this.currentDocumentArray[0]
      var ctid = currentDoc.ctid
      var tkthue = currentDoc.tkco.substr(0, 3) == '511' ? '3331' : '1331'
      await this.chitietItem.forEach((element) => {
        tongtien += element.giaban.split('.').join('').split(',').join('.') * 1
        tienthue +=
          element.thuegtgt.split('.').join('').split(',').join('.') * 1
      })

      //console.log(1111,ctid,tongtien,tienthue,tkThue)
      const ret = await this.GANTIENHANG_HOADON({
        ctid: ctid,
        tongtien: tongtien,
        tienthue: tienthue,
        tkthue: tkthue,
      })
      if (ret) this.$toastr.success('', 'Update chứng từ Hóa đơn thành công.')
      if (!ret)
        this.$toastr.warning('', 'Update chứng từ Hóa đơn KHÔNG thành công.')
    },

    ...mapMutations('myDocument', [
      'TOGGLE_DOCUMENT',
      'TOGGLE_MODAL',
      'TOGGLE_EDIT_DOCUMENT',
      'TOGGLE_EDIT_ADD_DOCUMENT',
      'TOGGLE_MODAL_NEW',
    ]),

    ...mapActions('myDocument', ['UPDATE_HOADON', 'GANTIENHANG_HOADON']),

    customLabel({ maso }) {
      return `${maso}` //`${maso} - ${company} `;  //Liên quan đến search
    },
    tinhTienThue(index) {
      var thuesuat = this.chitietItem[index].thuesuat.split('%').join('')
      var thuegtgt =
        (this.chitietItem[index].giaban
          .split('.')
          .join('')
          .split(',')
          .join('.') *
          thuesuat) /
        100
      this.chitietItem[index].thuegtgt = thuegtgt.toFixed().toString()
    },
    signalChange() {
      var itemTotal = 0
      this.chitietItem.forEach((item) => {
        if (typeof item.giaban == 'number') itemTotal += item.giaban
        else if (typeof item.giaban === 'string')
          itemTotal += parseInt(
            item.giaban.split('.').join('').split(',').join('.'),
          )
      })
      this.chenhlechChitiet =
        this.chitietItem.length <= 0
          ? 0
          : itemTotal -
            parseInt(this.sotien.split('.').join('').split(',').join('.'))
      // console.log("change !!!: "+itemTotal);
    },

    // const { configMask, numberFormat, setColorNumber } = require("../utility");
    numberFormat(x) {
      return numberFormat(x)
    },
    setColorNumber(opt) {
      // Dòng này quá nguy hiểm
      var sotien = this.currentDocumentArray[0].sotien
        ? this.currentDocumentArray[0].sotien
        : 0
      return setColorNumber(opt, sotien)
    },

    resSubmit(ret) {
      this.TOGGLE_MODAL_NEW()
      if (ret === 'No') {
        setTimeout(() => {
          // Chờ đóng model xong đã
          this.closeInvoice()
        }, 300)
      }
    },
    returnView() {
      // setTimeout(() => {
      //   this.$router.push({ name: 'DocumentView', params: { ctid: this.currentDocumentArray[0].ctid }});
      // }, 1000)
    },

    checkClick(e) {
      // Khi click ngoài cửa sổ hiện hành thì e.target = <div> ngoài cùng = this.$refs.invoiceWrap
      if (e.target === this.$refs.invoiceWrap) {
        //this.TOGGLE_MODAL();
        this.TOGGLE_MODAL_NEW(
          'Xác nhận tiếp tục Thực hiện hiệu chỉnh hóa đơn hoặc Kết thúc ?',
        )
      }
    },

    closeInvoice() {
      this.TOGGLE_DOCUMENT(3)
      if (this.editInvoice) {
        this.TOGGLE_EDIT_DOCUMENT()
        if (this.editAddInvoice) {
          this.TOGGLE_EDIT_ADD_DOCUMENT()
        }
      }
      this.returnView()
      //console.log(this.editInvoice, this.editAddInvoice)
    },

    addNewItem() {
      this.chitietItem.push({
        ctid: this.currentDocumentArray[0].ctid,
        ngay: moment(new Date()).format('DD-MM-YYYY'),
        sohd: null,
        diengiai: this.currentDocumentArray[0].diengiai,
        // masothue: "",
        maso: null,
        thuesuat: '%',
        giaban: 0,
        thuegtgt: 0,
      })
    },
    copyItem(id) {
      var item = this.chitietItem.filter((item) => item.id === id)
      item = item[0]
      this.chitietItem.push({
        ctid: item.ctid,
        ngay: item.ngay,
        sohd: item.sohd,
        diengiai: item.diengiai,
        masothue: item.masothue,
        thuesuat: item.thuesuat,
        giaban: item.giaban,
        thuegtgt: item.thuegtgt,
      })
      //console.log(item, this.chitietItem, id)
    },
    deleteItem(id) {
      this.chitietItem = this.chitietItem.filter((item) => item.id !== id)
    },

    async updateInvoice() {
      var isValid = true
      var checkmaso = await this.chitietItem.filter((item) => !item.masothue)
      if (checkmaso.length > 0)
        return this.$toastr.warning('', 'Vui lòng nhập mã số thuế.')
      await this.chitietItem.forEach((element) => {
        if (!moment(element.ngay, 'DD-MM-YYYY').isValid()) isValid = false
      })
      if (!isValid) return this.$toastr.warning('Ngày không hợp lệ !!')
      //await this.closeInvoice();  // Sau kiểm tra mới được & trước chỉnh sửa số liệu
      await this.chitietItem.forEach((element) => {
        element.ngay = moment(element.ngay, 'DD-MM-YYYY').format('YYYY-MM-DD')
        //element.masothue = element.maso // Chú ý masothue & maso
      })
      const ret = await this.UPDATE_HOADON({
        chitietItem: this.chitietItem,
        ctid: this.ctid,
      })
      if (ret) this.$toastr.success('', 'Update chứng từ Hóa đơn thành công.')
      if (ret) this.CallGanTienHangHoadon()
      if (!ret)
        this.$toastr.warning('', 'Update chứng từ Hóa đơn KHÔNG thành công.')
      this.$emit('refreshDoc')
      this.closeInvoice() // sau this.$emit("refreshDoc");
    },

    submitForm() {
      if (this.editInvoice) {
        this.updateInvoice()
        return
      }
      // this.uploadInvoice();
    },
  },
  computed: {
    ...mapState('myDocument', [
      'danhmucCustomer',
      'documentDataHoadon',
      'editInvoice',
      'editAddInvoice',
      'currentDocumentArray',
      'currentInvoiceArray',
      'modalActiveNew',
    ]),
  },

  watch: {
    chitietItem() {
      this.signalChange()
    },

    paymentTerms() {
      const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date().toLocaleDateString('en-GB', dateOptions)
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
    max-width: 900px;
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

    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }
    }

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

  #displaySotien {
    padding-left: 14px;
    height: 43px;
    padding-top: 12px;
    font-weight: 700;
    border-radius: 20px;
  }
  #displayChenhlech {
    padding-left: 14px;
    border-radius: 10px;
  }
}
</style>
