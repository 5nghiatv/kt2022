const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const { ensureAuthenticated, forwardAuthenticated } = require('../configs/auth')

router.use(ensureAuthenticated, function (req, res, next) {
  next()
})

router.get('/customers', function (req, res) {
  Customer.find((err, docs) => {
    // console.log(docs);
    if (!err) {
      // res.json(docs) ;
      res.render('pages/listcust', {
        customers: docs, // Mảng cả table
      })
    } else {
      console.log('Error in retrieving customers list :' + err)
    }
  })
})

router.get('/customer/:id', (req, res) => {
  var id = req.path.replace('/customer/', '')
  //console.log(path);
  if (id == '0') {
    // Insert new
    res.render('pages/addcust', {
      customer: new Customer(),
      btndisabled: 'disabled',
    })
  } else {
    // update old
    Customer.findById(id)
      .then((cust) =>
        res.render('pages/addcust', {
          customer: cust,
          btndisabled: '',
        }),
      )
      .catch((err) =>
        res.status(500).json({
          success: false,
        }),
      )
  }
})

router.post('/customer/:id', (req, res) => {
  // Addnew customer
  if ('addnew' in req.body) {
    // Insert new - 'addnew': is name  of  button submit
    if ('_id' in req.body) {
      delete req.body._id
    }
    var str = req.body.accounts
    acc = str.replace('[, ]', '').replace('[', '').replace(']', '')
    req.body.accounts = Array.from(acc.split(','), Number)

    const customer = new Customer(req.body)
    // OK res.json(customer);
    customer.save(function (err) {
      if (err) {
        console.log('Server error. Please try again.')
      } else {
        console.log('Server save successfully.')
        res.render('pages/addcust', {
          customer: new Customer(),
          btndisabled: '',
        })
      }
    })
  } else {
    // update old
    //console.log('update id: '+ req.body._id ); // Phải submit mới có Body
    var str = req.body.accounts
    acc = str.replace('[, ]', '').replace('[', '').replace(']', '')
    req.body.accounts = Array.from(acc.split(','), Number)

    Customer.update({ _id: req.body._id }, { $set: req.body })
      .exec()
      .then(() => res.redirect('/customers')) // redirect phải có /exp/
      .catch((err) => res.status(500).json({ success: false }))
  }
})

router.delete('/customer/:id', (req, res) => {
  // delete customer
  var id = req.path.replace('/customer/', '')
  Customer.findByIdAndRemove(id)
    .exec()
    .then(() => res.redirect('/customers')) // redirect phải có /exp/
    .catch((err) =>
      res.status(500).json({
        success: false,
      }),
    )
})

module.exports = router
