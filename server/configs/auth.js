module.exports = {
  ensureAuthenticated: function (req, res, next) {
    // ============== MỞ sẽ tạm thời Tắt Đăng Nhập ==========
    //return next();

    if (req.isAuthenticated()) {
      return next()
    }
    if (req.url.indexOf('/social/') > -1) return next()
    res.redirect('/users/login')
  },

  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next()
    }

    // if(req.url.indexOf("/social/") > -1 ) return next();
    res.redirect('/exp/dashboard')
    //res.redirect('/exp');
  },
}
