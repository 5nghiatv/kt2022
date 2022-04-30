module.exports = {
  ensureAuth: function (req, res, next) {

    if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/social/login')
    }
  },
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      //res.redirect('/exp/dashboard');
      res.render('stories/dashboard')
    } else {
      return next()
    }
  },
}
