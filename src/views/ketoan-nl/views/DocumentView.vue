<template>
  <div v-if="currentDocument" class="document-view container">
    <!-- <router-link class="nav-link flex" :to="{ name: 'Documents' }">
      <img src="../assets/icon-arrow-left.svg" alt="" /> Go Back Documents
    </router-link> -->
    <!-- Header -->
    <div class="header flex">
      <transition name="invoice">
        <DocumentModal @refreshDoc="refreshDoc" v-if="documentModal" />
      </transition>
      <transition name="invoice">
        <DocChitietModal @refreshDoc="tinhchenhlech" v-if="docChitietModal" />
      </transition>
      <transition name="invoice">
        <DocVattuModal @refreshDoc="tinhchenhlech" v-if="docVattuModal" />
      </transition>
      <transition name="invoice">
        <DocHoadonModal @refreshDoc="tinhchenhlech" v-if="docHoadonModal" />
      </transition>

      <ModalPublic @resSubmit="resSubmit" v-if="modalActiveNew" />

      <div class="left flex">
        <!-- <span>Status</span> -->
        <div
          class="status-button status-no-button flex"
          :class="{
            paid: setColorNumber('paid'),
            draft: setColorNumber('draft'),
            pending: setColorNumber('pending'),
          }"
        >
          <div class="nav-link flex pending" @click="TOGGLE_DOCUMENT_VIEW()">
            <img src="../assets/icon-arrow-left.svg" alt="" /> Go Back
          </div>

          <!-- <span v-if="setColorNumber('paid')">Options</span>
          <span v-if="setColorNumber('draft')">Options</span>
          <span v-if="setColorNumber('pending')">Options</span> -->

          <div class="radio">
            <label
              ><input
                @click="chonOptKetoan(0)"
                type="radio"
                id="optradio_0"
                checked
              />Chứng từ</label
            >
          </div>
          <div class="radio">
            <label
              ><input
                @click="chonOptKetoan(1)"
                type="radio"
                id="optradio_1"
              />Chi tiết</label
            >
          </div>
          <div class="radio">
            <label
              ><input
                @click="chonOptKetoan(2)"
                type="radio"
                id="optradio_2"
              />Hàng hóa</label
            >
          </div>
          <div class="radio">
            <label
              ><input
                @click="chonOptKetoan(3)"
                type="radio"
                id="optradio_3"
              />Hóa đơn</label
            >
          </div>
        </div>
      </div>
      <div class="right flex">
        <button @click="toggleEditDocument" class="purple">
          Edit&minus;Doc
        </button>
        <button
          v-if="ktChitiet === 0"
          @click="toggleEditAddDocument(currentDocument.ctid)"
          class="dark-purple"
        >
          Edit+
        </button>
        <button
          v-if="ktChitiet === 0"
          @click="copyDocument(currentDocument.ctid)"
          class="green"
        >
          Copy
        </button>
        <button @click="deleteDocument(currentDocument.ctid)" class="red">
          Del
        </button>
      </div>
    </div>

    <!-- Invoice Details -->
    <div class="invoice-details flex flex-column">
      <div class="top flex">
        <div class="left flex flex-column">
          <!-- <p><span>#</span>{{ currentDocument.ctid }}</p> -->
          <p v-if="ktChitiet === 0">{{ currentDocument.soct }}</p>
          <p v-if="ktChitiet === 0">{{ currentDocument.diengiai }}</p>
          <p v-if="ktChitiet === 0">
            {{ numberFormat(currentDocument.sotien) }}
          </p>
        </div>
        <div v-if="ktChitiet === 0" class="right flex flex-column">
          <p>{{ currentDocument.ngay }}</p>
          <p>{{ currentDocument.tkno }}</p>
          <p>{{ currentDocument.tkco }}</p>
        </div>
      </div>
      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4>Số chứng từ</h4>
          <p>
            {{ currentDocument.soct }}
          </p>
        </div>
        <div class="bill flex flex-column">
          <h4>Ngày</h4>
          <p>{{ currentDocument.ngay }}</p>
        </div>

        <div class="diengiai flex flex-column">
          <h4>Diển giãi</h4>
          <p>{{ currentDocument.diengiai }}</p>
        </div>
        <div class="bill flex flex-column">
          <h4>TK Nợ</h4>
          <p>{{ currentDocument.tkno }}</p>
        </div>
        <div class="bill flex flex-column">
          <h4>TK Có</h4>
          <p>{{ currentDocument.tkco }}</p>
        </div>

        <div class="payment flex flex-column">
          <h4>Số tiền</h4>
          <p>{{ numberFormat(currentDocument.sotien) }}</p>
        </div>
        <div v-if="ktChitiet != 0" class="send-to flex flex-column">
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

      <div v-if="ktChitiet === 1" class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Diển giãi</p>
            <p>TK_Nợ</p>
            <p>TK_Có</p>
            <p>Số tiền</p>
          </div>
          <div
            v-for="(item, index) in documentDataChitiet"
            :key="index"
            class="item flex"
          >
            <p>{{ item.diengiai }}</p>
            <p>{{ item.tkno }}</p>
            <p>{{ item.tkco }}</p>
            <p>{{ numberFormat(item.sotien) }}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Thành tiền</p>
          <p>{{ numberFormat(congChitiet.chitiet) }}</p>
        </div>
      </div>

      <div v-if="ktChitiet === 2" class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Tên hàng hóa</p>
            <p>Mã hàng</p>
            <p>Đơn vị</p>
            <p>Mã kho</p>
            <p>Số lượng</p>
            <p>Thành tiền</p>
          </div>
          <div
            v-for="(item, index) in documentDataVattu"
            :key="index"
            class="item flex"
          >
            <p>{{ item.tenhang }}</p>
            <p>{{ item.mahang }}</p>
            <p>{{ item.donvi }}</p>
            <p>{{ item.makho }}</p>
            <p>{{ item.soluong }}</p>
            <p>{{ numberFormat(item.sotien) }}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Thành tiền</p>
          <p>{{ numberFormat(congChitiet.vattu) }}</p>
        </div>
      </div>

      <div v-if="ktChitiet === 3" class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Số Hóa đơn</p>
            <p>Ngày</p>
            <p>Mã số Thuế</p>
            <p>Thuế suất</p>
            <p>Thành tiền</p>
            <p>Thuế gtgt</p>
            <p>Giá bán</p>
          </div>
          <div
            v-for="(item, index) in documentDataHoadon"
            :key="index"
            class="item flex"
          >
            <p>{{ item.sohd }}</p>
            <p>{{ item.ngay }}</p>
            <p>{{ item.masothue }}</p>
            <p>{{ item.thuesuat }}</p>
            <p>
              {{
                numberFormat(
                  (typeof item.giaban === 'number'
                    ? item.giaban
                    : item.giaban.split('.').join('') * 1) +
                    (typeof item.thuegtgt === 'number'
                      ? item.thuegtgt
                      : item.thuegtgt.split('.').join('') * 1),
                )
              }}
            </p>
            <p>{{ numberFormat(item.thuegtgt) }}</p>
            <p>{{ numberFormat(item.giaban) }}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Thành tiền</p>
          <p>{{ numberFormat(congChitiet.hoadon) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DocumentModal from '../components/DocumentModal' // Dùng cho Add-Edit- EditAdd
import DocChitietModal from '../components/DocChitietModal' // Dùng cho Add-Edit- EditAdd
import DocVattuModal from '../components/DocVattuModal' // Dùng cho Add-Edit- EditAdd
import DocHoadonModal from '../components/DocHoadonModal' // Dùng cho Add-Edit- EditAdd

import ModalPublic from '../components/ModalPublic'
import { mapActions, mapMutations, mapState } from 'vuex'
const { numberFormat, setColorNumber } = require('../utility')

export default {
  name: 'invoiceView',
  components: {
    ModalPublic,
    DocumentModal,
    DocChitietModal,
    DocVattuModal,
    DocHoadonModal,
  },
  data() {
    return {
      currentModel: null,
      currentDocument: null,
      ktChitiet: 0,
      chenhlechChitiet: 0,
      optMess: '',
      congChitiet: {
        ketoan: 0,
        chitiet: 0,
        vattu: 0,
        hoadon: 0,
      },
    }
  },
  created() {
    //this.getCurrentDocument(this.$route.params.ctid);
    this.getCurrentDocument()
    this.ktChitiet = this.currentKTchitiet // Phục hồi Lưu cho lần sau (Create) hiện đúng trước đó
  },
  // =========(Created-mounted-updated-destroyed)==================  Chỉ trong updated MỚI CÓ DOM
  updated() {
    //if(this.currentDocumentArray.length==0) this.$router.push({ name: 'Documents', params: { }});
    document.getElementById('optradio_0').checked = false
    document.getElementById('optradio_1').checked = false
    document.getElementById('optradio_2').checked = false
    document.getElementById('optradio_3').checked = false
    document.getElementById('optradio_' + this.ktChitiet).checked = true
  },
  methods: {
    refreshDoc() {
      this.getCurrentDocument(this.currentDocumentArray[0].ctid)
    },
    numberFormat(x) {
      return numberFormat(x)
    },
    setColorNumber(opt) {
      // Dòng này quá nguy hiểm
      var sotien = this.currentDocument.sotien ? this.currentDocument.sotien : 0
      return setColorNumber(opt, sotien)
    },

    chonOptKetoan(opt) {
      // var text = opt == 0 ? "Go Back": "Go Back Documents";
      // document.getElementById("goBackDoc").innerHTML = text ;

      this.ktChitiet = opt // 0- ketoan  1-Chi tiết  2-Vật tư  3- Hóa đơn
      this.SET_CURRENT_KTCHITIET(opt) // Lưu cho lần sau (Create) hiện đúng trước đó
      switch (opt) {
        case 1:
          this.optMess = 'Chi tiết'
          break
        case 2:
          this.optMess = 'Hàng hóa'
          break
        case 3:
          this.optMess = 'Hóa đơn'
          break
        default:
          this.optMess = '(Chi tiết-Hàng hóa-Hóa đơn)'
          break
      }
    },
    ...mapMutations('myDocument', [
      'TOGGLE_DOCUMENT_VIEW',
      'SET_CURRENT_KTCHITIET',
      'SET_CURRENT_DOCUMENT',
      'TOGGLE_EDIT_DOCUMENT',
      'TOGGLE_EDIT_ADD_DOCUMENT',
      'TOGGLE_DOCUMENT',
      'TOGGLE_MODAL_NEW',
    ]),

    ...mapActions('myDocument', [
      'COPY_DOCUMENT',
      'DELETE_DOCUMENT',
      'GET_DOCUMENTS_CHITIET',
      'GET_DOCUMENTS_VATTU',
      'GET_DOCUMENTS_HOADON',
    ]),

    async getCurrentDocument(ctid) {
      ctid = ctid ? ctid : this.currentDocumentArray[0].ctid
      await this.SET_CURRENT_DOCUMENT(ctid) // this.$route.params.ctid);
      this.currentDocument = this.currentDocumentArray[0]
      await this.GET_DOCUMENTS_CHITIET()
      await this.GET_DOCUMENTS_VATTU()
      await this.GET_DOCUMENTS_HOADON()
      this.ktChitiet++
      this.ktChitiet--
      //console.log(111, this.documentDataChitiet,this.documentDataVattu,this.documentDataHoadon)
    },
    tinhchenhlech() {
      this.currentDocument = this.currentDocumentArray[0] // Nếu chi tiết sẽ update tổng tiền mớitheo chi tiết
      switch (this.ktChitiet) {
        case 1:
          // a: giá trị oject trước -- b: giá trị oject hiện hành
          if (this.documentDataChitiet && this.documentDataChitiet.length != 0)
            this.congChitiet.chitiet = this.documentDataChitiet.reduce(
              (a, b) =>
                +a +
                +(b.sotien == 0
                  ? 0
                  : parseInt(
                      b.sotien.split('.').join('').split(',').join('.'),
                    )),
              0,
            )
          if (this.currentDocument)
            this.chenhlechChitiet =
              this.congChitiet.chitiet == 0
                ? 0
                : this.congChitiet.chitiet -
                  parseInt(
                    this.currentDocument.sotien
                      .split('.')
                      .join('')
                      .split(',')
                      .join('.'),
                  )
          break
        case 2:
          if (this.documentDataVattu && this.documentDataVattu.length != 0)
            this.congChitiet.vattu = this.documentDataVattu.reduce(
              (a, b) =>
                +a +
                +(b.sotien == 0
                  ? 0
                  : parseInt(
                      b.sotien.split('.').join('').split(',').join('.'),
                    )),
              0,
            )
          if (this.currentDocument)
            this.chenhlechChitiet =
              this.congChitiet.vattu == 0
                ? 0
                : this.congChitiet.vattu -
                  parseInt(
                    this.currentDocument.sotien
                      .split('.')
                      .join('')
                      .split(',')
                      .join('.'),
                  )
          break
        case 3:
          //console.log(111, this.documentDataHoadon)
          if (this.documentDataHoadon && this.documentDataHoadon.length != 0)
            this.congChitiet.hoadon = this.documentDataHoadon.reduce(
              (a, b) =>
                +a +
                +(b.giaban == 0
                  ? 0
                  : parseInt(
                      b.giaban.split('.').join('').split(',').join('.'),
                    )),
              0,
            )
          //console.log(this.congChitiet.hoadon, this.documentDataHoadon)
          if (this.currentDocument)
            this.chenhlechChitiet =
              this.congChitiet.hoadon == 0
                ? 0
                : this.congChitiet.hoadon -
                  parseInt(
                    this.currentDocument.sotien
                      .split('.')
                      .join('')
                      .split(',')
                      .join('.'),
                  )
          break
        default:
          this.chenhlechChitiet = 0
          break
      }
    },
    toggleEditCopyDocument() {
      this.COPY_DOCUMENT(this.currentDocument.ctid)
      this.$router.push({ name: 'Documents' })
    },
    toggleEditAddDocument() {
      this.TOGGLE_EDIT_ADD_DOCUMENT()
      this.TOGGLE_EDIT_DOCUMENT()
      this.TOGGLE_DOCUMENT(this.ktChitiet)
      //this.$router.push({ name: "Documents" });
    },
    toggleEditDocument() {
      this.TOGGLE_EDIT_DOCUMENT()
      this.TOGGLE_DOCUMENT(this.ktChitiet)
      //this.$router.push({ name: "Documents" });
    },
    async resSubmit(ret) {
      this.TOGGLE_MODAL_NEW()
      if (ret === 'Yes') {
        this.$store.commit('set', ['isLoading', true])
        if (this.currentModel === 'Delete') {
          let ret = await this.DELETE_DOCUMENT(this.currentDocument.ctid)
          if (ret) this.$toastr.success('', 'DELETE chứng từ thành công.')
          else this.$toastr.warning('', 'DELETE chứng từ KHÔNG thành công.')
          this.TOGGLE_DOCUMENT_VIEW()
        }

        if (this.currentModel === 'Copy') {
          let ret = await this.COPY_DOCUMENT({
            ctid: this.currentDocument.ctid,
            ngay: this.currentDocument.ngay,
          })
          if (ret) {
            this.$toastr.success('', 'COPY chứng từ thành công.')
            try {
              var ctid = ret.query[0][0].ctid
              this.getCurrentDocument(ctid)
            } catch (error) {
              console.log(error)
            }
          } else this.$toastr.warning('', 'COPY chứng từ KHÔNG thành công.')
        }
        this.$store.commit('set', ['isLoading', false])
      }
    },
    deleteDocument() {
      var ctid =
        this.currentDocumentArray.length > 0
          ? this.currentDocumentArray[0].ctid
          : this.$route.params.ctid
      this.currentModel = 'Delete'
      this.TOGGLE_MODAL_NEW(
        `Xác nhận Thực hiện XÓA chứng từ (${ctid})` +
          this.optMess +
          ' hoặc Kết thúc ?',
      )
    },
    copyDocument() {
      this.currentModel = 'Copy'
      this.TOGGLE_MODAL_NEW(
        'Xác nhận Thực hiện COPY chứng từ số : ' +
          this.currentDocument.soct +
          ' bao gồm (chi tiết,vật tư,hóa đơn ) hoặc Kết thúc ?',
      )
    },
  },

  //  ...mapState("myDocument",["docListModal","documentModal","docChitietModal","docVattuModal","docHoadonModal", "modalActive", "documentsLoaded"]),

  computed: {
    ...mapState('myDocument', [
      'documentModal',
      'docChitietModal',
      'docVattuModal',
      'docHoadonModal',
      'currentKTchitiet',
      'documentDataHoadon',
      'documentDataVattu',
      'documentDataChitiet',
      'currentDocumentArray',
      'editInvoice',
      'modalActiveNew',
    ]),
  },
  watch: {
    ktChitiet() {
      this.tinhchenhlech()
    },
    editInvoice() {
      if (!this.editInvoice) {
        this.currentDocument = this.currentDocumentArray[0]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.document-view {
  // transition-delay: .5s;
  // transition-property: background-color;
  // transition: all .5s ease-out;

  button,
  .button {
    padding: 16px 24px !important; // Quá nguy hiểm
  }

  .nav-link {
    cursor: pointer;
    margin: auto;
    align-items: center;
    // background-color: #1e2139;
    background-color: #252945;
    // background-color: rgba(51, 214, 160, 0.1);
    // color: #fff;
    font-size: 16px;
    width: 140px;
    border-radius: 20px;
    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
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

  .invoice-details {
    padding: 48px;
    margin-top: 24px;

    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }

      .left {
        font-size: 14px;
        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }

        p:nth-child(2) {
          font-size: 16px;
        }

        span {
          color: #888eb0;
        }
      }

      .right {
        font-size: 14px;
        align-items: flex-end;
      }
    }

    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;

      h4 {
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
      }

      .bill,
      .payment {
        flex: 1;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p {
          font-weight: 600;
        }
      }

      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }
        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 14px;
        }
      }

      .send-to {
        flex: 2;
      }
    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #252945;

        .heading {
          color: #dfe3fa;
          font-size: 14px;
          margin-bottom: 32px;

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 15px;
          color: #fff;

          &:last-child {
            margin-bottom: 0;
          }

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }
      }

      .total {
        color: #fff;
        padding: 32px;
        background-color: rgba(12, 14, 22, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;

        p {
          flex: 1;
          font-size: 14px;
        }

        p:nth-child(2) {
          font-size: 24px;
          text-align: right;
        }
      }
    }
  }
  input {
    margin-right: 5px;
  }
  .radio {
    margin-left: 40px;
    margin-top: 10px;
  }
  #displayChenhlech {
    padding-left: 14px;
    border-radius: 10px;
  }
  .diengiai {
    flex: 0 0 300px;
  }
}
</style>
