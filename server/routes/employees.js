const express = require('express')
const router = express.Router()
const Employee = require('../models/employee')
const { ensureAuthenticated, forwardAuthenticated } = require('../configs/auth')

router.use(ensureAuthenticated, function (req, res, next) {
  next()
})

router.get('/employees', function (req, res) {
  Employee.find((err, docs) => {
    if (!err) {
      // res.json(docs) ;
      res.render('pages/listempl', {
        employees: docs, // Mảng cả table
      })
    } else {
      console.log('Error in retrieving Employees list :' + err)
    }
  })
})

router.get('/employee/:id', (req, res) => {
  var id = req.path.replace('/employee/', '')
  //console.log(path);
  if (id == '0') {
    // Insert new
    res.render('pages/addempl', {
      employee: new Employee(),
      btndisabled: 'disabled',
    })
  } else {
    // update old
    Employee.findById(id)
      .then((empl) =>
        res.render('pages/addempl', {
          employee: empl,
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

router.post('/employee/:id', (req, res) => {
  // Addnew Employee
  if ('addnew' in req.body) {
    // Insert new - 'addnew': is name  of  button submit
    if ('_id' in req.body) {
      delete req.body._id
    }
    const employee = new Employee(req.body)
    // OK res.json(employee);
    employee.save(function (err) {
      if (err) {
        console.log('Server error. Please try again.')
      } else {
        console.log('Server save successfully.')
        res.render('pages/addempl', {
          employee: new Employee(),
          btndisabled: '',
        })
      }
    })
  } else {
    // update old
    //console.log('update id: '+ req.body._id ); // Phải submit mới có Body
    console.log(req.body)
    Employee.update({ _id: req.body._id }, { $set: req.body })
      .exec()
      .then(() => res.redirect('/employees')) // redirect phải có /exp/
      .catch((err) =>
        res.status(500).json({
          success: false,
        }),
      )
  }
})

router.delete('/employee/:id', (req, res) => {
  // delete Employee
  var id = req.path.replace('/employee/', '')
  Employee.findByIdAndRemove(id)
    .exec()
    .then(() => res.redirect('/employees')) // redirect phải có /exp/
    .catch((err) =>
      res.status(500).json({
        success: false,
      }),
    )
})

module.exports = router
