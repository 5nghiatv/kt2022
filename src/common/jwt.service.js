const TOKEN_KEY = 'token'
const REFRESHTOKEN_KEY = 'refreshtoken'
const USER_KEY = 'user'
const SOCIAL_KEY = 'social'
const DATETIME_KEY = 'fromtodate'
const INFOKT_KEY = 'infoketoan'

export const getToken = () => {
  return window.localStorage.getItem(TOKEN_KEY)
}
export const getRefreshToken = () => {
  return window.localStorage.getItem(REFRESHTOKEN_KEY)
}
export const saveRefreshToken = (token) => {
  window.localStorage.setItem(REFRESHTOKEN_KEY, token)
}

export const saveToken = (token) => {
  //console.log('Token :'+ token )
  window.localStorage.setItem(TOKEN_KEY, token)
  // Nếu Object phải ====> window.localStorage.setItem("nguoikyten", JSON.stringify(this.nguoikyten));
  // this.nguoikyten = JSON.parse(window.localStorage.getItem("nguoikyten") );
}

export const destroyToken = () => {
  window.localStorage.removeItem(TOKEN_KEY)
}

export const getUser = (field = null) => {
  const user = JSON.parse(window.localStorage.getItem(USER_KEY))
  if (field == null) {
    return user
  }
  if ((user !== null) & (user !== undefined)) {
    return user[field] // là mảng phải có JSON.parse()
  }
}
export const saveUser = (user) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}
export const destroyUser = () => {
  window.localStorage.removeItem(USER_KEY)
}

// =========================
export const saveDateTime = (fromtodate) => {
  window.localStorage.setItem(DATETIME_KEY, JSON.stringify(fromtodate))
}
export const getDateTime = () => {
  var fromtodate = JSON.parse(window.localStorage.getItem(DATETIME_KEY))
  if (!fromtodate || fromtodate == null || !fromtodate.pd_fromdate) {
    fromtodate = {
      pd_fromdate:
        new Date().toISOString().replace('T', ' ').substr(0, 4) + '-01-01',
      pd_todate:
        new Date().toISOString().replace('T', ' ').substr(0, 4) + '-03-31',
    }
  }
  return fromtodate
}
// =========================
export const saveKetoan = (data) => {
  window.localStorage.setItem(INFOKT_KEY, JSON.stringify(data))
  // console.log(data)
}
export const getKetoan = () => {
  var infoketoan = JSON.parse(window.localStorage.getItem(INFOKT_KEY))
  // test var infoketoan = JSON.parse(window.localStorage.getItem('INFOKT_KEY')) ;
  if (!infoketoan || infoketoan == null || !infoketoan.fromtodate.pd_fromdate) {
    infoketoan = {
      fromtodate: {
        pd_fromdate:
          new Date().toISOString().replace('T', ' ').substr(0, 4) + '-01-01',
        pd_todate:
          new Date().toISOString().replace('T', ' ').substr(0, 4) + '-03-31',
      },
      company: {
        masothue: '0304529821',
        company: 'DNTN Tin học Xuân Mai',
        address: '118/63 Bạch Đằng, P24, Bình Thạnh - HCM',
        dnlon: false,
      },
      locale: 'vn',
    }
  }
  const settings = JSON.parse(localStorage.getItem('setting_acn'))
  if (settings) infoketoan['settings'] = settings // Xem mutations.REP_SETTINGS() in store
  return infoketoan
}
// =========================
export const getSocial = (field = null) => {
  const social = JSON.parse(window.localStorage.getItem(SOCIAL_KEY))
  if (field == null) {
    return social
  }
  if ((social !== null) & (social !== undefined)) {
    return social[field] // là mảng phải có JSON.parse()
  }
}
export const saveSocial = (social) => {
  window.localStorage.setItem(SOCIAL_KEY, JSON.stringify(social))
}
export const destroySocial = () => {
  window.localStorage.removeItem(SOCIAL_KEY)
}

export const isEmpty = (val) => {
  return val === 'undefined' ||
    val === undefined ||
    val == null ||
    val.length <= 0
    ? true
    : false
}

export default {
  saveRefreshToken,
  getRefreshToken,
  saveKetoan,
  getKetoan,
  saveDateTime,
  getDateTime,
  getToken,
  saveToken,
  destroyToken,
  getUser,
  saveUser,
  destroyUser,
  getSocial,
  saveSocial,
  destroySocial,
  isEmpty,
}
