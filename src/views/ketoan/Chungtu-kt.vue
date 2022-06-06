<template>
  <!-- eslint-disable -->
  <div>
    <CRow v-if="updaterec">
      <CCol sm="12">
        <CCard>
          <CCardHeader style="font-size: 25px">
            Cập nhật &#8482; <strong v-if="ischitiet == 1">Chi tiết</strong
            ><strong v-if="ischitiet == 2">Vật tư</strong
            ><strong v-if="ischitiet == 3">Hóa đơn</strong>
          </CCardHeader>
          <CCardBody>
            <CForm @submit.prevent="submitForm">
              <!-- HÓA ĐƠN =============================================== -->
              <div v-if="ischitiet == 3">
                <CRow>
                  <CCol md="4">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Số hóa đơn</CInputGroupText>
                      <CFormInput
                        class="form-control"
                        :class="{ 'is-valid': testValidator('sohd') }"
                        v-model="hoadon.sohd"
                        title="Mẫu số HĐ chờ Upload: C22TVN-???"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md="4">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Ngày</CInputGroupText>
                      <CFormInput
                        class="form-control"
                        :class="{ 'is-valid': testValidator('ngay') }"
                        v-model="hoadon.ngay"
                        type="date"
                        :title="datetitle"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md="4" style="z-index: 2">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Mã số Thuế</CInputGroupText>
                      <Multiselect
                        @select="selectGetCompany()"
                        v-model="hoadon.masothue"
                        placeholder="Mã số thuế"
                        :searchable="true"
                        trackBy="value"
                        label="value"
                        class="form-control is-valid"
                        :class="{
                          'multiselect-blue': !testTheme('dark'),
                          'multiselect-dark': testTheme('dark'),
                        }"
                        :options="danhmucCustomer"
                        :is-valid="testValidator('masothue')"
                      >
                        <template v-slot:option="{ option }">
                          <!-- <img class="character-option-icon" :src="option.icon" /> -->
                          {{ option.value }} {{ option.company }}
                        </template>
                      </Multiselect>
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>% Thuế</CInputGroupText>
                      <CFormInput
                        class="form-control"
                        :class="{ 'is-valid': testValidator('thuesuat') }"
                        v-model="hoadon.thuesuat"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md="3">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Số tiền</CInputGroupText>
                      <CFormInput
                        class="form-control is-valid"
                        v-model="hoadon.giaban"
                        title="Bấm Tab tính tiền Thuế"
                        @change="tinhTienThue()"
                        v-mask-decimal.br="0"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md="3">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Thuế gtgt</CInputGroupText>
                      <CFormInput
                        class="form-control is-valid"
                        v-model="hoadon.thuegtgt"
                        v-mask-decimal.br="0"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md="3">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Cộng Tiền</CInputGroupText>
                      <CFormInput
                        class="congtien"
                        :disabled="true"
                        v-model="TotalHd_Tien"
                        v-mask-decimal.br="0"
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="6">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Diển giãi</CInputGroupText>
                      <CFormInput
                        class="form-control"
                        :class="{ 'is-valid': testValidator('diengiai') }"
                        v-model="hoadon.diengiai"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md="3">
                    <CButton
                      class="btn btn-outline-info btn-sm"
                      @click="showModalForm()"
                      id="modal"
                      title="Bổ sung Khách hàng"
                      ><i class="fa fa-user-plus" aria-hidden="true"></i>
                      Cust..
                    </CButton>
                    <CButton
                      style="float: right; margin-right: 0px"
                      class="btn btn-outline-info btn-sm"
                      @click="uploadPreviewInvoice(true)"
                      title="Upload Hóa đơn lên Server"
                      ><i class="fa fa-cloud-upload" aria-hidden="true"></i>Up
                    </CButton>
                    <CButton
                      style="float: right; margin-right: 5px"
                      class="btn btn-outline-info btn-sm"
                      @click="downdInvoiceNumber(true)"
                      title="Download và Cập nhật số Hóa đơn"
                      ><i class="fa fa-cloud-download" aria-hidden="true"></i>
                    </CButton>

                    <CButton
                      style="float: right; margin-right: 5px"
                      class="btn btn-outline-warning btn-sm"
                      @click="uploadPreviewInvoice(false)"
                      title="Xem trước Hóa đơn"
                      ><i class="fa fa-eye" aria-hidden="true"></i>View
                    </CButton>
                  </CCol>
                  <CCol md="3">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Cộng Thuế</CInputGroupText>
                      <CFormInput
                        id="congthue"
                        :disabled="true"
                        v-model="TotalHd_Thue"
                        v-mask-decimal.br="0"
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>

                <modal
                  :header="'Khách hàng Mới'"
                  :isShow="showModal"
                  v-if="showModal"
                  @close="showModal = false"
                >
                  <customer-form
                    :customer="customer"
                    v-on:submit-form="customerAction"
                  />
                </modal>

                <table
                  class="topics vgt-table condensed bordered striped vgt-wrap"
                  :class="{ nocturnal: testTheme('dark') }"
                >
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Số hóa đơn</th>
                      <th>Ngày tháng</th>
                      <th>Thuế suất</th>
                      <th>Công ty</th>
                      <th>Số tiền</th>
                      <th>Thuế gtgt</th>
                      <th>Thành tiền</th>
                      <th>Thực hiện &#8482;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(hoadon, index) in hoadons">
                      <!-- <td>{{ hoadon.diengiai }}</td> -->
                      <td style="text-align: center">{{ index + 1 }}</td>
                      <td>{{ hoadon.sohd }}</td>
                      <td>{{ formatDate(hoadon.ngay) }}</td>
                      <td style="text-align: center">{{ hoadon.thuesuat }}</td>
                      <td>{{ getCompany(hoadon.masothue) }}</td>
                      <td style="text-align: right">{{ hoadon.giaban }}</td>
                      <td style="text-align: right">{{ hoadon.thuegtgt }}</td>
                      <td style="text-align: right; font-weight: bold">
                        {{
                          number_format(
                            hoadon.giaban
                              .replace(/\./g, '')
                              .replace(/\,/g, '.') *
                              1 +
                              hoadon.thuegtgt
                                .replace(/\./g, '')
                                .replace(/\,/g, '.') *
                                1,
                            0,
                            ',',
                            '.',
                          )
                        }}
                      </td>

                      <td style="text-align: center">
                        <a
                          class="fa fa-pencil-square-o text-info mr-1"
                          @click="editHoadon(index)"
                          id="1"
                        ></a
                        >&nbsp&nbsp&nbsp
                        <a
                          class="fa fa-trash-o text-warning mr-1"
                          @click="deleteHoadon(index)"
                          id="2"
                        ></a>
                        <!-- <button  style="margin-right: 5px;" @click="editHoadon(index)" class="btn btn-outline-info btn-sm">Sửa</button> -->
                        <!-- <button  @click="deleteHoadon(index)" class="btn btn-outline-warning btn-sm">Xóa</button>             -->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- VẬT TƯ =============================================== -->
              <div v-if="ischitiet == 2">
                <CRow>
                  <CCol md="4" style="z-index: 2">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Mã hàng</CInputGroupText>
                      <Multiselect
                        v-model="ctuvattu.mahang"
                        placeholder="Mã hàng"
                        :searchable="true"
                        trackBy="value"
                        label="value"
                        class="form-control is-valid"
                        :class="{
                          'multiselect-blue': !testTheme('dark'),
                          'multiselect-dark': testTheme('dark'),
                        }"
                        :options="danhmucTenhang"
                        :is-valid="testValidator('mahang')"
                      >
                        <template v-slot:option="{ option }">
                          <!-- <img class="character-option-icon" :src="option.icon" /> -->
                          {{ option.value }} {{ option.tenhang }}
                        </template>
                      </Multiselect>
                    </CInputGroup>
                  </CCol>
                  <CCol md="4" style="z-index: 2">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Mã Kho</CInputGroupText>
                      <Multiselect
                        v-model="ctuvattu.makho"
                        placeholder="Mã kho"
                        :searchable="true"
                        trackBy="value"
                        label="value"
                        class="form-control is-valid"
                        :class="{
                          'multiselect-blue': !testTheme('dark'),
                          'multiselect-dark': testTheme('dark'),
                        }"
                        :options="danhmucKhohang"
                        :is-valid="testValidator('makho')"
                      >
                        <template v-slot:option="{ option }">
                          <!-- <img class="character-option-icon" :src="option.icon" /> -->
                          {{ option.value }} {{ option.tengoi }}
                        </template>
                      </Multiselect>
                    </CInputGroup>
                  </CCol>
                  <CCol md="1">
                    <CButton
                      class="btn btn-outline-info btn-sm"
                      @click="showModalForm()"
                      id="modal"
                      title="Bổ sung Mã hàng"
                      >Mã++
                    </CButton>
                  </CCol>

                  <CCol md="3">
                    <div class="input-group" style="padding-bottom: 15px">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Số lượng</span>
                      </div>
                      <input
                        v-mask-decimal.br="2"
                        v-model="ctuvattu.soluong"
                        type="text"
                        class="form-control is-valid"
                      />
                    </div>
                  </CCol>
                </CRow>

                <modal
                  :header="'Mặt hàng Mới'"
                  :isShow="showModal"
                  v-if="showModal"
                  @close="showModal = false"
                >
                  <product-form
                    :product="product"
                    v-on:submit-form="productAction"
                  />
                </modal>

                <CRow>
                  <CCol md="4">
                    <div class="input-group" style="padding-bottom: 15px">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Đơn giá</span>
                      </div>
                      <input
                        title="Bấm Tab tính giá -tiền"
                        v-mask-decimal.br="2"
                        @change="tinhGiaTien('dongia')"
                        v-model="ctuvattu.dongia"
                        class="form-control is-valid"
                      />
                    </div>
                  </CCol>
                  <CCol md="4">
                    <div class="input-group" style="padding-bottom: 15px">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Thành tiền</span>
                      </div>
                      <input
                        title="Bấm Tab tính giá -tiền"
                        v-mask-decimal.br="0"
                        @change="tinhGiaTien('sotien')"
                        v-model="ctuvattu.sotien"
                        class="form-control is-valid"
                      />
                    </div>
                  </CCol>
                  <CCol md="4">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Cộng tiền</CInputGroupText>
                      <CFormInput
                        class="congtien"
                        :disabled="true"
                        style="text-align: right"
                        v-model="TotalCtuvattu"
                        v-mask-decimal.br="0"
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>

                <table
                  class="topics vgt-table condensed bordered striped vgt-wrap"
                  :class="{ nocturnal: testTheme('dark') }"
                >
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Mã hàng</th>
                      <th>Tên hàng</th>
                      <th>Mã kho</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                      <th>Ngoại tệ (USD)</th>
                      <th>Thực hiện &#8482;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(ctuvattu, index) in ctuvattus">
                      <td style="text-align: center">{{ index + 1 }}</td>
                      <td>{{ ctuvattu.mahang }}</td>
                      <td>{{ getTenhang(ctuvattu.mahang) }}</td>
                      <td>{{ ctuvattu.makho }}</td>
                      <td style="text-align: right">{{ ctuvattu.soluong }}</td>
                      <td style="text-align: right">{{ ctuvattu.sotien }}</td>
                      <td style="text-align: right">{{ ctuvattu.ngoaite }}</td>
                      <td style="text-align: center">
                        <a
                          class="fa fa-pencil-square-o text-info mr-1"
                          @click="editCtuvattu(index)"
                          id="1"
                        ></a
                        >&nbsp&nbsp&nbsp
                        <a
                          class="fa fa-trash-o text-warning mr-1"
                          @click="deleteCtuvattu(index)"
                          id="2"
                        ></a>
                        <!-- <button  style="margin-right: 5px;" @click="editCtuvattu(index)" class="btn btn-outline-info btn-sm">Sửa</button>            
                                <button  @click="deleteCtuvattu(index)" class="btn btn-outline-warning btn-sm">Xóa</button>             -->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- CHI TIẾT =============================================== -->
              <div v-if="ischitiet == 1">
                <CRow>
                  <CCol md="8">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Diển giãi</CInputGroupText>
                      <CFormInput
                        class="form-control"
                        :class="{ 'is-valid': testValidator('diengiai') }"
                        v-model="chitiet.diengiai"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md="4">
                    <div class="input-group" style="padding-bottom: 15px">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Số tiền</span>
                      </div>
                      <input
                        v-mask-decimal.br="0"
                        v-model="chitiet.sotien"
                        type="text"
                        class="form-control is-valid"
                      />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="4">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>TK Nợ</CInputGroupText>
                      <Multiselect
                        v-model="chitiet.tkno"
                        placeholder="Số tài khoản"
                        :searchable="true"
                        trackBy="value"
                        label="value"
                        class="form-control is-valid"
                        :class="{
                          'multiselect-blue': !testTheme('dark'),
                          'multiselect-dark': testTheme('dark'),
                        }"
                        :options="danhmucTaikhoan"
                        :is-valid="testValidator('tkno')"
                      >
                        <template v-slot:option="{ option }">
                          <!-- <img class="character-option-icon" :src="option.icon" /> -->
                          {{ option.value }} {{ option.tentk }}
                        </template>
                      </Multiselect>
                    </CInputGroup>
                  </CCol>
                  <CCol md="4">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>TK Có</CInputGroupText>
                      <Multiselect
                        v-model="chitiet.tkco"
                        placeholder="Số tài khoản"
                        :searchable="true"
                        trackBy="value"
                        label="value"
                        class="form-control is-valid"
                        :class="{
                          'multiselect-blue': !testTheme('dark'),
                          'multiselect-dark': testTheme('dark'),
                        }"
                        :options="danhmucTaikhoan"
                        :is-valid="testValidator('tkco')"
                      >
                        <template v-slot:option="{ option }">
                          <!-- <img class="character-option-icon" :src="option.icon" /> -->
                          {{ option.value }} {{ option.tentk }}
                        </template>
                      </Multiselect>
                    </CInputGroup>
                  </CCol>
                  <CCol md="1">
                    <CButton
                      class="btn btn-outline-info btn-sm"
                      @click="showModalForm()"
                      id="modal"
                      title="Bổ sung Tài khoản"
                      >Stk++
                    </CButton>
                  </CCol>
                  <CCol md="3">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Cộng tiền</CInputGroupText>
                      <CFormInput
                        class="congtien"
                        :disabled="true"
                        v-model="TotalChitiet"
                        v-mask-decimal.br="0"
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>

                <modal
                  :header="'Tài khoản Mới'"
                  :isShow="showModal"
                  v-if="showModal"
                  @close="showModal = false"
                >
                  <account-form
                    :account="account"
                    v-on:submit-form="accountAction"
                  />
                </modal>

                <table
                  class="topics vgt-table condensed bordered striped vgt-wrap"
                  :class="{ nocturnal: testTheme('dark') }"
                >
                  <thead>
                    <tr>
                      <th>ID</th>
                      <!-- <th>Diễn giãi</th> -->
                      <th>Tài khoản Nợ</th>
                      <th>Tài khoản Có</th>
                      <th>Số tiền</th>
                      <th>Ngoại tệ</th>
                      <th>Thực hiện &#8482;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(chitiet, index) in chitiets">
                      <td style="text-align: center">{{ index + 1 }}</td>
                      <!-- <td>{{ chitiet.diengiai }}</td> -->
                      <td>{{ chitiet.tkno }}</td>
                      <td>{{ chitiet.tkco }}</td>
                      <td style="text-align: right">{{ chitiet.sotien }}</td>
                      <td style="text-align: right">{{ chitiet.ngoaite }}</td>

                      <td style="text-align: center">
                        <a
                          class="fa fa-pencil-square-o text-info mr-1"
                          @click="editChitiet(index)"
                          id="1"
                        ></a
                        >&nbsp&nbsp&nbsp
                        <a
                          class="fa fa-trash-o text-warning mr-1"
                          @click="deleteChitiet(index)"
                          id="2"
                        ></a>

                        <!-- <button  style="margin-right: 5px;" @click="editChitiet(index)" class="btn btn-outline-info btn-sm">Sửa</button>            
                                <button  @click="deleteChitiet(index)" class="btn btn-outline-warning btn-sm">Xóa</button>             -->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- ====================================================== -->
              <div v-if="ischitiet == 0">
                <CRow>
                  <CCol md="5">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Số Ch.từ</CInputGroupText>
                      <CFormInput
                        class="form-control"
                        :class="{ 'is-valid': testValidator('soct') }"
                        v-model="todo.soct"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md="7">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Ngày tháng</CInputGroupText>
                      <CFormInput
                        class="form-control"
                        :class="{ 'is-valid': testValidator('ngay') }"
                        v-model="todo.ngay"
                        :title="datetitle"
                        type="date"
                        :min="infoketoan.fromtodate.pd_fromdate"
                        :max="maxDateforInput"
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="12">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Diển giãi</CInputGroupText>
                      <CFormInput
                        class="form-control"
                        :class="{ 'is-valid': testValidator('diengiai') }"
                        v-model="todo.diengiai"
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="4">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>TK Nợ</CInputGroupText>
                      <Multiselect
                        v-model="todo.tkno"
                        placeholder="Số tài khoản"
                        :searchable="true"
                        trackBy="value"
                        label="value"
                        class="form-control is-valid"
                        :class="{
                          'multiselect-blue': !testTheme('dark'),
                          'multiselect-dark': testTheme('dark'),
                        }"
                        :options="danhmucTaikhoan"
                        :is-valid="testValidator('tkno')"
                      >
                        <template v-slot:option="{ option }">
                          <!-- <img class="character-option-icon" :src="option.icon" /> -->
                          {{ option.value }} {{ option.tentk }}
                        </template>
                      </Multiselect>
                    </CInputGroup>
                  </CCol>
                  <CCol md="4">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>TK Có</CInputGroupText>
                      <Multiselect
                        v-model="todo.tkco"
                        placeholder="Số tài khoản"
                        :searchable="true"
                        trackBy="value"
                        label="value"
                        class="form-control is-valid"
                        :class="{
                          'multiselect-blue': !testTheme('dark'),
                          'multiselect-dark': testTheme('dark'),
                        }"
                        :options="danhmucTaikhoan"
                        :is-valid="testValidator('tkco')"
                      >
                        <template v-slot:option="{ option }">
                          <!-- <img class="character-option-icon" :src="option.icon" /> -->
                          {{ option.value }} {{ option.tentk }}
                        </template>
                      </Multiselect>
                    </CInputGroup>
                  </CCol>

                  <CCol md="4">
                    <div class="input-group" style="padding-bottom: 15px">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Số tiền</span>
                      </div>
                      <input
                        v-mask-decimal.br="0"
                        v-model="todo.sotien"
                        type="text"
                        class="form-control is-valid"
                      />
                    </div>
                  </CCol>
                </CRow>
              </div>
              <hr />

              <div class="form-group form-actions">
                <CButton
                  type="submit"
                  class="btn btn-info btn-sm"
                  :disabled="!isValid"
                  id="addnew"
                >
                  Add New </CButton
                >&nbsp;&nbsp;
                <input
                  v-model="tinhTienHangHoadon"
                  v-if="ischitiet > 1"
                  title="Gán cộng tiền hàng-thuế vào chi tiết TK khi Update"
                  style="margin-right: 5px"
                  class="btn btn-outline-warning btn-sm"
                  type="checkbox"
                  value="tinhTienHangHoadon"
                />
                <CButton
                  type="submit"
                  class="btn btn-info btn-sm"
                  :disabled="!checkUpdate || !isValid"
                  id="update"
                >
                  Update
                </CButton>
                &nbsp;&nbsp;
                <CLoadingButton
                  :disabled="!isrestore"
                  size="sm"
                  color="info"
                  :timeout="2000"
                  variant="outline"
                  @click="restore()"
                  id="restore"
                >
                  >> Restore </CLoadingButton
                >&nbsp;&nbsp;
                <CButton
                  class="btn btn-outline-warning btn-sm"
                  @click="setAddnew()"
                  id="close"
                >
                  >> Close </CButton
                >&nbsp;&nbsp;&nbsp;&nbsp;
                <CButton
                  class="btn btn-outline-info btn-sm"
                  @click="inOneChungtu()"
                  id="inOne"
                >
                  >> In chứng từ
                  <a style="font-style: italic; font-size: 0.7em"
                    >{{ mess_print }}
                  </a> </CButton
                >&nbsp;&nbsp;&nbsp;&nbsp;
                <CButton
                  class="btn btn-outline-warning btn-sm"
                  @click="inAllChungtu()"
                  id="inAll"
                >
                  >> In toàn bộ </CButton
                >&nbsp;&nbsp;&nbsp;&nbsp;
                <CButton
                  style="float: right; margin-right: 0px"
                  class="btn btn-outline-success btn-sm"
                  @click="setChitiet(3)"
                  :disabled="!todo.ctid"
                  id="hoadon"
                >
                  >> Hóa đơn
                </CButton>
                <CButton
                  style="float: right; margin-left: 5px; margin-right: 5px"
                  class="btn btn-outline-info btn-sm"
                  @click="setChitiet(2)"
                  :disabled="!todo.ctid"
                  id="vattu"
                >
                  >> Vật tư
                </CButton>
                <CButton
                  style="float: right; margin-right: 0px"
                  class="btn btn-outline-warning btn-sm"
                  @click="setChitiet(1)"
                  :disabled="!todo.ctid"
                  id="chitiet"
                >
                  >> Chi tiết
                </CButton>
                <!-- <CButton type="submit" size="sm" color="success"><CIcon name="cil-check-circle"/> Submit</CButton>
                <CButton type="reset" size="sm" color="danger"><CIcon name="cil-ban"/> Reset</CButton> -->
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <br v-if="updaterec" />
    <h2 style="font-size: 25px; padding-left: 20px">
      Chứng từ Kế toán

      <a
        class="btn btn-outline-info btn-sm"
        style="float: right"
        id="createNew"
        ref="createNew"
        @click="setAddnew()"
      >
        ++ Tạo mới</a
      >
      <a
        class="btn btn-outline-info btn-sm"
        style="float: right; margin-right: 5px"
        id="createexcel"
        ref="createexcel"
        @click="exportExcel()"
      >
        >> Excel</a
      >
      <input
        title="Copy toàn bộ chứng từ trong kỳ"
        style="margin-right: 5px; float: right"
        class="btn btn-info"
        @change="CopyMultiChungtuID()"
        type="checkbox"
        value="copyMultict"
        v-model="copyMultict"
      />
      <a
        class="btn btn-outline-info btn-sm"
        style="float: right; margin-right: 5px"
        @click="tinhcandoi('chuyensodutk')"
      >
        Mang số dư</a
      >
      <a
        class="btn btn-outline-info btn-sm"
        style="float: right; margin-right: 5px"
        @click="tinhcandoi('tinhcandoips')"
      >
        Tính cân đối</a
      >
      <a
        class="btn btn-outline-info btn-sm"
        style="float: right; margin-right: 5px"
        @click="tatoansodutk()"
      >
        Tất toán Số dư</a
      >
    </h2>
    <CRow>
      <CCol md="3" style="float: right">
        <CInputGroup class="mb-3">
          <CFormInput
            size="sm"
            id="pd_fromdate"
            :placeholder="infoketoan.fromtodate.tungay"
          />
          <CFormInput
            size="sm"
            id="pd_todate"
            :placeholder="infoketoan.fromtodate.denngay"
          />
        </CInputGroup>
      </CCol>

      <CCol md="2" style="float: right">
        <CInputGroup size="sm" class="mb-3">
          <CFormSelect
            style="width: 60px"
            title="Giới hạn chuyển in Excel"
            class="mb-3"
            aria-label="Small select example"
            v-model="patern"
            :options="paternOptions"
          >
          </CFormSelect>
          <CInputGroupText style="width: 1px; height: 35px"></CInputGroupText>
          <CFormInput
            style="width: 40px; height: 35px"
            id="sotkhoan"
            v-model="sotkhoan"
            title="Số tài khoản"
            v-if="patern == 'TK'"
          />
        </CInputGroup>
      </CCol>

      <CCol v-if="patern != 'TK'" md="1" style="float: left"> </CCol>
      <CCol md="3" style="float: left"> </CCol>
      <CCol
        v-if="ischitiet == 2"
        md="3"
        style="float: right"
        title="Chuyển chứng từ (+) hoặc nhóm Mã hàng (+15xx..)-> Excel"
      >
        <CInputGroup size="sm" class="mb-3">
          <CInputGroupText>Mã hàng</CInputGroupText>
          <CFormInput id="mahang" v-model="paternmahang" />
        </CInputGroup>
      </CCol>
    </CRow>

    <vue-good-table
      id="tableACN"
      :columns="columns"
      :rows="todos"
      :theme="googletheme"
      v-on:cell-click="onCellClick"
      styleClass="vgt-table condensed bordered striped"
      max-height="20000px"
      :fixed-header="false"
      :line-numbers="this.colchecked"
      :pagination-options="{
        enabled: true,
        mode: 'pages',
        perPage: 15,
        position: 'top',
        perPageDropdown: [15, 30, 50, 100, 300, 500],
        dropdownAllowAll: true,
        setCurrentPage: 1,
        nextLabel: 'Sau',
        prevLabel: 'Trước',
        rowsPerPageLabel: 'Dòng/trang',
        ofLabel: 'of',
        pageLabel: 'Trang', // for 'pages' mode
        allLabel: 'All',
      }"
      :search-options="{
        enabled: true,
        trigger: 'enter',
        skipDiacritics: true,
        placeholder: 'Tìm nội dung ( >0 )',
      }"
    >
      >
      <template #table-actions>
        <input
          title="Lọc có giá trị > 0"
          style="margin-right: 20px"
          class="btn btn-info"
          @change="mySearchNoZero()"
          type="checkbox"
          id="vehicle1"
          name="vehicle1"
          value="true"
        />
        <input
          title="Trang đầu hoặc cuối"
          style="margin-right: 20px"
          class="btn btn-info"
          @change="goTopEndPages()"
          type="checkbox"
          id="vehicle1"
          name="vehicle1"
          value="true"
        />
        <input
          title="view column"
          style="margin-right: 20px"
          class="btn btn-info"
          @change="colOption()"
          v-model="colchecked"
          type="checkbox"
          id="vehicle1"
          name="vehicle1"
          value="colchecked"
        />
      </template>
      <template #table-actions-bottom>
        <!-- This will show up on the bottom of the table.  -->
      </template>
      <template #emptystate>
        <!-- This will show up when there are no rows -->
      </template>
    </vue-good-table>
    <br />
  </div>
</template>
<script>
import { VueGoodTable } from 'vue-good-table-next'
import apiService from '@/common/api.service'
import moment from 'moment'
import utility from '@/common/utility'
//import { cilUnderline } from '@coreui/icons'
import Modal from './modal/Modal.vue'
import CustomerForm from './modal/CustomerForm'
import AccountForm from './modal/AccountForm'
import ProductForm from './modal/ProductForm'
import { mapState, mapActions } from 'vuex'
//import dmtkhoan from '@/container/dmtkhoan'
import Multiselect from '@vueform/multiselect'

export default {
  name: 'Chungtu',
  mixins: [utility],
  components: {
    VueGoodTable,
    // eslint-disable-next-line
    moment,
    Modal,
    CustomerForm,
    AccountForm,
    ProductForm,
    //dmtkhoan,
    Multiselect,
  },
  data() {
    return {
      product: new Object(),
      customer: new Object(),
      account: new Object(),
      showModal: false,
      tinhTienHangHoadon: false,
      copyMultict: false,
      mess_print: 'Phiếu thu chi',
      sotkhoan: '',
      paternOptions: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '1+',
        '2+',
        '3+',
        '4+',
        '5+',
        '6+',
        '7+',
        '8+',
        '9+',
        '**',
        '++',
        '*+',
        'TK',
      ],
      paternmahang: '',
      patern: '1',
      Validator: {
        soct: false,
        ngay: false,
        diengiai: false,
        tkno: false,
        tkco: false,
        sotien: false,
        mahang: false,
        makho: false,
        soluong: false,
        sohd: false,
        masothue: false,
        thuesuat: false,
        giaban: false,
      },
      todoB: {},
      todos: [],
      todo: {
        id: '',
        soct: '',
        ngay: '',
        diengiai: '',
        tkno: '',
        tkco: '',
        sotien: '',
      },
      src_chitiet: [],
      chitiets: [],
      chitiet: {
        id: '',
        diengiai: '',
        tkno: '',
        tkco: '',
        sotien: '',
      },
      src_ctuvattu: [],
      ctuvattus: [],
      ctuvattu: {
        id: '',
        mahang: '',
        makho: '',
        soluong: '',
        sotien: '',
      },
      src_hoadon: [],
      hoadons: [],
      hoadon: {
        id: '',
        sohd: '',
        ngay: '',
        diengiai: '',
        masothue: '',
        thuesuat: '',
        giaban: '',
        thuegtgt: '',
      },
      infoketoan: [],
      models: 'chungtus',
      model: 'chungtu',
      TotalHd_Thue: 0,
      TotalHd_Tien: 0,
      TotalChitiet: 0,
      TotalCtuvattu: 0,
      numberOfTodos: 0,
      colchecked: true,
      updaterec: false,
      isrestore: false,
      infoprint: '',
      optprint: false,
      ischitiet: 0,
      // dmtkhoans: [],
      // dmtientes: [],
      // tenhangs: [],
      // dmtenkhos: [],
      // customers_: [],
      columns: [
        {
          label: 'Số c.từ',
          field: 'soct',
        },
        {
          label: 'Ngày tháng',
          field: 'ngay2',
        },
        {
          label: 'Diễn giãi',
          field: 'diengiai',
        },
        {
          label: 'TK Nợ',
          field: 'tkno',
        },
        {
          label: 'TK Có',
          field: 'tkco',
        },
        {
          label: 'Số tiền',
          field: 'sotien',
          tdClass: 'text-right',
        },
        {
          label: 'Hiệu chỉnh',
          field: 'btnedit',
          html: true,
          tdClass: 'text-center',
          width: '90px', // Phải có 110 - btn +40
          //hidden: !this.optprint,
        },
      ],
    }
  },

  methods: {
    selectGetCompany() {
      const company = this.danhmucCustomer.filter((item) => {
        return item.maso == this.hoadon.masothue
      })
      if (company.length > 0 && !this.hoadon.diengiai)
        this.hoadon.diengiai = company[0].company
    },
    getCompany(masothue) {
      const company = this.danhmucCustomer.filter((item) => {
        return item.maso == masothue
      })
      return company.length > 0 ? company[0].company : ''
    },
    getTenhang(mahang) {
      const hanghoa = this.danhmucTenhang.filter((item) => {
        return item.mahang == mahang
      })
      //console.log(mahang, hanghoa, this.tenhangs)
      return hanghoa.length > 0 ? hanghoa[0].tenhang : ''
    },
    submitForm(e) {
      // if(!moment(this.todo.dofbirth,'DD-MM-YYYY').isValid()) {
      //     this.$toastr.warning("Ngày không hợp lệ !!");
      //     return false;
      // }
      if (e.submitter.id == 'addnew') this.createTodo()
      if (e.submitter.id == 'update') this.updateTodo()
    },

    showModalForm: function () {
      this.showModal = true
    },
    productAction: function (product) {
      //this.loading = true;
      this.showModal = false
      // product.mahang= '';
      // product.tenhang= '';
      // product.donvi= '';
      console.log('Creating new product: ', product)
      apiService
        .post('tenhang', product)
        .then(async (r) => {
          if (r.status === 201) {
            this.$toastr.success('', 'Tạo mặt hàng mới thành công.')
            await this.getDanhmuc('GET_DM_TENHANG')
            await this.setChitiet(0) // for update
          } else this.$toastr.warning('', 'Tạo mặt hàng mới KHÔNG thành công.')
        })
        .catch((err) => {
          this.$toastr.warning('', 'Tạo mặt hàng mới KHÔNG thành công.')
          console.log(err)
        })
    },
    customerAction: function (customer) {
      //this.loading = true;
      this.showModal = false
      // customer.phone1= '';
      // customer.account= '';
      // customer.bank= '';
      // customer.citibank= '';
      console.log('Creating new customer: ', customer)
      apiService
        .post('customer_', customer)
        .then(async (r) => {
          if (r.status === 201) {
            this.$toastr.success('', 'Tạo khách hàng mới thành công.')
            await this.getDanhmuc('GET_DM_CUSTOMER')
            await this.setChitiet(0) // for update
          } else
            this.$toastr.warning('', 'Tạo khách hàng mới KHÔNG thành công.')
        })
        .catch((err) => {
          this.$toastr.warning('', 'Tạo khách hàng mới KHÔNG thành công.')
          console.log(err)
        })
    },
    accountAction: function (account) {
      //this.loading = true;
      this.showModal = false
      console.log('Creating new account: ', account)
      apiService
        .post('dmtkhoan', account)
        .then(async (r) => {
          if (r.status === 201) {
            this.$toastr.success('', 'Tạo tài khoản mới thành công.')
            await this.getDanhmuc('GET_DM_TAIKHOAN')
            await this.setChitiet(0) // for update dmtkhoan
          } else this.$toastr.warning('', 'Tạo tài khoản KHÔNG mới thành công.')
        })
        .catch((err) => {
          this.$toastr.warning('', 'Tạo tài khoản KHÔNG mới thành công.')
          console.log(err)
        })
    },
    GanTienHangHoadon(tongtien = 0, tienthue = 0) {
      if (!this.tinhTienHangHoadon) return
      tongtien = tongtien.toFixed().toString()
      tienthue = tienthue.toFixed().toString()
      var ctid = this.todo.ctid
      var tkThue = this.todo.tkco.substr(0, 3) == '511' ? '3331' : '1331'
      //console.log(1111,ctid,tongtien,tienthue,tkThue)

      this.$apiAcn
        .post('/query', {
          query: 'CALL GanTienHangHoadon(?,?,?,?)',
          params: [ctid, tongtien, tienthue, tkThue],
        })
        .then((ret) => {
          //console.log(ctid,tongtien,tienthue,tkThue,ret.data.query[1])
          if (ret.data.query[1].affectedRows > 0)
            this.$toastr.success(
              '',
              'Gán tổng tiền Hàng hóa-Thuế vào <Chi tiết> thành công.',
            )
          this.tinhTienHangHoadon = false
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.warning(
            '',
            'Gán tổng tiền Hàng hóa-Thuế vào <Chi tiết> KHÔNG thành công.',
          )
        })
    },
    SumSubTotal() {
      if (this.ischitiet == 1) {
        this.TotalChitiet = 0
        this.chitiets.forEach((item) => {
          this.TotalChitiet +=
            item.sotien.split('.').join('').split(',').join('.') * 1
        })
        var zfsotien = this.format_so(this.TotalChitiet, 0)
        if (this.todo['sotien'] != zfsotien && this.TotalChitiet != 0) {
          this.todo.sotien = zfsotien
          this.todos[this.todo.index]['sotien'] = zfsotien
          //console.log(this.todos[this.todoB.index_] )
          this.todoB.sotien_ = zfsotien // Thay luôn trị dùng phục hồi
          this.updateSotien(this.TotalChitiet) // Không định dạng
          this.$toastr.warning(
            '',
            'Cập nhật Số tiền trên chứng từ = chi tiết...',
          )
        }
        this.TotalChitiet = zfsotien
      }
      if (this.ischitiet == 2) {
        this.TotalCtuvattu = 0
        this.ctuvattus.forEach((item) => {
          this.TotalCtuvattu +=
            item.sotien == 0
              ? 0
              : item.sotien.split('.').join('').split(',').join('.') * 1
        })
        this.GanTienHangHoadon(this.TotalCtuvattu)
        this.TotalCtuvattu = this.format_so(this.TotalCtuvattu, 0)
      }
      if (this.ischitiet == 3) {
        this.TotalHd_Thue = 0
        this.TotalHd_Tien = 0
        this.hoadons.forEach((item) => {
          this.TotalHd_Thue +=
            item.thuegtgt == 0
              ? 0
              : item.thuegtgt.split('.').join('').split(',').join('.') * 1
          this.TotalHd_Tien +=
            item.giaban == 0
              ? 0
              : item.giaban.split('.').join('').split(',').join('.') * 1
        })
        this.GanTienHangHoadon(this.TotalHd_Tien, this.TotalHd_Thue)
        this.TotalHd_Thue = this.format_so(this.TotalHd_Thue, 0)
        this.TotalHd_Tien = this.format_so(this.TotalHd_Tien, 0)
      }
    },

    tinhTienThue() {
      var thuesuat = parseInt('0' + this.hoadon.thuesuat)
      var thuegtgt =
        this.hoadon.giaban == 0
          ? 0
          : (this.hoadon.giaban.split('.').join('').split(',').join('.') *
              thuesuat) /
            100
      this.hoadon.thuegtgt = thuegtgt.toFixed().toString()
    },
    tinhGiaTien(field) {
      var soluong, dongia, sotien
      if (field == 'dongia') {
        soluong = this.ctuvattu.soluong.split('.').join('').split(',').join('.')
        dongia = this.ctuvattu.dongia.split('.').join('').split(',').join('.')
        sotien = soluong * dongia
        this.ctuvattu.sotien = sotien.toFixed().toString()
        console.log('this.ctuvattu.sotien: ', this.ctuvattu.sotien)
      } else {
        soluong = this.ctuvattu.soluong.split('.').join('').split(',').join('.')
        sotien = this.ctuvattu.sotien.split('.').join('')
        dongia = sotien / soluong
        this.ctuvattu.dongia = dongia.toFixed(2).toString()
      }
    },
    tatoansodutk() {
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .post('/tatoansodutk', this.infoketoan)
        .then(() => {
          this.readTodos()
          this.updaterec = false // Đóng screen update
          this.$store.commit('set', ['isLoading', false])
          this.$toastr.success(
            '',
            'Tất toán Số dư trong kỳ....Thực hiện thành công !!',
          )
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.warning(
            '',
            'Tất toán Số dư trong kỳ....KHÔNG thành công !!',
          )
          this.$store.commit('set', ['isLoading', false])
        })
    },
    formatDate(value) {
      return moment(value).format('DD-MM-YYYY')
    },
    fealdFn(fname) {
      return fname // this.number_format(fname,0,',','.');
    },
    inOneChungtu() {
      if (this.ischitiet < 2)
        this.$router.push('reports/inphieuthuchi/' + this.todo.ctid)
      if (this.ischitiet == 2)
        this.$router.push('reports/inphieunhapxuat/' + this.todo.ctid)
      if (this.ischitiet == 3)
        this.$router.push('reports/inphieuketoan/' + this.todo.ctid)
    },
    inAllChungtu() {
      if (this.ischitiet < 2) this.$router.push('reports/inphieuthuchi/All')
      if (this.ischitiet == 2) this.$router.push('reports/inphieunhapxuat/All')
      if (this.ischitiet == 3) this.$router.push('reports/inphieuketoan/All')
    },
    mySreach(row, col, cellValue, searchTerm) {
      if (this.searchNoZero && !searchTerm) {
        searchTerm = '>0'
      }
      searchTerm = searchTerm.trim()
      if (searchTerm == '>0')
        return (
          row.sotien + row.ngoaite > 0 ||
          row.sotien.toString().indexOf('.') != -1 ||
          row.ngoaite.toString().indexOf('.') != -1
        )
      return (
        row.soct.indexOf(searchTerm) != -1 ||
        row.ngay.indexOf(searchTerm) != -1 ||
        row.diengiai.indexOf(searchTerm) != -1 ||
        row.tkno.indexOf(searchTerm) != -1 ||
        row.tkco.indexOf(searchTerm) != -1 ||
        row.sotien.toString().indexOf(searchTerm) != -1
      )
    },
    tinhcandoi(whatCandoi) {
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .post('/' + whatCandoi, {
          pd_fromdate: this.infoketoan.fromtodate.pd_fromdate,
          pd_todate: this.infoketoan.fromtodate.pd_todate,
        })
        .then(() => {
          //console.log(data.data[whatCandoi]) ;
          this.readTodos() // Cập nhật lại dmsodutk
          this.$toastr.success('', 'Tính lại số dư thực hiện THÀNH CÔNG.')
          this.$store.commit('set', ['isLoading', false])
        })
        .catch((err) => {
          console.log(err)
          this.$store.commit('set', ['isLoading', false])
          this.$toastr.error('', 'Tính lại số dư thực hiện KHÔNG thành công.')
        })
    },

    readDanhmuc(models) {
      //console.log(this);
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .get(models)
        .then((data) => {
          this[models] = data.data[models]
          //console.log(this[models])
          this.$store.commit('set', ['isLoading', false])
        })
        .catch((err) => {
          console.log(err)
          //this.listLoading = false ;
        })
    },

    // Hóa đơn ------------------------------------

    updateHoadon() {
      if (!this.testValidator('', true)) {
        return
      }
      var newdata = this.hoadon
      apiService
        .patch(`hoadon/${newdata.id}`, {
          id: newdata.id,
          ctid: newdata.ctid,
          sohd: newdata.sohd,
          ngay: newdata.ngay,
          diengiai: newdata.diengiai,
          masothue: newdata.masothue,
          thuesuat: newdata.thuesuat,
          giaban: newdata.giaban.split('.').join('').split(',').join('.'),
          thuegtgt: newdata.thuegtgt.split('.').join('').split(',').join('.'),
        })
        .then((r) => {
          if (r.status === 200) {
            //this.updaterec = false // Đóng screen update
            this.src_hoadon = {
              // Hoàn trả những field có thể sửa
              sohd_: newdata.sohd,
              ngay_: newdata.ngay,
              diengiai_: newdata.diengiai,
              thuesuat_: newdata.thuesuat,
              giaban_: newdata.giaban,
              thuegtgt_: newdata.thuegtgt,
            }
            this.$toastr.success('', 'UPDATE chứng từ thành công.')
            this.SumSubTotal()
          }
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.error('', 'UPDATE chứng từ KHÔNG thành công.')
        })
    },

    createHoadon() {
      if (!this.testValidator('', true)) {
        return
      }
      var newdata = this.hoadon
      this.$apiAcn
        .post('/hoadon', {
          ctid: this.todo.ctid,
          sohd: newdata.sohd,
          ngay: newdata.ngay,
          diengiai: newdata.diengiai,
          masothue: newdata.masothue,
          thuesuat: newdata.thuesuat,
          giaban: newdata.giaban.split('.').join('').split(',').join('.'),
          thuegtgt: newdata.thuegtgt.split('.').join('').split(',').join('.'),
        })
        .then((response) => {
          //format_so_ct  Trả địnnh dạng lại để ADD grid
          //console.log(response.data)
          var newdata = response.data.hoadon
          newdata.giaban = this.number_format(newdata.giaban, 0, ',', '.')
          newdata.thuegtgt = this.number_format(newdata.thuegtgt, 0, ',', '.')
          this.hoadons.push(newdata)
          this.restore() // Nếu đang sửa mà ADD thì phục hồi lại
          this.reset() // sau các lệnh trên để cập nhật Grid
          this.$toastr.success('', 'CREATE chứng từ thành công.')
          this.SumSubTotal()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    editHoadon(index, first) {
      if (!first) this.restore()
      var tmp = this.hoadons[index]
      this.src_hoadon = {
        // Hoàn trả những field có thể sửa
        sohd_: tmp.sohd,
        masothue_: tmp.masothue,
        ngay_: tmp.ngay,
        diengiai_: tmp.diengiai,
        thuesuat_: tmp.thuesuat,
        giaban_: tmp.giaban,
        thuegtgt_: tmp.thuegtgt,
        index_: index,
      }
      this.hoadon = tmp
      //console.log(111, this.hoadon.masothue)

      // this.hoadon = {       // Khắc phục chậm
      //     id: tmp.id,
      //     ctid: tmp.ctid,
      //     sohd: tmp.sohd,
      //     ngay: tmp.ngay,
      //     diengiai: tmp.diengiai,
      //     thuesuat: tmp.thuesuat,
      //     giaban: tmp.giaban,
      //     thuegtgt: tmp.thuegtgt,
      // }
      //this.showtentk(this.chitiet.tkno,true);
      //this.showtentk(this.chitiet.tkco,false);
      window.scrollTo(0, 0)
      this.setRestore()
    },
    deleteHoadon(index) {
      let thutu = index + 1
      let conf = confirm('Xác nhận muốn xóa chứng từ Hóa đơn (' + thutu + ') ?')
      if (conf === true) {
        this.$apiAcn
          .delete('/hoadon/' + this.hoadons[index].id, this.hoadons[index])
          .then(() => {
            this.hoadons.splice(index, 1)
            this.reset()
            this.$toastr.success('', 'DELETE chứng từ thành công.')
            this.SumSubTotal()
          })
          .catch((error) => {
            console.log(error.response)
            this.$toastr.error('', 'Không thể xóa chứng từ có mối quan hệ !!')
          })
      }
    },
    getHoadon() {
      //console.log(this);
      // this.listLoading = true
      this.$apiAcn
        .get('/hoadons/' + this.todo.ctid)
        .then((data) => {
          //console.log(data);
          this.hoadons = data.data.hoadons
          this.hoadons.forEach((item) => {
            item.ngay = moment(item.ngay).format('YYYY-MM-DD')
            item.giaban = this.number_format(item['giaban'], 0, ',', '.')
            item.thuegtgt = this.number_format(item['thuegtgt'], 0, ',', '.')
          })
          if (this.hoadons.length > 0) {
            //this.hoadon = data.data.hoadon[0];
            this.editHoadon(0, 1)
            this.SumSubTotal()
          } else this.reset()
        })
        .catch((err) => {
          console.log(err)
          //this.listLoading = false ;
        })
    },

    // Vật tư ------------------------------------

    updateCtuvattu() {
      if (!this.testValidator('', true)) {
        return
      }
      var newdata = this.ctuvattu
      apiService
        .patch(`ctuvattu/${newdata.id}`, {
          id: newdata.id,
          ctid: newdata.ctid,
          mahang: newdata.mahang,
          makho: newdata.makho,
          soluong: newdata.soluong.split('.').join('').split(',').join('.'),
          sotien: newdata.sotien.split('.').join('').split(',').join('.'),
        })
        .then((r) => {
          if (r.status === 200) {
            //this.updaterec = false // Đóng screen update
            this.src_ctuvattu = {
              // Hoàn trả những field có thể sửa
              mahang_: newdata.mahang,
              makho_: newdata.makho,
              soluong_: newdata.soluong,
              sotien_: newdata.sotien,
              ngoaite_: newdata.ngoaite,
            }
            this.$toastr.success('', 'UPDATE chứng từ thành công.')
            this.SumSubTotal()
          }
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.error('', 'UPDATE chứng từ KHÔNG thành công.')
        })
    },
    createCtuvattu() {
      if (!this.testValidator('', true)) {
        return
      }
      var newdata = this.ctuvattu
      this.$apiAcn
        .post('/ctuvattu', {
          ctid: this.todo.ctid,
          mahang: newdata.mahang,
          makho: newdata.makho,
          soluong: newdata.soluong.split('.').join('').split(',').join('.'),
          sotien: newdata.sotien.split('.').join('').split(',').join('.'),
        })
        .then((response) => {
          //format_so_ct  Trả địnnh dạng lại để ADD grid
          //console.log(response.data)
          newdata = response.data.ctuvattu
          newdata.sotien = this.number_format(newdata.sotien, 0, ',', '.')
          newdata.soluong = this.number_format(newdata.soluong, 2, ',', '.')
          this.ctuvattus.push(newdata)
          this.restore() // Nếu đang sửa mà ADD thì phục hồi lại
          this.reset() // sau các lệnh trên để cập nhật Grid
          this.$toastr.success('', 'CREATE chứng từ thành công.')
          this.SumSubTotal()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    editCtuvattu(index, first) {
      if (!first) this.restore()
      var tmp = this.ctuvattus[index]
      this.src_ctuvattu = {
        // Hoàn trả những field có thể sửa
        mahang_: tmp.mahang,
        makho_: tmp.makho,
        soluong_: tmp.soluong,
        sotien_: tmp.sotien,
        ngoaite_: tmp.ngoaite,
        index_: index,
      }
      this.ctuvattu = tmp
      // this.ctuvattu = {       // Khắc phục bị chậm
      //     id: tmp.id,
      //     ctid: tmp.ctid,
      //     mahang: tmp.mahang,
      //     makho: tmp.makho,
      //     soluong: tmp.soluong,
      //     sotien: tmp.sotien,
      //     ngoaite: tmp.ngoaite,
      // }

      this.paternmahang = tmp.mahang
      //this.showtentk(this.chitiet.tkno,true);
      //this.showtentk(this.chitiet.tkco,false);
      window.scrollTo(0, 0)
      this.setRestore()
    },
    deleteCtuvattu(index) {
      let thutu = index + 1
      let conf = confirm('Xác nhận muốn xóa chứng từ Vật tư (' + thutu + ') ?')
      if (conf === true) {
        this.$apiAcn
          .delete(
            '/ctuvattu/' + this.ctuvattus[index].id,
            this.ctuvattus[index],
          )
          .then(() => {
            this.ctuvattus.splice(index, 1)
            this.reset()
            this.$toastr.success('', 'DELETE chứng từ thành công.')
            this.SumSubTotal()
          })
          .catch((error) => {
            console.log(error.response)
            this.$toastr.warning('', 'Không thể xóa chứng từ có mối quan hệ !!')
          })
      }
    },
    getCtuvattu() {
      //console.log(this);
      // this.listLoading = true
      this.$apiAcn
        .get('/ctuvattus/' + this.todo.ctid)
        .then((data) => {
          //console.log(data);
          this.ctuvattus = data.data.ctuvattus
          this.ctuvattus.forEach((item) => {
            item.soluong = this.number_format(item['soluong'], 2, ',', '.')
            item.sotien = this.number_format(item['sotien'], 0, ',', '.')
            item.ngoaite = this.number_format(item['ngoaite'], 2, ',', '.')
          })

          if (this.ctuvattus.length > 0) {
            //this.ctuvattu = data.data.ctuvattus[0];
            this.editCtuvattu(0, 1)
            this.SumSubTotal()
          } else this.reset()
        })
        .catch((err) => {
          console.log(err)
          //this.listLoading = false ;
        })
    },

    // Chi tiết ------------------------------------

    updateChitiet() {
      if (!this.testValidator('', true)) {
        return
      }
      var newdata = this.chitiet
      apiService
        .patch(`chitiet/${newdata.id}`, {
          id: newdata.id,
          diengiai: newdata.diengiai,
          tkno: newdata.tkno,
          tkco: newdata.tkco,
          sotien: newdata.sotien.split('.').join('').split(',').join('.'),
          ngoaite: newdata.ngoaite.split('.').join('').split(',').join('.'),
        })
        .then((r) => {
          if (r.status === 200) {
            //this.updaterec = false // Đóng screen update
            this.src_chitiet = {
              // Hoàn trả những field có thể sửa
              diengiai_: newdata.diengiai,
              tkno_: newdata.tkno,
              tkco_: newdata.tkco,
              sotien_: newdata.sotien,
              ngoaite_: newdata.ngoaite,
            }
            this.$toastr.success('', 'UPDATE chứng từ thành công.')
            this.SumSubTotal()
          }
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.error('', 'UPDATE chứng từ KHÔNG thành công.')
        })
    },

    createChitiet() {
      if (!this.testValidator('', true)) {
        return
      }
      var newdata = this.chitiet
      //format_so_ct
      //newdata.sotien = newdata.sotien.replace(/\./g, '');
      //newdata.ngoaite = newdata.ngoaite.split('.').join('').split(',').join('.');
      this.$apiAcn
        .post('/chitiet', {
          ctid: this.todo.ctid,
          diengiai: newdata.diengiai,
          tkno: newdata.tkno,
          tkco: newdata.tkco,
          sotien: newdata.sotien.split('.').join('').split(',').join('.'),
          ngoaite: 0, // newdata.ngoaite.split('.').join('').split(',').join('.'),
        })
        .then((response) => {
          //format_so_ct  Trả địnnh dạng lại để ADD grid
          //console.log(response.data)
          var newdata = response.data.chitiet
          newdata.sotien = this.number_format(newdata.sotien, 0, ',', '.')
          newdata.ngoaite = this.number_format(newdata.ngoaite, 2, ',', '.')
          this.chitiets.push(newdata)
          this.restore() // Nếu đang sửa mà ADD thì phục hồi lại
          this.reset() // sau các lệnh trên để cập nhật Grid
          this.$toastr.success('', 'CREATE chứng từ thành công.')
          this.SumSubTotal()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    editChitiet(index, first) {
      if (!first) this.restore()
      var tmp = this.chitiets[index]
      this.src_chitiet = {
        // Hoàn trả những field có thể sửa
        diengiai_: tmp.diengiai,
        tkno_: tmp.tkno,
        tkco_: tmp.tkco,
        sotien_: tmp.sotien,
        ngoaite_: tmp.ngoaite,
        index_: index,
      }
      this.chitiet = tmp
      // this.chitiet= {       // Khắc phục chậm
      //     id: tmp.id,
      //     ctid: tmp.ctid,
      //     diengiai: tmp.diengiai,
      //     tkno: tmp.tkno,
      //     tkco: tmp.tkco,
      //     sotien: tmp.sotien,
      //     ngoaite: tmp.ngoaite,
      // }
      //this.showtentk(this.chitiet.tkno,true);
      //this.showtentk(this.chitiet.tkco,false);
      window.scrollTo(0, 0)
      this.setRestore()
    },
    deleteChitiet(index) {
      let thutu = index + 1
      let conf = confirm(
        'Xác nhận muốn xóa chứng từ chi tiết (' + thutu + ') ?',
      )
      if (conf === true) {
        this.$apiAcn
          .delete('/chitiet/' + this.chitiets[index].id, this.chitiets[index])
          .then(() => {
            this.chitiets.splice(index, 1)
            this.reset()
            this.$toastr.success('', 'DELETE chứng từ thành công.')
            this.SumSubTotal()
          })
          .catch((error) => {
            console.log(error.response)
            this.$toastr.warning('', 'Không thể xóa chứng từ có mối quan hệ !!')
          })
      }
    },
    getChitiet() {
      //console.log(this.todo.ctid,this.todo);
      // this.listLoading = true
      this.$apiAcn
        .get('/chitiets/' + this.todo.ctid)
        .then((data) => {
          this.chitiets = data.data.chitiets
          this.chitiets.forEach((item) => {
            item.sotien = this.number_format(item['sotien'], 0, ',', '.')
            item.ngoaite = this.number_format(item['ngoaite'], 2, ',', '.')
          })

          if (this.chitiets.length > 0) {
            //this.chitiet = data.data.chitiets[0];
            this.editChitiet(0, 1)
            this.SumSubTotal()
          } else {
            //this.reset()
            this.chitiet = {
              diengiai: this.todo.diengiai,
              tkno: this.todo.tkno,
              tkco: this.todo.tkco,
              sotien: this.todo.sotien,
              ngoaite: this.todo.ngoaite,
            }
          }
        })
        .catch((err) => {
          console.log(err)
          //this.listLoading = false ;
        })
    },

    setRestore() {
      if (this.ischitiet == 0) {
        this.mess_print = 'Thu chi'
        this.isrestore = this.todoB.index_ !== undefined
      }
      if (this.ischitiet == 1) {
        this.mess_print = 'Thu chi'
        this.isrestore = this.src_chitiet.index_ !== undefined
      }
      if (this.ischitiet == 2) {
        this.mess_print = 'Nhập xuất'
        this.isrestore = this.src_ctuvattu.index_ !== undefined
      }
      if (this.ischitiet == 3) {
        this.mess_print = 'Kế toán'
        this.isrestore = this.src_hoadon.index_ !== undefined
      }
    },
    setChitiet(nset) {
      this.ischitiet = this.ischitiet == nset ? 0 : nset
      if (this.ischitiet == 1) this.getChitiet()
      if (this.ischitiet == 2) this.getCtuvattu()
      if (this.ischitiet == 3) this.getHoadon()
      this.setRestore()
    },
    testValidator(field, lmess) {
      let passe = false
      if (this.ischitiet == 0) {
        if (field == 'soct') return (this.Validator.soct = this.todo.soct != '')
        // if(field == 'ngay') return this.Validator.ngay = (this.todo.ngay != '')
        //if(field == 'ngay') return this.Validator.ngay = ( this.todo.ngay >= new Date(this.infoketoan.fromtodate.pd_fromdate) && this.todo.ngay <= new Date(this.infoketoan.fromtodate.pd_todate) );
        if (field == 'ngay')
          return (this.Validator.ngay =
            new Date(this.todo.ngay) >=
              new Date(this.infoketoan.fromtodate.pd_fromdate) &&
            new Date(this.todo.ngay) <=
              new Date(this.infoketoan.fromtodate.pd_todate))
        if (field == 'diengiai')
          return (this.Validator.diengiai = this.todo.diengiai != '')
        if (field == 'tkno') return (this.Validator.tkno = this.todo.tkno != '')
        if (field == 'tkco') return (this.Validator.tkco = this.todo.tkco != '')
        if (!this.todo.sotien) this.todo.sotien = '0'
        passe =
          this.Validator.soct &&
          this.Validator.ngay &&
          this.Validator.diengiai &&
          this.Validator.tkno &&
          this.Validator.tkco
      }
      if (this.ischitiet == 1) {
        if (field == 'diengiai')
          return (this.Validator.diengiai = this.chitiet.diengiai != '')
        if (field == 'tkno')
          return (this.Validator.tkno = this.chitiet.tkno != '')
        if (field == 'tkco')
          return (this.Validator.tkco = this.chitiet.tkco != '')
        if (!this.chitiet.sotien) this.chitiet.sotien = '0'
        passe =
          this.Validator.diengiai && this.Validator.tkno && this.Validator.tkco
      }
      if (this.ischitiet == 2) {
        if (field == 'mahang')
          return (this.Validator.mahang = this.ctuvattu.mahang != '')
        if (field == 'makho')
          return (this.Validator.makho = this.ctuvattu.makho != '')
        //if(field == 'soluong') return this.Validator.soluong = (this.ctuvattu.soluong != '')
        if (!this.ctuvattu.sotien) this.ctuvattu.sotien = '0'
        passe = this.Validator.mahang && this.Validator.makho
      }
      if (this.ischitiet == 3) {
        if (field == 'sohd')
          return (this.Validator.sohd = this.hoadon.sohd != '')
        if (field == 'diengiai')
          return (this.Validator.diengiai = this.hoadon.diengiai != '')
        if (field == 'ngay')
          return (this.Validator.ngay = this.hoadon.ngay != '')
        if (field == 'masothue')
          return (this.Validator.masothue = this.hoadon.masothue != '')
        if (!this.hoadon.giaban) this.hoadon.giaban = '0'
        if (field == 'thuesuat')
          return (this.Validator.thuesuat = this.hoadon.thuesuat != '')
        passe =
          this.Validator.sohd &&
          this.Validator.diengiai &&
          this.Validator.ngay &&
          this.Validator.masothue &&
          this.Validator.thuesuat
      }
      if (!passe && lmess) {
        this.$toastr.warning('', 'Vui lòng nhập đầy đủ thông tin.')
      }
      return passe
    },

    editTodo(index, dat) {
      // Copy from
      this.restore() // Phục hồi nếu đã sửa this.ischitiet = ?
      this.ischitiet = 0
      this.restore() // Phục hồi nếu đã sửa
      this.todo = {
        id: dat.id,
        ctid: dat.ctid,
        soct: dat.soct,
        ngay: dat.ngay,
        ngay2: dat.ngay2,
        diengiai: dat.diengiai,
        tkno: dat.tkno,
        tkco: dat.tkco,
        sotien: dat.sotien,
        ngoaite: dat.ngoaite,
        index: index,
      }

      //this.todos = dat;
      Object.keys(this.todo).forEach((key) => {
        this.todoB[key + '_'] = this.todo[key]
      })

      this.updaterec = true
      window.scrollTo(0, 0)
      this.setRestore()
    },
    updatelist() {
      Object.keys(this.todo).forEach((key) => {
        // if(this.todos[this.todo.index][key] != this.todo[key] ) {
        //     // this.$set(this.todos[this.todo.index], key, this.todo[key]);
        //     //console.log(this.todo.index, key, this.todos[this.todo.index][key] , this.todo[key]);
        // }
        this.todos[this.todo.index][key] = this.todo[key]
      })
      //console.log(this.todo.index,this.todos,this.todos[this.todo.index] , this.todo);
    },

    restore() {
      // if(this.ischitiet==0 && typeof this.todoB.index_ != 'undefined') {
      if (this.ischitiet == 0) {
        var dat = this.todoB // Phải đổi tên FIELD & dùng ['abc'] MỚI OK
        this.todo['soct'] = dat.soct_
        this.todo['ngay'] = dat.ngay_
        this.todo['diengiai'] = dat.diengiai_
        this.todo['tkno'] = dat.tkno_
        this.todo['tkco'] = dat.tkco_
        this.todo['sotien'] = dat.sotien_
        this.todo['ngoaite'] = dat.ngoaite_
        //this.todos[dat.index_] = this.todo ;
      }
      var tmp
      if (
        this.ischitiet == 1 &&
        typeof this.src_chitiet.index_ != 'undefined'
      ) {
        tmp = this.src_chitiet
        this.chitiet['diengiai'] = tmp.diengiai_
        this.chitiet['tkno'] = tmp.tkno_
        this.chitiet['tkco'] = tmp.tkco_
        this.chitiet['sotien'] = tmp.sotien_
        this.chitiet['ngoaite'] = tmp.ngoaite_
        //this.chitiets[tmp.index_] = this.chitiet ;
      }
      if (
        this.ischitiet == 2 &&
        typeof this.src_ctuvattu.index_ != 'undefined'
      ) {
        tmp = this.src_ctuvattu
        this.ctuvattu['mahang'] = tmp.mahang_
        this.ctuvattu['makho'] = tmp.makho_
        this.ctuvattu['soluong'] = tmp.soluong_
        this.ctuvattu['dongia'] = tmp.dongia_
        this.ctuvattu['sotien'] = tmp.sotien_
        //this.ctuvattus[tmp.index_] = this.ctuvattu ;
      }
      if (this.ischitiet == 3 && typeof this.src_hoadon.index_ != 'undefined') {
        tmp = this.src_hoadon
        this.hoadon['sohd'] = tmp.sohd_
        this.hoadon['ngay'] = tmp.ngay_
        this.hoadon['diengiai'] = tmp.diengiai_
        this.hoadon['masothue'] = tmp.masothue_
        this.hoadon['giaban'] = tmp.giaban_
        this.hoadon['thuesuat'] = tmp.thuesuat_
        this.hoadon['thuegtgt'] = tmp.thuegtgt_
        //this.hoadons[tmp.index_] = this.hoadon ;
      }
    },
    reset() {
      this.SumSubTotal()
      if (this.ischitiet == 0) {
        this.todoB = []
        this.todo = {
          id: '',
          soct: '',
          ngay: this.infoketoan.fromtodate.pd_fromdate,
          diengiai: '',
          tkno: '',
          tkco: '',
          sotien: '',
          ngoaite: '',
        }
      }
      if (this.ischitiet == 1) {
        window.scrollTo(0, 0)
        this.src_chitiet = []
        this.chitiet = {
          id: '',
          diengiai: '',
          tkno: '',
          tkco: '',
          sotien: '',
          ngoaite: '',
        }
      }
      if (this.ischitiet == 2) {
        window.scrollTo(0, 0)
        this.src_ctuvattu = []
        this.ctuvattu = {
          id: '',
          mahang: '',
          makho: this.danhmucKhohang[0].makho || '',
          soluong: '',
          sotien: '',
        }
      }
      if (this.ischitiet == 3) {
        window.scrollTo(0, 0)
        this.src_hoadon = []
        this.hoadon = {
          id: '',
          sohd: '',
          ngay: this.infoketoan.fromtodate.pd_fromdate,
          diengiai: '',
          masothue: '',
          thuesuat: '%',
          giaban: '',
          thuegtgt: '',
        }
      }
      this.setRestore()
    },
    setAddnew() {
      this.updaterec = !this.updaterec
      if (this.updaterec) {
        this.reset()
      } else this.restore()
    },

    colOption() {
      //this.columns[5].hidden = !this.colchecked ;
      this.columns[6].hidden = !this.colchecked || this.optprint
    },

    onCellClick(params) {
      if (params.column.field == 'btnedit') {
        switch (params.event.srcElement.id) {
          case '1':
            this.editTodo(params.row.originalIndex, params.row)
            break
          case '2':
            this.deleteTodo(params.row.originalIndex, params.row)
            break
        }
      }
    },
    selectTodo(todo) {
      this.todos = todo
    },
    readTodos() {
      //console.log(this);
      this.listLoading = true
      this.$store.commit('set', ['isLoading', true])
      // this.$apiAcn.get('/'+this.models)
      this.$apiAcn
        .post('/' + this.models, {
          pd_fromdate: this.infoketoan.fromtodate.pd_fromdate,
          pd_todate: this.infoketoan.fromtodate.pd_todate,
        })
        .then((data) => {
          // console.log(data.data);
          this.todos = data.data[this.models]
          this.numberOfProducts = this.todos.length
          this.todos.forEach((item) => {
            item.sotien = this.number_format(item['sotien'], 0, ',', '.')
            item.btnedit = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
            item.ngay = moment(item.ngay).format('YYYY-MM-DD')
            item.ngay2 = moment(item.ngay).format('DD-MM-YYYY')
          })
          return data
        })
        .then(() => {
          this.$store.commit('set', ['isLoading', false])
          //console.log(dat);
        })
        .catch((err) => {
          console.log(err)
          this.$store.commit('set', ['isLoading', false])
        })
    },

    deleteTodo(index, row) {
      // console.log(row)
      if (
        !confirm(
          'Xóa chứng từ Kế toán và chứng từ liên kết: Chi tiết, Vật tư và Hóa đơn. Xác nhận muốn xóa chứng từ : ' +
            (index + 1) +
            ' ? ',
        )
      ) {
        return
      }
      row['index'] = index
      return this.CopyDelChungtuID(row)
    },
    // https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined
    CopyMultiChungtuID() {
      this.copyMultict = false
      var query =
        "SELECT ctid,soct,ngay FROM ctuktoan WHERE ngay BETWEEN '" +
        this.infoketoan.fromtodate.pd_fromdate +
        "' AND '" +
        this.infoketoan.fromtodate.pd_todate +
        "' "
      this.$apiAcn
        .post('/query', { query: query })
        .then((ret) => {
          let nDemsoct = ret.data.query.length
          if (ret.data.success && nDemsoct > 0) {
            //var strcheck = this.infoketoan.fromtodate.pd_fromdate.substr(5,2)+"-" +this.infoketoan.fromtodate.pd_todate.substr(5,2)+"/"+this.infoketoan.fromtodate.pd_fromdate.substr(0,4);
            if (
              confirm(
                'Bạn muốn COPY toàn bộ ( ' +
                  nDemsoct +
                  ' ) chứng từ trong kỳ ?',
              )
            ) {
              let tungayV = moment(
                this.infoketoan.fromtodate.pd_fromdate,
                'YYYY-MM-DD',
              ).format('DD/MM/YYYY')
              let tungay = moment(
                this.infoketoan.fromtodate.pd_fromdate,
                'YYYY-MM-DD',
              ).toDate() // For so sánh
              let newdate_ = prompt(
                'Nhập ngày tạo chứng từ có dạng : dd/mm/yyyy và phải lớn hơn ngày: ' +
                  tungayV,
                '**/**/****',
              ) // For Check lần 2
              let newdateV = newdate_
                ? newdate_.split('/').reverse().join('-')
                : '0000-00-00' // For Gửi CALL.
              let newdate = moment(newdateV, 'YYYY-MM-DD').toDate() // For so sánh
              if (moment(newdate).isValid() && newdate >= tungay) {
                let person = prompt(
                  'Copy chứng từ có thể làm thay đổi bảng <Cân đối Kế toán>...Xác nhận thực hiện bằng cách Nhập lại ngày tạo chứng từ có dạng : dd/mm/yyyy ',
                  '**/**/****',
                )
                if (person == null || person != newdate_) {
                  this.$toastr.warning(
                    '',
                    'Xác nhận không đúng định dạng ? nên KHÔNG COPY chứng từ.',
                  )
                  return
                }
                let query =
                  "CALL CopyChungtuKt('" +
                  this.infoketoan.fromtodate.pd_fromdate +
                  "','" +
                  this.infoketoan.fromtodate.pd_todate +
                  "','" +
                  newdateV +
                  "')"
                //console.log(query)
                newdate = moment(newdate, 'YYYY-MM-DD', true).format(
                  'MM/DD/YYYY',
                ) // chỉ để thông báo
                this.$apiAcn
                  .post('/query', { query: query })
                  .then(() => {
                    this.$toastr.success(
                      '',
                      'COPY ( ' +
                        nDemsoct +
                        ' ) chứng từ THÀNH CÔNG sang Ngày :' +
                        newdate,
                    )
                    this.readTodos()
                    this.updaterec = false // Đóng screen update
                    this.reset()
                  })
                  .catch((err) => {
                    console.log(err)
                    this.$toastr.error('', 'COPY chứng từ KHÔNG thành công.')
                  })
              } else
                this.$toastr.warning(
                  '',
                  'Ngày không hợp lệ ? nên KHÔNG COPY chứng từ.',
                )
            }
          } else this.$toastr.warning('', 'KHÔNG có chứng từ để COPY.')
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.error('', 'COPY chứng từ KHÔNG thành công.')
        })
    },
    CopyDelChungtuID(row, func, noShowErr) {
      if (!noShowErr && func && !this.testValidator('', true)) {
        return
      }
      var mess = func ? 'COPY' : 'DELETE'
      func = func ? 'CopyChungtuID' : 'DelChungtuID'
      var query = 'CALL ' + func + "('" + row.ctid + "')"
      if (func == 'CopyChungtuID') {
        query =
          'CALL ' +
          func +
          "('" +
          row.ctid +
          "','" +
          this.infoketoan.fromtodate.pd_todate +
          "')"
      }
      this.$apiAcn
        .post('/query', { query: query })
        .then((ret) => {
          //this.readTodos()
          if (typeof ret.data.query[0][0] != 'undefined') {
            var success = false
            if (func == 'CopyChungtuID' && ret.data.query[0][0]['count'] == 1) {
              var dat = ret.data.query[0][0]
              var tmp = {}
              tmp['id'] = dat.id
              tmp['ctid'] = dat.ctid
              tmp['soct'] = dat.soct
              tmp['ngay'] = moment(dat.ngay).format('YYYY-MM-DD')
              tmp['ngay2'] = moment(dat.ngay).format('DD-MM-YYYY')
              tmp['diengiai'] = dat.diengiai
              tmp['tkno'] = dat.tkno
              tmp['tkco'] = dat.tkco
              tmp['sotien'] = this.number_format(dat.sotien, 0, ',', '.')
              tmp[
                'btnedit'
              ] = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
              this.todos.push(tmp)
              this.updaterec = !(this.todo.id === '') // Nếu Đang AddNew thì Nhập tiếp
              this.restore() // Nếu đang sửa thì phục hồi lại list
              this.setAddnew()
              success = true
            }
            if (func == 'DelChungtuID' && ret.data.query[0][0]['count'] == 0) {
              this.todos.splice(row.index, 1)
              success = true
            }
            if (!noShowErr) {
              if (success)
                this.$toastr.success('', mess + ' chứng từ thành công.')
              else
                this.$toastr.warning('', mess + ' chứng từ KHÔNG thành công.')
            }
            this.updaterec = false // Đóng screen update
            this.reset()
          }
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.warning('', mess + ' chứng từ KHÔNG thành công.')
        })
    },
    createTodo() {
      if (this.ischitiet == 0 && this.todo.ctid) {
        if (
          confirm(
            'Thêm chứng từ Kế toán và chứng từ liên kết: Chi tiết, Vật tư và Hóa đơn ? Chọn <Yes> hoặc chỉ Copy thông tin Chứng từ <Cancel>',
          )
        ) {
          return this.CopyDelChungtuID(this.todo, true)
        }
      }
      if (this.ischitiet == 1) {
        return this.createChitiet()
      }
      if (this.ischitiet == 2) {
        return this.createCtuvattu()
      }
      if (this.ischitiet == 3) {
        return this.createHoadon()
      }
      // ===== DÙNG CHO THÊM MỚI
      if (!this.testValidator('', true)) {
        return
      }
      var newdata = this.todo
      apiService
        .post(this.model, {
          id: null,
          ctid: null,
          // null Server sẽ tạo
          soct: newdata.soct,
          ngay: newdata.ngay, // moment(newdata.ngay).format('YYYY-MM-DD'),
          diengiai: newdata.diengiai,
          tkno: newdata.tkno,
          tkco: newdata.tkco,
          sotien: newdata.sotien.split('.').join('').split(',').join('.'),
          // ngoaite: newdata.ngoaite,
        })
        .then((r) => {
          if (r.status === 201) {
            var dat = r.data[this.model]
            var tmp = {}
            tmp['id'] = dat.id
            tmp['ctid'] = dat.ctid
            tmp['soct'] = dat.soct
            tmp['ngay'] = moment(dat.ngay).format('YYYY-MM-DD')
            tmp['ngay2'] = moment(dat.ngay).format('DD-MM-YYYY')
            tmp['diengiai'] = dat.diengiai
            tmp['tkno'] = dat.tkno
            tmp['tkco'] = dat.tkco
            tmp['sotien'] = this.number_format(dat.sotien, 0, ',', '.')
            tmp[
              'btnedit'
            ] = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
            this.todos.push(tmp)
            // console.log(111, tmp)

            this.updaterec = !(this.todo.id === '') // Nếu Đang AddNew thì Nhập tiếp
            this.restore() // Nếu đang sửa thì phục hồi lại list
            this.setAddnew()
            this.$toastr.success('', 'CREATE chứng từ thành công.')
          } else {
            this.$toastr.error('', 'CREATE chứng từ KHÔNG thành công.')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    updateSotien(sotien) {
      var query =
        'UPDATE ctuktoan SET sotien = ' +
        sotien +
        ' WHERE id=' +
        this.todo['id']
      this.$apiAcn.post('/query', { query: query })
    },
    updateTodo() {
      if (this.ischitiet == 1) {
        return this.updateChitiet()
      }
      if (this.ischitiet == 2) {
        return this.updateCtuvattu()
      }
      if (this.ischitiet == 3) {
        return this.updateHoadon()
      }

      if (!this.testValidator('', true)) {
        return
      }
      var newdata = this.todo
      apiService
        .patch(`${this.model}/${newdata.id}`, {
          id: newdata.id,
          soct: newdata.soct,
          ngay: newdata.ngay,
          // moment(newdata.ngay).format('YYYY-MM-DD'),
          diengiai: newdata.diengiai,
          tkno: newdata.tkno,
          tkco: newdata.tkco,
          sotien: newdata.sotien.split('.').join('').split(',').join('.'),
          // ngoaite: newdata.ngoaite,
        })
        .then((r) => {
          if (r.status === 200) {
            //console.log(r)
            this.updaterec = false // Đóng screen update
            this.todo['ngay2'] = moment(this.todo['ngay']).format('DD-MM-YYYY')
            this.updatelist()
            this.reset() // sau this.updatelist();
            this.$toastr.success('', 'UPDATE chứng từ thành công.')
            // var dat = todo
            // this.todoB = {      // Nếu phục hồi sẽ có thông tin mới lưu
            // id_: dat.id,
            // soct_: dat.soct,
            // ngay_: dat.ngay,
            // diengiai_: dat.diengiai,
            // tkno_: dat.tkno,
            // tkco_: dat.tkco,
            // sotien_: dat.sotien,
            //}
          } else this.$toastr.warning('', 'CẬP NHẬT chứng từ KHÔNG thành công.')
        })
        .catch((err) => {
          this.$toastr.warning('', 'CẬP NHẬT chứng từ KHÔNG thành công.')
          console.log(err)
        })
    },
    exportExcel() {
      if (this.ischitiet == 2) {
        this.infoketoan['filename'] = 'SoNhatKyHangHoa.xlsx'
        this.infoketoan['patern'] = this.paternmahang
        this.$store.commit('set', ['isLoading', true])
        this.$apiAcn
          .download('/sonhatkyhh', this.infoketoan)
          .then(() => {
            this.$store.commit('set', ['isLoading', false])
          })
          .catch((error) => {
            this.$toastr.error(
              '',
              'ERROR Download file : ' + this.infoketoan['filename'],
            )
            console.log(error)
            this.$store.commit('set', ['isLoading', false])
          })
      } else {
        this.infoketoan['filename'] = 'SoNhatKy.xlsx'
        if (this.patern == 'TK' && this.sotkhoan == '')
          return this.$toastr.warning(
            '',
            'Chọn lọc TK phải nhập Số tài khoản hoặc nhóm.',
          )
        this.infoketoan['patern'] =
          this.patern == 'TK' ? this.sotkhoan : this.patern
        this.$store.commit('set', ['isLoading', true])
        this.$apiAcn
          .download('/sonhatky', this.infoketoan)
          .then(() => {
            this.$store.commit('set', ['isLoading', false])
          })
          .catch((error) => {
            this.$toastr.error(
              '',
              'ERROR Download file : ' + this.infoketoan['filename'],
            )
            console.log(error)
            this.$store.commit('set', ['isLoading', false])
          })
      }
    },

    readCdketoan() {
      //console.log(this);
      // this.listLoading = true
      this.$apiAcn
        .get('cdketoan')
        .then(() => {
          //this.[models] = data.data[models];
          //console.log(data.data['cdketoan'])
        })
        .catch((err) => {
          console.log(err)
          //this.listLoading = false ;
        })
    },
    async getDanhmuc(danhmuc) {
      switch (danhmuc) {
        case 'GET_DM_TAIKHOAN':
          await this.GET_DM_TAIKHOAN()
          break
        case 'GET_DM_CUSTOMER':
          await this.GET_DM_CUSTOMER()
          break
        case 'GET_DM_TENHANG':
          await this.GET_DM_TENHANG()
          break
        case 'GET_DM_KHOHANG':
          await this.GET_DM_KHOHANG()
          break
        default:
        // default statements
      }
    },
    ...mapActions('myDocument', [
      'GET_DM_TAIKHOAN',
      'GET_DM_CUSTOMER',
      'GET_DM_TENHANG',
      'GET_DM_KHOHANG',
    ]),
    downdInvoiceNumber() {
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .download('invoice', {
          host: process.env.VUE_APP_VIETTEL_HOST,
          username: process.env.VUE_APP_VIETTEL_USERNAME,
          password: process.env.VUE_APP_VIETTEL_PASSWORD,
          patern: process.env.VUE_APP_VIETTEL_PATERN,
          Uuid: '',
          fromDate: moment(
            this.infoketoan.fromtodate.pd_fromdate,
            'YYYY-MM-DD',
          ).format('DD/MM/YYYY'),
          toDate: moment(
            this.infoketoan.fromtodate.pd_todate,
            'YYYY-MM-DD',
          ).format('DD/MM/YYYY'),
          ctid: this.todo.ctid,
          supplierTaxCode: process.env.VUE_APP_VIETTEL_USERNAME,
          procedure1: 'createInvoiceDraft',
          procedure3: 'createInvoiceDraftP',
          procedure2: 'getListInvoice',
          procedure4: 'transactionUuid',
          procedure: 'getListInvoice',
          filename: 'Invoice-' + process.env.VUE_APP_VIETTEL_USERNAME + '.pdf', // Phải
          responseType: 'json', // Liên quan api.service.js
          getListOncly: false, // ChiÒ lay danh sach hoa don
        })
        .then((data) => {
          //console.log(data.data)
          this.getHoadon()
          this.$store.commit('set', ['isLoading', false])
          this.$toastr.warning(
            '',
            data.data.message || 'Download thành công...',
            { timeOut: 5000 },
          )
        })
        .catch((err) => {
          console.log(err)
          this.$store.commit('set', ['isLoading', false])
        })
    },
    uploadPreviewInvoice(upload) {
      this.$store.commit('set', ['isLoading', true])
      this.$apiAcn
        .download('invoice', {
          host: process.env.VUE_APP_VIETTEL_HOST,
          username: process.env.VUE_APP_VIETTEL_USERNAME,
          password: process.env.VUE_APP_VIETTEL_PASSWORD,
          patern: process.env.VUE_APP_VIETTEL_PATERN,
          Uuid: '',
          fromDate: moment(
            this.infoketoan.fromtodate.pd_fromdate,
            'YYYY-MM-DD',
          ).format('DD/MM/YYYY'),
          toDate: moment(
            this.infoketoan.fromtodate.pd_todate,
            'YYYY-MM-DD',
          ).format('DD/MM/YYYY'),
          ctid: this.todo.ctid,
          supplierTaxCode: process.env.VUE_APP_VIETTEL_USERNAME,
          procedure1: 'createInvoiceDraft',
          procedure3: 'createInvoiceDraftP',
          procedure2: 'getListInvoice',
          procedure4: 'transactionUuid',
          procedure: upload ? 'createInvoiceDraft' : 'createInvoiceDraftP',
          filename: 'Invoice-' + process.env.VUE_APP_VIETTEL_USERNAME + '.pdf', // Phải
          responseType: upload ? 'json' : 'blob', // Liên quan api.service.js
        })
        .then((data) => {
          //console.log(data.data)
          this.getHoadon() // update số hóa đơn
          this.$store.commit('set', ['isLoading', false])
          this.$toastr.warning(
            '',
            data.data.message || 'Đã thực hiện Download...',
            { timeOut: 5000 },
          )
        })
        .catch((err) => {
          console.log(err)
          this.$store.commit('set', ['isLoading', false])
        })
    },
  },
  created() {
    this.infoketoan = this.$jwtAcn.getKetoan()
    this.datetitle =
      (window.navigator.language || window.navigator.userLanguage) == 'vi'
        ? 'DD/MM/YYYY'
        : 'MM/DD/YYYY'
    //var userLang = window.navigator.language || window.navigator.userLanguage;
    //console.log(window.navigator, userLang);
  },

  mounted() {
    this.getDanhmuc('GET_DM_TAIKHOAN')
    this.getDanhmuc('GET_DM_CUSTOMER')
    this.getDanhmuc('GET_DM_TENHANG')
    this.getDanhmuc('GET_DM_KHOHANG')

    // this.readDanhmuc('dmtkhoans') // Sẽ thay thế ở trên
    // this.readDanhmuc('dmtientes')
    // this.readDanhmuc('customers_')
    // this.readDanhmuc('tenhangs')
    // this.readDanhmuc('dmtenkhos')

    this.readTodos() // sau khi có pd_fromdate
    //console.log(111, this.danhmucTenhang)

    // this.$apiAcn.query('/query' ,{
    //      "query": 'select * from ctuktoan' })
    //     .then(data => {
    //         console.log(data.data.query)
    //     })
  },
  watch: {
    updaterec() {
      // alert(this.updaterec);
      this.$refs.createNew.innerHTML = this.updaterec
        ? '>> Close'
        : '++ Create New'
      if (!this.updaterec) {
        this.src_chitiet = []
        this.src_ctuvattu = []
        this.src_hoadon = []
        this.todoB = []
        this.reset()
        this.ischitiet = 0
      }
    },
  },
  computed: {
    ...mapState(['settings']),
    ...mapState('myDocument', [
      'danhmucTaikhoan',
      'danhmucCustomer',
      'danhmucTenhang',
      'danhmucKhohang',
    ]),
    // Khi biến trong 1 hàm (computed) thay đổi thì Nó sẽ tự chạy , vd: this.settings.FirstMonth, this.ischitiet
    maxDateforInput() {
      if (this.settings.FirstMonth) {
        return moment(this.infoketoan.fromtodate.pd_fromdate)
          .add(1, 'M')
          .subtract(1, 'day')
          .format('YYYY-MM-DD')
      } else
        return moment(this.infoketoan.fromtodate.pd_todate).format('YYYY-MM-DD')
    },
    checkUpdate() {
      switch (this.ischitiet) {
        case 0:
          return !!this.todo.ctid
        case 1:
          return !!this.chitiet.ctid
        case 2:
          return !!this.ctuvattu.ctid
        case 3:
          return !!this.hoadon.ctid
        default:
          return !!this.todo.ctid
      }
      // switch(this.ischitiet) {
      // case 0: var ret = !!this.todo.ctid;
      // case 1: var ret = !!this.chitiet.ctid;
      // case 2: var ret = !!this.ctuvattu.ctid;
      // case 3: var ret = !!this.hoadon.ctid;
      // default : var ret = !!this.todo.ctid;
      // }
      // console.log(1,this.ischitiet , ret)
      // return ret;
    },
    validation: function () {
      return {
        soct: !!this.todo.soct.trim(),
        // ngay: this.isValidDate(this.testngay,'dd-mm-yyyy',this.ngaymin,this.ngaymax) ,
        diengiai: !!this.todo.diengiai.trim(),
        tkno: !!this.todo.tkno.trim(),
        tkco: !!this.todo.tkco.trim(),
        //ngoaite: !!this.todo.ngoaite.trim(),
      }
    },

    isValid: function () {
      var validation = []
      if (this.ischitiet == 0) validation = this.validation
      if (this.ischitiet == 1) validation = this.validation_ct
      if (this.ischitiet == 2) validation = this.validation_vt
      if (this.ischitiet == 3) validation = this.validation_hd
      return Object.keys(validation).every(function (key) {
        return validation[key]
      })
    },
    validation_ct: function () {
      //    this.chitiet.sotien = this.format_so(this.chitiet.sotien,0) ;
      //    this.chitiet.ngoaite = this.format_so(this.chitiet.ngoaite,2) ;
      return {
        diengiai: !!this.chitiet.diengiai.trim(),
        tkno: !!this.chitiet.tkno.trim(),
        tkco: !!this.chitiet.tkco.trim(),
      }
    },
    validation_vt: function () {
      // this.ctuvattu.sotien = this.format_so(this.ctuvattu.sotien,0) ;
      // this.ctuvattu.dongia = this.format_so(this.ctuvattu.dongia,2) ;
      // this.ctuvattu.ngoaite = this.format_so(this.ctuvattu.ngoaite,2) ;
      // this.ctuvattu.soluong = this.format_so(this.ctuvattu.soluong,2) ;
      return {
        mahang: !!this.ctuvattu.mahang.trim(),
        makho: !!this.ctuvattu.makho.trim(),
        //soluong:!!this.ctuvattu.soluong.trim(),
        //sotien: !!this.ctuvattu.sotien.trim(),
        //ngoaite:!!this.ctuvattu.ngoaite.trim(),
      }
    },
    validation_hd: function () {
      // this.hoadon.giaban = this.format_so(this.hoadon.giaban,0) ;
      // this.hoadon.thuegtgt = this.format_so(this.hoadon.thuegtgt,0) ;
      return {
        sohd: !!this.hoadon.sohd.trim(),
        // ngay: this.isDate(this.testngayhd,'dd-mm-yyyy'),
        thuesuat: !!this.hoadon.thuesuat.trim(),
        //thuegtgt: !!this.hoadon.thuegtgt.trim(),
        //giaban:   !!this.hoadon.giaban.trim(),
        diengiai: !!this.hoadon.diengiai.trim(),
      }
    },
  },

  // invoiceId: 1245651,
  // templateCode: '1/001',
  // invoiceSeri: 'C22TVN',
  // invoiceNumber: '0000023',
  // invoiceNo: 'C22TVN23',
  // currency: 'VND',
  // issueDate: 1649005200000,
  // createTime: 1649071636000,
  // supplierTaxCode: '0304529821',
  // buyerTaxCode: '0311059503',
  // totalBeforeTax: 2000000,
  // taxAmount: 0,
  // taxRate: null,
  // total: 2000000,
  // transactionUuid: null
}
</script>

<style scoped>
#congthue,
.congtien {
  color: cornflowerblue;
  text-align: right;
}
#pd_fromdate,
#pd_todate {
  /* background-color: #f7f7f7; */
}

select {
  width: 250px;
  height: 35px;
  margin-left: -2px;
  padding-left: 8px;
  border-color: darkseagreen;
  color: #768192;
  outline-color: darkseagreen;
}
label {
  font: normal 14px !important;
  align-items: center;
  padding: 0.375rem 0.75rem;
  margin-bottom: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  border: 1px solid;
  border-radius: 0.25rem;
  color: #768192;
  background-color: #ebedef;
  border-color: #d8dbe0;
}
.topics td {
  /* text-align: center; */
  vertical-align: middle;
}
.list-horizontal li {
  display: inline-block;
}

.list-horizontal li:before {
  content: '\00a0\2022\00a0\00a0';
  color: #999;
  color: rgba(0, 0, 0, 0.5);
  font-size: 11px;
}

.list-horizontal li:first-child:before {
  content: '';
}
</style>
<style>
table.vgt-table {
  /* font-size: 16px; */
  /* background-color: var(--ms-bg);
  linear-gradient(#2C394F, #2C394F); */
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
