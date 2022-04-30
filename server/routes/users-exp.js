const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { User } = require('../models/User')
const Connect = require('../models/connect')
const { ensureAuthenticated, forwardAuthenticated } = require('../configs/auth')

router.use(ensureAuthenticated, function (req, res, next) {
  next()
})

//==============================FOR EXPRESS=====================
router.get('/users', function (req, res) {
  User.find((err, docs) => {
    if (!err) {
      // res.json(docs) ;
      res.render('pages/listuser', {
        users: docs, // Mảng cả table
      })
    } else {
      console.log('Error in retrieving Users list :' + err)
    }
  })
})

router.get('/user/:id', (req, res) => {
  var id = req.path.replace('/user/', '')
  Connect.find((err, conns) => {
    var database = []
    conns.forEach((kq, index) => {
      database.push(kq.database)
    })
    //console.log(path);
    if (id == '0') {
      // Insert new
      res.render('pages/adduser', {
        user: new User(),
        btndisabled: 'disabled',
      })
    } else {
      // update old
      User.findById(id)
        //.then((user)=> {user.password=''; return user; })
        .then((user) => {
          user.databases = database
          return user
        })
        .then((user) =>
          res.render('pages/adduser', {
            user: user,
            btndisabled: '',
          }),
        )
        .catch((err) =>
          res.status(500).json({
            success: false,
          }),
        )
    }
  }) // Connect.find
}) // get

// ============ Update || Addnew =================
router.post('/user/:id', (req, res) => {
  // Addnew User
  req.body.admin = req.body.admin == 'on' ? true : false
  const { name, password, email, isAdmin } = req.body
  //res.json(req.body)

  let errors = []

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' })
  }
  if (!name || !password || !email) {
    errors.push({ msg: 'Please enter fields name, password, email ...' })
  }
  // if ( !isAdmin) {
  //   errors.push({ msg: 'Please enter fields is Admin : true || false' });
  // }

  //req.flash('success_msg','You are now registered and can log in');
  if (errors.length > 0) {
    res.render('pages/adduser', {
      errors,
      user: req.body,
      btndisabled: '',
    })
  }

  if ('addnew' in req.body) {
    // Insert new - 'addnew': is name  of  button submit
    //addnewUser(req, res)
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        errors.push({ msg: 'Email already exists' })
        res.render('pages/adduser', {
          errors,
          user: req.body,
          btndisabled: '',
        })
      } else {
        if ('_id' in req.body) {
          delete req.body._id
        }
        const newUser = new User(req.body)
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log('Server error. Please try again.')
            newUser.password = hash
            newUser
              .save()
              .then((user) => {
                req.flash('success_msg', 'Server save successfully...')
                res.render('pages/adduser', {
                  user: new User(),
                  btndisabled: '',
                })
              })
              .catch((err) => console.log(err))
          })
        })
      }
    })
  } else {
    // update old
    //console.log('update id: '+ req.body._id ); // Phải submit mới có Body
    //console.log(req.body)

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          console.log('Server error. Please try again ...')
          // throw err;
        } else {
          if (req.body.password.length < 30) req.body.password = hash // Giữ nguyên nếu hash RỒI = length > 30
          // ------------------
          User.update({ _id: req.body._id }, { $set: req.body })
            .exec()
            .then((User) => {
              req.flash('success_msg', 'You are update User successfully...')
              res.redirect('/users')
            })
            .catch((err) =>
              res.status(500).json({
                success: false,
              }),
            )
        }
      })
    })
  }
})

// ===============================
router.delete('/user/:id', (req, res) => {
  // delete User
  var id = req.path.replace('/user/', '')
  User.findByIdAndRemove(id)
    .exec()
    .then(() => res.redirect('/users')) // redirect phải có /exp/
    .catch((err) =>
      res.status(500).json({
        success: false,
      }),
    )
})

module.exports = router
