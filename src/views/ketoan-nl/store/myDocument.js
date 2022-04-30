import ApiService from '@/common/api.service'
import JwtService from '@/common/jwt.service'
const { numberFormat } = require('../utility')
import moment from 'moment'
import { ref } from 'vue'

// import { createStore } from 'vuex'
// export default createStore({
export const myDocument = {
  namespaced: true,
  state: {
    docListModal: ref(null),
    documentModal: ref(null),
    docChitietModal: ref(null),
    docVattuModal: ref(null),
    docHoadonModal: ref(null),
    currentInvoiceArray: ref(null),
    modalTextNew: ref(null),
    modalActive: ref(null),
    modalActiveNew: ref(null),
    editInvoice: ref(null),
    editAddInvoice: ref(null),
    documentData: ref(null),
    documentDataChitiet: ref(null),
    documentDataVattu: ref(null),
    documentDataHoadon: ref(null),
    documentsLoaded: ref(null),
    currentDocumentArray: ref([]), // không được null mới dùng Vue.set được
    currentKTchitiet: ref(0),
    danhmucTaikhoan: ref(null),
    danhmucCustomer: ref(null),
    danhmucTenhang: ref(null),
    danhmucKhohang: ref(null),
    showDocumentView: ref(null),
    danhmucUsers: ref(null),
  },
  mutations: {
    SET_DM_USERS(state, payload) {
      state.danhmucUsers = payload
    },
    SET_DM_TAIKHOAN(state, payload) {
      // state.danhmucTaikhoan = payload; // Không watch || computer được
      state.danhmucTaikhoan = payload
    },
    SET_DM_CUSTOMER(state, payload) {
      state.danhmucCustomer = payload
    },
    SET_DM_TENHANG(state, payload) {
      state.danhmucTenhang = payload
    },
    SET_DM_KHOHANG(state, payload) {
      state.danhmucKhohang = payload
    },
    SET_CURRENT_KTCHITIET(state, payload) {
      state.currentKTchitiet = payload
    },
    SET_DOCUMENT_DATA_CHITIET(state, payload) {
      state.documentDataChitiet = payload
    },
    SET_DOCUMENT_DATA_VATTU(state, payload) {
      state.documentDataVattu = payload
    },
    SET_DOCUMENT_DATA_HOADON(state, payload) {
      state.documentDataHoadon = payload
    },
    SET_DOCUMENT_DATA(state, payload) {
      //console.log(111, 'data old-new:', state.documentData, payload)
      state.documentData = payload
    },
    DOCUMENTS_LOADED(state) {
      state.documentsLoaded = true
    },
    async SET_CURRENT_DOCUMENT(state, payload) {
      var doc = await state.documentData.filter((document) => {
        // 3 dấu === sẽ không tìm thấy
        return document.ctid == payload
      })
      if (doc.length > 0) state.currentDocumentArray[0] = doc[0]
    },
    TOGGLE_DOCUMENT_VIEW(state) {
      state.showDocumentView = !state.showDocumentView
    },
    TOGGLE_EDIT_ADD_DOCUMENT(state) {
      state.editAddInvoice = !state.editAddInvoice
    },
    TOGGLE_EDIT_DOCUMENT(state) {
      state.editInvoice = !state.editInvoice
      //console.log("state.editInvoice",state.editInvoice);
    },
    TOGGLE_DOCUMENT(state, payload) {
      switch (payload) {
        case 1:
          state.docChitietModal = !state.docChitietModal
          break
        case 2:
          state.docVattuModal = !state.docVattuModal
          break
        case 3:
          state.docHoadonModal = !state.docHoadonModal
          break
        case 4:
          state.docListModal = !state.docListModal
          break
        default:
          state.documentModal = !state.documentModal
      }
    },
    DELETE_DOCUMENT(state, payload) {
      state.documentData = state.documentData.filter(
        (document) => document.ctid !== payload,
      )
    },
    TOGGLE_MODAL_NEW(state, modalTextNew) {
      if (modalTextNew) state.modalTextNew = modalTextNew
      state.modalActiveNew = !state.modalActiveNew
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive
    },
  },
  actions: {
    async DM_ACCOUNT_LOADED({ dispatch, state }) {
      if (state.danhmucTaikhoan) return // chỉ load lần đầu - khi cầnn load từng danh mục
      await dispatch('GET_DM_TAIKHOAN')
      await dispatch('GET_DM_CUSTOMER')
      await dispatch('GET_DM_TENHANG')
      await dispatch('GET_DM_KHOHANG')
    },
    async GET_DM_USERS({ commit }) {
      await ApiService.get('/users', {})
        .then((data) => {
          commit('SET_DM_USERS', data.data.users)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async GET_DM_TAIKHOAN({ commit }) {
      await ApiService.get('/dmtkhoans', {})
        .then((data) => {
          commit('SET_DM_TAIKHOAN', data.data.dmtkhoans)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async GET_DM_CUSTOMER({ commit }) {
      await ApiService.get('/customers_', {})
        .then((data) => {
          commit('SET_DM_CUSTOMER', data.data.customers_)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async GET_DM_TENHANG({ commit }) {
      await ApiService.get('/tenhangs', {})
        .then((data) => {
          commit('SET_DM_TENHANG', data.data.tenhangs)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async GET_DM_KHOHANG({ commit }) {
      await ApiService.get('/dmtenkhos', {})
        .then((data) => {
          commit('SET_DM_KHOHANG', data.data.dmtenkhos)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async GET_DOCUMENTS({ commit, state }, lforce = false) {
      if (state.documentData && !lforce) return // Có rồi mà không ép load thì thôi
      //axios.post(process.env.APP_URL +'/api/ketquakd', req.query )
      const infoketoan = JwtService.getKetoan()
      const model = 'chungtus'
      await ApiService.post(model, {
        // this.$apiAcn.post('/'+ this.models ,{
        pd_fromdate: infoketoan.fromtodate.pd_fromdate,
        pd_todate: infoketoan.fromtodate.pd_todate,
      })
        .then((data) => {
          // console.log(data.data);
          let todos = data.data[model]
          todos.forEach((item) => {
            item.ngay_ = moment(item.ngay).format('YYYYMMDD')
            item.sotien_ = item.sotien
            item.ngay = moment(item.ngay).format('DD-MM-YYYY')
            item.sotien = numberFormat(item.sotien, 0, ',', '.')
            // Vue.set(item, 'ngay_', moment(item.ngay).format('YYYYMMDD')) // For Oder in HomeDocument
            // Vue.set(item, 'sotien_', item.sotien)
            // Vue.set(item, 'ngay', moment(item.ngay).format('DD-MM-YYYY'))
            //    this.$store.commit('set', ['isLoading', false])
          })
          return todos
        })
        .then((dat) => {
          //console.log(dat);
          commit('SET_DOCUMENT_DATA', dat)
          commit('DOCUMENTS_LOADED')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async UPDATE_DOCUMENT({ dispatch, commit }, { chungtu, routeId }) {
      let query =
        'UPDATE ctuktoan SET soct = "' +
        chungtu.soct +
        '", ngay = "' +
        chungtu.ngay +
        '", diengiai = "' +
        chungtu.diengiai +
        '", tkno = "' +
        chungtu.tkno +
        '", tkco = "' +
        chungtu.tkco +
        '", sotien = ' +
        chungtu.sotien +
        ' WHERE id=' +
        chungtu.id

      let ret = await dispatch('runMysql', query, query)
      if (ret) {
        await dispatch('GET_DOCUMENTS', true)
        await commit('SET_CURRENT_DOCUMENT', routeId)
      }
      return ret
    },

    async CREATE_DOCUMENT({ dispatch, commit }, { chungtu }) {
      // Trong ngoặc Vàng
      let ret = false
      let query = 'SELECT GetNextCtid() as NextCtid'
      await ApiService.post('/query', { query: query })
        .then((dat) => {
          if (dat.data.query.length > 0) {
            chungtu.ctid = dat.data.query[0].NextCtid // Phải có
            ret = true
          }
          // console.log(query,dat, chungtu );
        })
        .catch((err) => {
          console.log(err, query)
        })
      if (ret) {
        query =
          'INSERT INTO ctuktoan (soct, ngay, diengiai, tkno, tkco, sotien,ngaytt,ngaytra,loaitien,ngoaite,userid,matkno,matkco,hopdong,nhom,ghichu,khac,sodk,mamauhd,ctid)  VALUES ("' +
          chungtu.soct +
          '","' +
          chungtu.ngay +
          '","' +
          chungtu.diengiai +
          '","' +
          chungtu.tkno +
          '","' +
          chungtu.tkco +
          '", ' +
          chungtu.sotien +
          ',"0001-01-01","0001-01-01","001",0,0,"","","","","","","","","' +
          chungtu.ctid +
          '")'
        ret = await dispatch('runMysql', query)
        if (ret) {
          await dispatch('GET_DOCUMENTS', true)
          await commit('SET_CURRENT_DOCUMENT', chungtu.ctid)
        }
      }
      return ret
    },
    async COPY_DOCUMENT({ dispatch }, { ctid, ngay }) {
      // có 2 para phải dùng: {ctid: ??? , ngay: ???} khi gửi
      ngay = moment(ngay, 'DD-MM-YYYY').format('YYYY-MM-DD') // Trả ngày GỐC
      var query = "CALL CopyChungtuID('" + ctid + "','" + ngay + "')"
      let ret = await dispatch('runMysql', query)
      if (ret) {
        await dispatch('GET_DOCUMENTS', true) // Load lại Data
        console.log('Thành công COPY ctid : ' + ctid)
      }
      return ret
    },
    async DELETE_DOCUMENT({ dispatch, commit }, ctid) {
      // Xóa in database
      var query = "CALL DelChungtuID('" + ctid + "')"
      let ret = await dispatch('runMysql', query)
      if (ret) {
        commit('DELETE_DOCUMENT', ctid)
        console.log('Thành công DELETE ctid : ' + ctid)
      }
      return ret
    },

    async GET_DOCUMENTS_CHITIET({ commit, state }) {
      await ApiService.get(
        '/chitiets/' + state.currentDocumentArray[0].ctid,
        {},
      )
        .then((data) => {
          let chitiets = data.data.chitiets
          chitiets.forEach((item) => {
            item.sotien = numberFormat(item.sotien, 0, ',', '.')
            // this.$set(item, "ngoaite",this.number_format(item['ngoaite'],2,',','.'));
          })
          return chitiets
        })
        .then((dat) => {
          //console.log(111,dat);
          commit('SET_DOCUMENT_DATA_CHITIET', dat)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async UPDATE_CHITIET(
      { dispatch, commit },
      { chitietItem, ctid, updateSotien },
    ) {
      var query = "DELETE FROM chitiet WHERE ctid = '" + ctid + "';"
      // =====================  Nhớ có dấu ; ở cuối
      /* eslint-disable */
      await chitietItem.forEach((reqbody) => {
        reqbody.sotien = reqbody.sotien.split('.').join('').split(',').join('.')
        query =
          query +
          'INSERT INTO chitiet (`id`, `ctid`, `diengiai`, `tkno`, `tkco`, `sotien`,`matkno`,`matkco`,`ngoaite`,`ctkhac`) ' +
          'VALUES (null,"' +
          reqbody.ctid +
          '","' +
          reqbody.diengiai +
          '","' +
          reqbody.tkno +
          '","' +
          reqbody.tkco +
          '","' +
          reqbody.sotien +
          '","","",0,"" );'
      })
      query =
        query +
        'UPDATE ctuktoan SET sotien = "' +
        updateSotien +
        '" WHERE ctid = "' +
        ctid +
        '" ;'
      var ret = await dispatch('runMysql', query)
      if (ret) {
        await dispatch('GET_DOCUMENTS', true)
        await commit('SET_CURRENT_DOCUMENT', ctid)
        await dispatch('GET_DOCUMENTS_CHITIET')
      }
      return ret
    },

    async GET_DOCUMENTS_VATTU({ commit, state }) {
      await ApiService.get(
        '/ctuvattus/' + state.currentDocumentArray[0].ctid,
        {},
      )
        .then((data) => {
          let chitiets = data.data.ctuvattus
          if (chitiets.length === 0) return null
          chitiets.forEach((item) => {
            var tenhang = state.danhmucTenhang.filter(
              (document) => document.mahang == item.mahang,
            )
            item.tenhang = tenhang[0].tenhang
            item.donvi = tenhang[0].donvi
            item.sotien = numberFormat(item.sotien, 0, ',', '.')
            item.soluong = numberFormat(item.soluong, 2, ',', '.')
            // this.$set(item, "ngoaite",this.number_format(item['ngoaite'],2,',','.'));
          })
          return chitiets
        })
        .then((dat) => {
          //console.log(111,dat);
          commit('SET_DOCUMENT_DATA_VATTU', dat)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async UPDATE_VATTU({ dispatch }, { chitietItem, ctid }) {
      var query = "DELETE FROM ctuvattu WHERE ctid = '" + ctid + "';"
      // =====================  Nhớ có dấu ; ở cuối
      await chitietItem.forEach((reqbody) => {
        reqbody.sotien = reqbody.sotien.split('.').join('').split(',').join('.')
        reqbody.soluong = reqbody.soluong
          .split('.')
          .join('')
          .split(',')
          .join('.')
        query =
          query +
          'INSERT INTO ctuvattu (`id`, `ctid`, `mahang`, `makho`, `soluong`, `sotien`, `dongia`,`vtkhac`,`ngoaite`,`doituong`,`giaban`,`thue`,`soluong2`,`doituong2`) ' +
          'VALUES (null,"' +
          reqbody.ctid +
          '","' +
          reqbody.mahang +
          '","' +
          reqbody.makho +
          '","' +
          reqbody.soluong +
          '","' +
          reqbody.sotien +
          '",0,"",0,"",0,0,0,"");'
      })
      var ret = await dispatch('runMysql', query)
      await dispatch('GET_DOCUMENTS_VATTU')
      return ret
    },

    async GET_DOCUMENTS_HOADON({ commit, state }) {
      await ApiService.get('/hoadons/' + state.currentDocumentArray[0].ctid, {})
        .then((data) => {
          let chitiets = data.data.hoadons
          if (chitiets.length === 0) return null
          chitiets.forEach((item) => {
            // this.$set(item, "sotien",this.number_format(item['sotien'],0,',','.'));
            // this.$set(item, "ngoaite",this.number_format(item['ngoaite'],2,',','.'));
            item.ngay = moment(item.ngay).format('DD-MM-YYYY')
            item.giaban = numberFormat(item.giaban, 0, ',', '.')
            item.thuegtgt = numberFormat(item.thuegtgt, 0, ',', '.')
          })
          return chitiets
        })
        .then((dat) => {
          //console.log('Hoadon:',dat);
          commit('SET_DOCUMENT_DATA_HOADON', dat)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    async UPDATE_HOADON({ dispatch }, { chitietItem, ctid }) {
      var query = "DELETE FROM hoadon WHERE ctid = '" + ctid + "';"
      // =====================  Nhớ có dấu ; ở cuối
      await chitietItem.forEach((reqbody) => {
        reqbody.giaban = reqbody.giaban + "."
        reqbody.thuegtgt = reqbody.thuegtgt + "."
        reqbody.giaban = reqbody.giaban.split('.').join('').split(',').join('.')
        reqbody.thuegtgt = reqbody.thuegtgt
          .split('.')
          .join('')
          .split(',')
          .join('.')
        query =
          query +
          'INSERT INTO hoadon (`id`,`ctid`,`sohd`,`ngay`,`diengiai`,`masothue`,`thuesuat`,`giaban`,`thuegtgt`,`mausohd`,`mamauhd`,`sohdong`,`ngayhdong`,' +
          '`hinhthuctt`,`diemgiao`,`diemnhan`,`sovandon`,`socontaine`,`dvanchuyen`,`dienthoai`,`tygia` ) ' +
          'VALUES (null,"' +
          reqbody.ctid +
          '","' +
          reqbody.sohd +
          '","' +
          reqbody.ngay +
          '","' +
          reqbody.diengiai +
          '","' +
          reqbody.masothue +
          '","' +
          reqbody.thuesuat +
          '",' +
          reqbody.giaban +
          ',' +
          reqbody.thuegtgt +
          ',"","","","0001-01-01","","","","","","","",0 );'
      })
      var ret = await dispatch('runMysql', query)
      await dispatch('GET_DOCUMENTS_HOADON')
      return ret
    },
    async ADD_ACCOUNT_LIST({ dispatch }, { danhmuc, currentOpt }) {
      var query = '',
        getlistAcc = ''
      switch (currentOpt) {
        case 1:
          query =
            'INSERT INTO customer (`id`, `fullname`, `name`, `company`, `address`, `email`, `phone1`, `phone2`, `fax1`, `ghichu`, `group_id`, `maso`, `account`, `bank`, `citibank`, `makhach`) ' +
            'VALUES (null,"","","' +
            danhmuc.company +
            '","' +
            danhmuc.address +
            '","","","","","' +
            danhmuc.ghichu +
            '","","' +
            danhmuc.maso +
            '","","","",""' +
            ')'
          getlistAcc = 'GET_DM_CUSTOMER'
          break
        case 2:
          query =
            'INSERT INTO tenhang (`id`,`mahang`,`tenhang`,`donvi`,`sotk`,`userid`,`dongiakh`,`thuedt`,`dutru`,`newdonvi`,`newluong`,`dutrutt`,`dutrutd`,`table_`,`postion`,`code`,`descriptio`) ' +
            'VALUES (null,"' +
            danhmuc.mahang +
            '","' +
            danhmuc.tenhang +
            '","' +
            danhmuc.donvi +
            '","",0,0,0,0,"","",0,0,"","","","")'
          getlistAcc = 'GET_DM_TENHANG'
          break
        case 3:
          query =
            'INSERT INTO dmtenkho (`id`, `makho`, `tengoi`, `diachi`) ' +
            'VALUES (null,"' +
            danhmuc.makho +
            '","' +
            danhmuc.tengoi +
            '","' +
            danhmuc.diachi +
            '")'
          getlistAcc = 'GET_DM_KHOHANG'
          break
        default:
          query =
            'INSERT INTO dmtkhoan (`id`,`sotk`,`tkhoan`,`tentk`,`diachi`,`nodn`,`codn`,`nodk`,`codk`,`psno`,`psco`,`lkpsno`,`lkpsco`,`nock`,`cock`,`ghichu`,`loaitien`,`ngoaite`,`thuedt`,`lcheck`,`hanmuc`) ' +
            'VALUES (null,"' +
            danhmuc.sotk +
            '","","' +
            danhmuc.tentk +
            '","", 0,0,0,0,0,0,0,0,0,0,"","",0,0,0,0' +
            ')'
          getlistAcc = 'GET_DM_TAIKHOAN'
          break
      }
      var ret = await dispatch('runMysql', query)
      await dispatch(getlistAcc)
      return ret
    },

    async UPDATE_ACCOUNT_LIST({ dispatch }, { danhmuc, currentOpt }) {
      // =====================  Nhớ có dấu ; ở cuối
      var query = '',
        getlistAcc = ''
      switch (currentOpt) {
        case 1:
          query =
            'UPDATE customer SET company = "' +
            danhmuc.company +
            '", address = "' +
            danhmuc.address +
            '", ghichu = "' +
            danhmuc.ghichu +
            '" WHERE id=' +
            danhmuc.id
          getlistAcc = 'GET_DM_CUSTOMER'
          break
        case 2:
          query =
            'UPDATE tenhang SET mahang = "' +
            danhmuc.mahang +
            '", tenhang = "' +
            danhmuc.tenhang +
            '", donvi = "' +
            danhmuc.donvi +
            '" WHERE id=' +
            danhmuc.id
          getlistAcc = 'GET_DM_TENHANG'
          break
        case 3:
          query =
            'UPDATE dmtenkho SET makho = "' +
            danhmuc.makho +
            '", tengoi = "' +
            danhmuc.tengoi +
            '", diachi = "' +
            danhmuc.diachi +
            '" WHERE id=' +
            danhmuc.id
          getlistAcc = 'GET_DM_KHOHANG'
          break
        default:
          query =
            'UPDATE dmtkhoan SET sotk = "' +
            danhmuc.sotk +
            '", tentk = "' +
            danhmuc.tentk +
            '" WHERE id=' +
            danhmuc.id
          getlistAcc = 'GET_DM_TAIKHOAN'
          break
      }
      var ret = await dispatch('runMysql', query)
      await dispatch(getlistAcc)
      return ret
    },

    async DELETE_ACCOUNT_LIST({ state, dispatch }, { danhmuc, currentOpt }) {
      var ret = false
      var query = ''
      switch (currentOpt) {
        case 1:
          query = "DELETE FROM customer WHERE id = '" + danhmuc.id + "';"
          ret = await dispatch('runMysql', query)
          var index = await state.danhmucCustomer.findIndex(
            (x) => x.id === danhmuc.id,
          )
          state.danhmucCustomer.splice(index, 1)
          break
        case 2:
          query = "DELETE FROM tenhang WHERE id = '" + danhmuc.id + "';"
          ret = await dispatch('runMysql', query)
          var index = await state.danhmucTenhang.findIndex(
            (x) => x.id === danhmuc.id,
          )
          state.danhmucTenhang.splice(index, 1)
          break
        case 3:
          query = "DELETE FROM dmtenkho WHERE id = '" + danhmuc.id + "';"
          ret = await dispatch('runMysql', query)
          var index = await state.danhmucKhohang.findIndex(
            (x) => x.id === danhmuc.id,
          )
          state.danhmucKhohang.splice(index, 1)
          break
        default:
          query = "DELETE FROM dmtkhoan WHERE id = '" + danhmuc.id + "';"
          ret = await dispatch('runMysql', query)
          var index = await state.danhmucTaikhoan.findIndex(
            (x) => x.id === danhmuc.id,
          )
          state.danhmucTaikhoan.splice(index, 1)
          break
      }
      return ret
    },
    async GANTIENHANG_HOADON(
      { dispatch, commit },
      { ctid, tongtien, tienthue, tkthue },
    ) {
      var query =
        "CALL GanTienHangHoadon('" +
        ctid +
        "'," +
        tongtien +
        ',' +
        tienthue +
        ",'" +
        tkthue +
        "')"
      //console.log(query)
      var ret = await dispatch('runMysql', query)
      await dispatch('GET_DOCUMENTS_HOADON')
      await dispatch('GET_DOCUMENTS_CHITIET')
      await dispatch('GET_DOCUMENTS_VATTU')
      await dispatch('GET_DOCUMENTS', true)
      await commit('SET_CURRENT_DOCUMENT', ctid)
      return ret
    },

    // async runMysql({}, query) {
    async runMysql({}, query) {
      var success = false
      await ApiService.post('/query', { query: query })
        .then((ret) => {
          //console.log(query,ret.data,ret.data.query );
          if (ret.data.query.length > 0) {
            ret.data.query.forEach((item) => {
              if (item.affectedRows > 0) success = true
            })
          } else if (ret.data.query.affectedRows > 0) success = true
          if (success) success = ret.data // Cho thêm thông tin
        })
        .catch((err) => {
          console.log(err, query)
        })
      return success
    },
  },
  modules: {},
}
