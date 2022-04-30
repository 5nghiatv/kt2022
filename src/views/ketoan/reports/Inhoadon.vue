<template>
  <body>
    <div class="row">
      <div class="col-lg-12">
        <div class="card" id="printableArea">
          <div
            class="card-block"
            v-for="(infohoadon, index) in infohoadons"
            :key="index"
          >
            <div v-if="index < 1" class="row btn-section">
              <div class="col-lg-12 col-md-12 col-12">
                <span class="float-right">
                  <button
                    type="button"
                    class="btn btn-responsive button-alignment btn-outline-primary"
                    data-toggle="button"
                  >
                    <span @click="goTrangtruoc()">
                      <i class="fa fa-reply-all"></i> Trang trước
                    </span>
                  </button>
                  {{ '\u00a0' }}
                  <button
                    type="button"
                    class="btn btn-responsive button-alignment btn-outline-primary"
                    data-toggle="button"
                  >
                    <span @click="printDiv()">
                      <i class="fa fa-print"></i> In Hóa đơn
                    </span>
                  </button>
                </span>
              </div>
            </div>

            <div v-if="index != 0" class="pagebreak"></div>
            <br />

            <div class="row">
              <div style="padding-left: 30px" class="col-3 invoice_address">
                <img src="logo_black.png" alt="Logo" />
                <!-- <h6> <strong>{{infoketoan.company.company}} </strong> </h6>
                            <h6> {{infoketoan.company.address}} </h6> -->
              </div>
              <div class="col-6 invoice_address text-center">
                <h3 style="color: GoldenRod">
                  <strong> {{ '\u00a0' }} {{ tenphieu }}</strong>
                </h3>
                <h6 style="color: Chocolate">{{ numberpage }}</h6>
                <h6
                  class="text-center"
                  style="font-style: italic; font-weight: bold"
                >
                  {{ Ngaythang(infohoadon.ngay) }}
                </h6>
              </div>
              <div
                class="col-3 invoice_address text-left"
                style="padding-left: 80px"
              >
                <h6>Mẫu số: {{ mausohd }}</h6>
                <!-- <h6> Ký hiệu: <strong>{{infohoadon.kyhieuhd}}</strong></h6> -->
                <h6>
                  Ký hiệu:
                  <strong v-if="infohoadon.sohd">{{
                    infohoadon.sohd.split('-')[0]
                  }}</strong>
                </h6>
                <h5>
                  Số :
                  <strong v-if="infohoadon.sohd" style="color: Chocolate">{{
                    infohoadon.sohd.split('-')[1]
                  }}</strong>
                </h5>
              </div>
            </div>
            <div class="row">
              <table class="table table-bordered data-table">
                <div class="col-12">
                  <div class="row col-12 col-lg-12 invoice_address">
                    <a>Đơn vị bán hàng : </a> {{ '\u00a0' }}
                    <strong> {{ infoketoan.company.company }} </strong>
                  </div>
                  <div class="row col-12 col-lg-12 invoice_address">
                    <a>Mã số thuế : </a> {{ '\u00a0' }}
                    <strong> {{ infoketoan.company.masothue }} </strong>
                  </div>
                  <div class="row col-12 col-lg-12 invoice_address">
                    <a>Địa chỉ :</a> {{ '\u00a0' }}
                    <strong> {{ infoketoan.company.address }} </strong>
                  </div>
                  <div class="row col-12 col-lg-12 invoice_address">
                    <a>Điện thoại :</a> {{ '\u00a0' }}
                    <strong> {{ infoketoan.company.phone }} </strong>
                  </div>
                  <div class="row col-12 col-lg-12 invoice_address">
                    <a>Số tài khoản :</a> {{ '\u00a0' }}
                    <strong> {{ infoketoan.company.account }} </strong
                    >{{ '\u00a0' }}{{ '\u00a0' }} <a>tại Ngân hàng:</a>
                    {{ '\u00a0' }}
                    <strong> {{ infoketoan.company.bank }} </strong
                    >{{ '\u00a0' }} - {{ '\u00a0' }}
                    <strong> {{ infoketoan.company.citibank }} </strong>
                  </div>
                </div>
              </table>
            </div>
            <div class="row">
              <table class="table table-bordered data-table">
                <div class="col-12">
                  <div class="row col-12 col-lg-12 invoice_address">
                    <a>Họ tên người mua :</a> {{ '\u00a0' }}
                    <strong> {{ infohoadon.fullname }} </strong>
                  </div>

                  <div class="row col-12 col-lg-12 invoice_address">
                    <a>Tên đơn vị :</a> {{ '\u00a0' }}
                    <strong> {{ infohoadon.company }} </strong>
                  </div>
                  <div class="row col-12 col-lg-12 invoice_address">
                    <a>Mã số thuế :</a> {{ '\u00a0' }}
                    <strong> {{ infohoadon.maso }} </strong>
                  </div>
                  <div class="row col-12 col-lg-12 invoice_address">
                    <a>Địa chỉ :</a> {{ '\u00a0' }}
                    <strong> {{ infohoadon.address }} </strong>
                  </div>
                  <div class="row col-12 col-lg-12 invoice_address">
                    <a>Hình thức TT :</a> {{ '\u00a0' }} {{ '\u00a0' }}
                    <strong> {{ httt }} {{ '\u00a0' }} {{ '\u00a0' }} </strong>
                    <a>, Số TK :</a> {{ '\u00a0' }} {{ '\u00a0' }}
                    <strong> {{ infohoadon.account }} </strong>{{ '\u00a0' }}
                    {{ '\u00a0' }} <a>, Tại Ngân hàng:</a> {{ '\u00a0' }}
                    {{ '\u00a0' }} <strong> {{ infohoadon.bank }} </strong
                    >{{ '\u00a0' }} {{ '\u00a0' }} - {{ '\u00a0' }}
                    {{ '\u00a0' }} <strong> {{ infohoadon.citibank }} </strong>
                  </div>
                </div>
              </table>
            </div>
            <div class="row">
              <table class="table table-bordered data-table">
                <col width="25" />
                <col width="170" />
                <col width="30" />
                <col width="60" />
                <col width="70" />
                <col width="70" />
                <thead style="font-size: 15px; color: RoyalBlue">
                  <tr class="text-center">
                    <th>STT</th>
                    <th>Tên, nhãn hiệu, quy cách,sản phẩm, hàng hoá</th>
                    <th>Đơn vị</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    class="gradeX"
                    v-for="(chitiet, index2) in tkchitiet[
                      'id_' + infohoadon.ctid
                    ]"
                    :key="index2"
                  >
                    <td v-if="chitiet.mahang" class="text-center">
                      {{ index2 + 1 }}
                    </td>
                    <td>{{ chitiet.tenhang }}</td>
                    <td class="text-center">{{ chitiet.donvi }}</td>
                    <td v-if="!chitiet.donvi" class="text-right">
                      {{ '\u00a0' }}
                    </td>
                    <td v-if="!chitiet.soluong == 0" class="text-right">
                      {{ number_format(chitiet.soluong, 3, ',', '.') }}
                    </td>
                    <td v-if="!!chitiet.soluong == 0" class="text-right">
                      {{ '\u00a0' }}
                    </td>

                    <td v-if="!chitiet.soluong == 0" class="text-right">
                      {{
                        number_format(
                          chitiet.sotien / chitiet.soluong,
                          2,
                          ',',
                          '.',
                        )
                      }}
                    </td>
                    <td v-if="!!chitiet.soluong == 0" class="text-right">
                      {{ '\u00a0' }}
                    </td>

                    <td v-if="!chitiet.sotien == 0" class="text-right">
                      <strong>{{
                        number_format(chitiet.sotien, 0, ',', '.')
                      }}</strong>
                    </td>
                    <td v-if="!!chitiet.sotien == 0" class="text-right">
                      {{ '\u00a0' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Table -->
            <div class="row">
              <table class="table table-bordered data-table">
                <col width="225" />
                <col width="130" />
                <col width="70" />
                <tbody>
                  <tr class="gradeX">
                    <td></td>
                    <td class="text-right" style="font-style: italic">
                      <a>Cộng tiền hàng:</a>
                    </td>
                    <td class="text-right">
                      <strong>
                        {{ number_format(infohoadon.sotien, 0, ',', '.') }}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a>Thuế suất GTGT :</a> {{ '\u00a0' }}{{ '\u00a0' }}
                      {{ infohoadon.thuesuat }}
                    </td>
                    <td class="text-right" style="font-style: italic">
                      <a>Tiền thuế GTGT:</a>
                    </td>
                    <td class="text-right">
                      <strong>
                        {{ number_format(infohoadon.thuegtgt, 0, ',', '.') }}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td class="text-right" style="font-style: italic">
                      <a>Tổng cộng tiền thanh toán:</a>
                    </td>
                    <td class="text-right">
                      <strong>
                        {{
                          number_format(
                            infohoadon.sotien + infohoadon.thuegtgt,
                            0,
                            ',',
                            '.',
                          )
                        }}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="row">
              <table class="table table-bordered data-table">
                <col width="410" />
                <tbody>
                  <tr>
                    <td>
                      <a> Số tiền viết bằng chữ : </a
                      ><a style="font-style: italic; color: orchid"
                        >{{ '\u00a0' }} ( {{ infohoadon.congtienvn }} )
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="row" style="padding-left: 25px">
              <div class="col-5 invoice_address text-center">
                <strong>Người mua hàng</strong>
                <h6 style="font-style: italic">(Ký, ghi rõ họ tên)</h6>
              </div>
              <!-- <div class="col-2 invoice_address text-center">
                            <strong>{{chuky2}}</strong> 
                        </div> -->
              <div class="col-2 invoice_address text-center"></div>
              <div class="col-5 invoice_address text-center">
                <strong>Người bán hàng</strong>
                <h6 style="font-style: italic">
                  (Ký, đóng dấu, ghi rõ họ tên)
                </h6>
              </div>
            </div>
            <br /><br /><br /><br /><br /><br />

            <!-- <div style="white-space: pre-line;"></div> -->
          </div>
          <!-- v-for="phieuin in ctuktoans" -->
        </div>
      </div>
    </div>
  </body>
</template>
<script>
//import moment from 'moment'
import utility from '../../../common/utility'

export default {
  // ===Component name
  name: 'inPhieunhapxuat',
  mixins: [utility],
  // ===Props passed to component
  props: {},
  // ===Components used by this component
  components: {},
  // ====component Data properties
  data() {
    return {
      infoketoan: [],
      tkchitiet: [],
      tenphieu: 'HÓA ĐƠN GIÁ TRỊ GIA TĂNG',
      httt: 'TM/CK',
      mausohd: '01GTKT2/001',
      numberpage: 'Liên 1 : lưu',
      infohoadons: {
        ngay: '1961-12-15',
        sohd: '000360',
        kyhieuhd: 'NN/13P',
        thuesuat: '',
        thuegtgt: '',
        company: '',
        fullname: '',
        maso: '',
        address: '',
        ghichu: '',
        account: '',
        bank: '',
        citibank: '',
      },
    }
  },
  // ===Code to be executed when Component is mounted
  mounted() {
    //alert(this.$route.params.ctid)
    this.ctid = this.$route.params.ctid
    this.readCtuktoans()
    //console.log(this.infoketoan );
  },

  created() {
    this.infoketoan = this.$jwtAcn.getKetoan()
    this.$store.state.isPrinting = true
  },

  // ===Computed properties for the component
  computed: {},
  // ===Component methods
  methods: {
    goTrangtruoc() {
      this.$router.go(-1)
      this.$store.state.isPrinting = false
    },
    printDiv() {
      window.print()
      this.goTrangtruoc()
    },

    readCtuktoans() {
      this.$store.commit('set', ['isLoading', true])
      this.infoketoan['ctid'] = this.ctid == 'All' ? '' : this.ctid
      this.$apiAcn
        .post('/getInhoadon', this.infoketoan)
        .then((response) => {
          this.infohoadons = response.data.getHoadon
          var mathang = response.data.getMathang
          this.tkchitiet = []
          this.infohoadons.forEach((item) => {
            this.tkchitiet['id_' + item.ctid] = []
            //if(item.ctid=='01600239') console.log(10,item.ctid);
            mathang.forEach((ele) => {
              if (ele.ctid == item.ctid)
                this.tkchitiet['id_' + item.ctid].push(ele)
            })
            let len = this.tkchitiet['id_' + item.ctid].length
            if (len == 0) {
              this.tkchitiet['id_' + item.ctid].push({
                mahang: '01',
                tenhang: item.diengiai,
                donvi: '-',
                soluong: 0,
                sotien: item.sotien,
              })
            }
            for (let index = len; index < 3; index++) {
              this.tkchitiet['id_' + item.ctid].push([])
            }
          })
          this.$store.commit('set', ['isLoading', false])
          return this.infohoadons
        })
        .then((response) => {
          if (response.length == 0) this.$store.state.isPrinting = false
          //console.log(this.infohoadons,this.tkchitiet)
        })
        .catch((error) => {
          console.log(error)
          this.$store.commit('set', ['isLoading', false])
        })
    },
  },
}
</script>
<style scoped>
@page {
  /*size: 25cm 35.7cm;*/
  size: A4;
  /* size: A4;    Set máy in Letter - OK - giới hạn 80 trang */
  margin: 0mm 0mm 0mm 0mm; /* change the margins as you want them to be. */
}
body {
  margin-top: -40px;
  margin-left: -10px;
  font-size: 16px;
  line-height: 19px;
}
#printableArea {
  border: 1px solid #ccc;
}

.card-header {
  border-bottom: 1px solid #ccc;
}

.card-block {
  padding: 25px;
}

.card-header span {
  margin-top: -33px;
  font-size: 18px;
}

.invoice_address {
  margin: 10px 0;
}
a {
  color: RoyalBlue;
}
.table {
  table-layout: fixed;
  border: 1px solid #ccc;
}

.table tbody > tr {
  height: 45px;
}

td,
th {
  word-wrap: break-word;
  height: 45px;
}

.terms_conditions {
  list-style: initial;
  padding-left: 25px;
}

.table thead > tr > th {
  padding: 10px 8px;
  width: 80px;
  background-color: #ccc;
}

.table thead > tr > th:nth-child(2) {
  max-width: 180px;
}

.table-responsive > .table > tbody > tr > td,
.table-responsive > .table > tfoot > tr > td {
  padding: 15px 8px;
  white-space: normal;
}

@media screen and (min-width: 768px) {
  .invoice_address {
    margin: 19px 0;
  }
}

@media print {
  .pagebreak {
    page-break-after: always;
  }
  .btn-section {
    display: none !important;
  }
  .table-responsive {
    display: inline-table;
    width: 100%;
  }
}
#sign {
  margin-left: 15px;
}
.btn-section {
  background-color: rgb(236, 235, 235);
}
</style>
