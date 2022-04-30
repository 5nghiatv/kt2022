<template>
  <body>
    <div class="row">
      <div class="col-lg-12">
        <div class="card" id="printableArea">
          <div
            v-for="(phieuin, index) in phieuthuchi"
            :key="index"
            class="card-block"
          >
            <div v-if="index < 1" class="row btn-section">
              <div class="col-lg-12 col-md-12 col-12">
                <hr />
              </div>

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
                      <i class="fa fa-print"></i> In Phiếu
                    </span>
                  </button>
                </span>
                <CRow class="col-12" style="float: left">
                  <CCol col="4">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Giám đốc</CInputGroupText>
                      <CFormInput v-model="nguoikyten.giamdoc" />
                    </CInputGroup>
                  </CCol>
                  <CCol col="4">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Kt_Trưởng</CInputGroupText>
                      <CFormInput v-model="nguoikyten.kttruong" />
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow class="col-12" style="float: left">
                  <CCol col="4">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Người lập</CInputGroupText>
                      <CFormInput v-model="nguoikyten.nguoilap" />
                    </CInputGroup>
                  </CCol>
                  <CCol col="4">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Thủ kho....</CInputGroupText>
                      <CFormInput v-model="nguoikyten.thukho" />
                    </CInputGroup>
                  </CCol>
                </CRow>
                <div>
                  <label id="sign" style="font-style: italic; font-size: 0.8em"
                    >In họ tên người ký</label
                  >
                  {{ '\u00a0' }}
                  <input
                    v-model="nguoikyten.sign"
                    type="checkbox"
                    name="sign"
                    checked
                  />{{ '\u00a0' }}{{ '\u00a0' }}
                  <input
                    v-model="nguoikyten.themdong"
                    title="Tinh chỉnh dòng in"
                    type="checkbox"
                    name="themdong"
                    checked
                  />
                </div>
              </div>
              <div class="col-lg-12 col-md-12 col-12">
                <hr />
              </div>
            </div>

            <div v-if="index != 0" class="pagebreak"></div>
            <br />

            <div class="row">
              <div style="padding-left: 30px" class="col-5 invoice_address">
                <h6>
                  <strong>{{ infoketoan.company.company }} </strong>
                </h6>
                <h6>{{ infoketoan.company.address }}</h6>
              </div>
              <div class="col-4 invoice_address" id="tenphieu">
                <address>
                  <h3>
                    <strong style="color: GoldenRod">
                      {{ '\u00a0' }}{{ '\u00a0' }}
                      {{ phieuin.tenphieu }}</strong
                    >
                  </h3>
                  <h6 style="font-style: italic">
                    {{ Ngaythang(phieuin.ngay) }}
                  </h6>
                </address>
              </div>

              <div class="col-3 invoice_address text-center">
                <address>
                  <h6>
                    <strong>Mẫu số {{ phieuin.mauso }} - VT </strong>
                  </h6>
                  <p style="font-style: italic; font-size: 0.7em">
                    {{ infoketoan.company.thongtutc }}
                  </p>
                </address>
              </div>
            </div>
            <div class="row">
              <div class="col-9">
                <div class="row col-12 col-lg-12 invoice_address">
                  Họ và tên (<a style="font-style: italic"
                    >{{ phieuin.tendoituong }}
                  </a>
                  ): {{ '\u00a0' }} <strong> {{ phieuin.ghichu }} </strong>
                </div>
                <div class="row col-12 col-lg-12 invoice_address">
                  Theo ............... số ............... ngày ....... tháng
                  ....... năm ........... của ...............................
                </div>
                <div class="row col-12 col-lg-12 invoice_address">
                  {{ phieuin.istk2 }} tại kho: {{ '\u00a0' }}
                  <strong>
                    {{ phieuin.tengoi }} {{ '\u00a0' }}{{ '\u00a0'
                    }}{{ '\u00a0' }}
                  </strong>
                  ,Địa điểm: {{ '\u00a0' }}
                  <strong> {{ phieuin.diachi }} </strong>
                </div>
              </div>
              <div class="col-3">
                <div class="col-12 col-lg-12 invoice_address">
                  Số: {{ '\u00a0' }}<strong> {{ phieuin.soct }} </strong><br />
                  Nợ:{{ '\u00a0' }} <strong> {{ phieuin.tkno }} </strong><br />
                  Có: {{ '\u00a0' }} <strong> {{ phieuin.tkco }} </strong><br />
                </div>
              </div>
            </div>
            <br />
            <div class="row">
              <table
                class="table table-bordered data-table"
                style="margin-left: 30px"
              >
                <col width="50" />
                <col width="280" />
                <col width="70" />
                <col width="50" />
                <col width="110" />
                <col width="110" />
                <col width="150" />
                <thead style="font-size: 15px; color: RoyalBlue">
                  <tr class="text-center">
                    <th>STT</th>
                    <th>Tên, nhãn hiệu, q/cách,s/phẩm, h/hoá</th>
                    <th>Đơn vị</th>
                    <th>SL y/c</th>
                    <th>SL Thực {{ phieuin.istk }}</th>
                    <th>Đơn giá</th>
                    <th>Số tiền</th>
                  </tr>
                </thead>
                <tbody v-if="checkifline5('ctid_' + phieuin.ctid)">
                  <!-- Tuyệt - Thêm cho đủ 5 dòng  -->
                  <tr
                    class="gradeX"
                    v-for="(chitiet, index) in tkchitiet[
                      'ctid_' + phieuin.ctid
                    ]"
                    :key="index"
                  >
                    <td v-if="chitiet.mahang" class="text-center">
                      {{ index + 1 }}
                    </td>
                    <td v-if="!chitiet.mahang"></td>
                    <td>{{ chitiet.tenhang }}</td>
                    <td class="text-center">{{ chitiet.donvi }}</td>
                    <td></td>
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
                <td></td>
                <td class="text-center"><strong>Tổng cộng :</strong></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="text-right">
                  <strong style="color: orchid">
                    {{ number_format(phieuin.sotien, 0, ',', '.') }}
                  </strong>
                </td>
              </table>
            </div>
            <!-- Table -->
            <div class="row">
              <div
                style="margin-left: 18px"
                class="row col-12 col-lg-12 invoice_address"
              >
                Tổng số tiền {{ '\u00A0' }}
                <a style="font-style: italic; font-size: 0.8em"
                  >(Viết bằng chữ) :</a
                >
                <a style="font-style: italic; color: orchid"
                  >{{ '\u00a0' }} ( {{ phieuin.sotienvn }} )
                </a>
              </div>
            </div>
            <div class="row">
              <div
                style="margin-left: 18px"
                class="row col-12 col-lg-12 invoice_address"
              >
                Số chứng từ gốc kèm theo:
                ......................................................
              </div>
            </div>
            <div class="row">
              <div class="col-3 invoice_address text-center">
                <strong>Giám đốc</strong>
              </div>
              <div class="col-2 invoice_address text-center">
                <strong>Kế toán trưởng</strong>
              </div>
              <div class="col-2 invoice_address text-center">
                <strong>Người lập</strong>
              </div>
              <div class="col-2 invoice_address text-center">
                <strong>Thủ kho</strong>
              </div>
              <div class="col-3 invoice_address text-center">
                <strong>{{ phieuin.nguoinopnhan }}</strong>
              </div>
            </div>
            <div v-if="nguoikyten.themdong"><br /><br /><br /><br /></div>
            <div class="row" v-if="nguoikyten.themdong && nguoikyten.sign">
              <div class="col-3 invoice_address text-center">
                {{ nguoikyten.giamdoc }}
              </div>
              <div class="col-2 invoice_address text-center">
                {{ nguoikyten.kttruong }}
              </div>
              <div class="col-2 invoice_address text-center">
                {{ nguoikyten.nguoilap }}
              </div>
              <div class="col-2 invoice_address text-center">
                {{ nguoikyten.thukho }}
              </div>
              <div class="col-3 invoice_address text-right"></div>
            </div>

            <!-- <br><br><br> -->
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
      nguoikyten: {
        giamdoc: 'Trần Văn Nghĩa',
        kttruong: 'Trần Thị Xuân Mai',
        nguoilap: 'Trần Vũ Anh',
        thuquy: 'Trần Mai Thảo',
        thukho: 'Trần Thủ Kho',
        sign: false,
        themdong: false,
      },
      ctuvattus: [],
      infoketoan: [],
      phieuthuchi: [],
      tkchitiet: [],
      chtml: '',
    }
  },
  // ===Code to be executed when Component is mounted
  mounted() {
    //alert(this.$route.params.ctid)
    this.ctid = this.$route.params.ctid
    this.readCtuktoans()
    // console.log(this.products);
  },

  created() {
    this.infoketoan = this.$jwtAcn.getKetoan()
    //window.localStorage.removeItem(nguoikyten);
    //this.nguoikyten = JSON.parse(window.localStorage.getItem("nguoikyten") );
    var test = JSON.parse(window.localStorage.getItem('nguoikyten'))
    if (test != null) this.nguoikyten = test
    this.$store.state.isPrinting = true
  },

  // ===Computed properties for the component
  computed: {},
  // ===Component methods
  methods: {
    checkifline5(mactid) {
      for (let index = this.tkchitiet[mactid].length + 1; index < 4; index++) {
        this.tkchitiet[mactid].push([])
      }
      // if(this.ctid == "All"){  // Nếu in từng phiếu thì in hết các dòng , All chỉ in 3 dòng
      //     for (let index = this.tkchitiet[ctid].length+1; index > 7; index--) {
      //         this.tkchitiet[ctid].pop();
      //     }
      // }
      return true
    },
    goTrangtruoc() {
      this.$router.go(-1)
      this.$store.state.isPrinting = false
    },
    printDiv() {
      window.localStorage.setItem('nguoikyten', JSON.stringify(this.nguoikyten))
      window.print()
      this.goTrangtruoc()
    },

    readCtuktoans() {
      this.$store.commit('set', ['isLoading', true])
      this.infoketoan['ctid'] = this.ctid == 'All' ? '' : this.ctid
      this.$apiAcn
        .post('/getCtuvattu', this.infoketoan)
        .then((response) => {
          this.ctuvattus = response.data.getCtuvattu
          var luuctid = '???'
          this.ctuvattus.forEach((item) => {
            if (
              item['tkno'].substring(0, 2) == '15' ||
              item['tkco'].substring(0, 2) == '15'
            ) {
              var tkthuchi = []
              tkthuchi['ctid'] = item['ctid']
              tkthuchi['soct'] = item['soct']
              tkthuchi['ngay'] = item['ngay']
              tkthuchi['diengiai'] = item['diengiai']
              tkthuchi['tkno'] = item['tkno']
              tkthuchi['tkco'] = item['tkco']
              tkthuchi['sotien'] = item['sotienkt']
              tkthuchi['sotienvn'] = item['sotienvn']
              tkthuchi['ghichu'] = item['ghichu']
              tkthuchi['tengoi'] = item['tengoi']
              tkthuchi['diachi'] = item['diachi']

              if (item['tkno'].substring(0, 2) == '15') {
                tkthuchi['tendoituong'] = 'Người giao'
                tkthuchi['tenphieu'] = 'PHIẾU NHẬP'
                tkthuchi['nguoinopnhan'] = 'Người giao'
                tkthuchi['mauso'] = '01'
                tkthuchi['istk'] = 'nhập'
                tkthuchi['istk2'] = 'Nhập'
              } else {
                tkthuchi['tendoituong'] = 'người nhận'
                tkthuchi['tenphieu'] = 'PHIẾU XUẤT'
                tkthuchi['nguoinopnhan'] = 'Người nhận'
                tkthuchi['mauso'] = '02'
                tkthuchi['istk'] = 'xuất'
                tkthuchi['istk2'] = 'Xuất'
              }

              if (item.ctid != luuctid) {
                this.phieuthuchi.push(tkthuchi)
              }
              var chitiet = [] // Cho chitiet
              chitiet['mahang'] = item['mahang']
              chitiet['makho'] = item['makho']
              chitiet['tenhang'] = item['tenhang']
              chitiet['donvi'] = item['donvi']
              chitiet['soluong'] = item['soluong']
              chitiet['sotien'] = item['sotien']
              if (typeof this.tkchitiet['ctid_' + item.ctid] == 'undefined')
                this.tkchitiet['ctid_' + item.ctid] = []
              this.tkchitiet['ctid_' + item.ctid].push(chitiet)
              luuctid = item.ctid
            }
          })
          this.$store.commit('set', ['isLoading', false])
          return this.phieuthuchi // để tắt bên dưới : this.$store.state.isPrinting = false ;
        })
        .then((response) => {
          if (response.length == 0) this.$store.state.isPrinting = false
          //console.log(this.tkchitiet)
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
