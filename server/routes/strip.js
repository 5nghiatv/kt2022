require('dotenv').config()
const express = require('express')
const app = express()
const router = express.Router()
const stripeSecretKey = process.env.STRIPE_SECRET
const stripePublicKey = process.env.STRIPE_KEY
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)
app.use(express.json())

router.get('/store', function (req, res) {
  fs.readFile('public/stripe-store/items.json', function (error, data) {
    if (error) {
      res.status(500).end()
    } else {
      res.render('stripe-store.ejs', {
        stripePublicKey: stripePublicKey,
        items: JSON.parse(data),
      })
    }
  })
})

router.post('/purchase_old', function (req, res) {
  fs.readFile('public/stripe-store/items.json', function (error, data) {
    if (error) {
      res.status(500).end()
    } else {
      const itemsJson = JSON.parse(data)
      const itemsArray = itemsJson.music.concat(itemsJson.merch)
      let total = 0
      req.body.items.forEach(function (item) {
        const itemJson = itemsArray.find(function (i) {
          return i.id == item.id
        })
        total = total + itemJson.price * item.quantity
      })

      if (total == 0) {
        res.json({ message: 'Not purchased items' })
      }
      total = total * 23000
      stripe.charges
        .create({
          amount: total,
          source: req.body.stripeTokenId,
          currency: 'VND', // Gốc là usd ,VND phải tăng total * 23000 Nếu Không sẽ ERROR exchange_rate": null
          description: 'Tác giả: Trần Văn Nghĩa - ĐT- 0903917963',
        })
        .then(function () {
          console.log('Charge Successful: ' + total)
          res.json({
            message: 'Congratulations...Successfully purchased items',
          })
        })
        .catch(function () {
          console.log(
            'Charge Fail',
            'stripeTokenId: ' + req.body.stripeTokenId,
            'items: ',
            req.body.items,
          )
          res.status(500).end()
        })
    }
  })
})

router.get('/custCreate', async function (req, res) {
  const customer = await stripe.customers.create({
    name: 'Trần Văn Nghĩa',
    phone: '0903917963',
    email: 'nghiatv@gmail.com',
    address: {
      line1: '118/63 Bạch Đằng, P24, Bình Thạnh',
      city: 'TP HCM',
      country: 'Việt Nam',
    },
    description: 'My First Test Customer (created for API docs)',
  })
  return res
    .status(200)
    .json({ message: 'Successfully customer items...', customer: customer })
})

router.get('/custList', async function (req, res) {
  const customers = await stripe.customers.list({ limit: 5 })
  return res
    .status(200)
    .json({ message: 'Successfully customers items...', customers: customers })
})
router.get('/custDel/:id', async function (req, res) {
  var id = req.path.replace('/custDel/', '')
  const deleted = await stripe.customers.del(id)
  return res.json({ message: 'Successfully Delete items...' + id })
})

router.get('/transactions', async function (req, res) {
  const trans = await stripe.balanceTransactions.list({ limit: 10 })
  res.render('stripe-trans.ejs', {
    items: trans.data,
  })

  // stripe.balanceTransactions.list(
  //   {limit: 10},
  //   function(err, transactions) {
  //     if (err) {
  //       res.status(500).end()
  //     } else {
  //       // console.log(transactions.data[0])
  //       res.render('stripe-trans.ejs', {
  //         items: transactions.data
  //       })
  //     }
  //     // asynchronously called
  //   }
  // );
})

router.get('/trandetail/:id', async function (req, res) {
  var id = req.path.replace('/trandetail/', '')
  const retrieve = await stripe.balanceTransactions.retrieve(id)
  //https://stripe.com/docs/api/balance_transactions/retrieve
  return res.status(200).json({
    message: 'retrieve id Transactions items...',
    id: id,
    retrieve: retrieve,
  })
})

router.post('/purchase', (req, res) => {
  fs.readFile('public/stripe-store/items.json', async function (error, data) {
    if (error) {
      res.status(500).end()
    } else {
      const itemsJson = JSON.parse(data)
      const itemsArray = itemsJson.music.concat(itemsJson.merch)
      let total = 0
      let line_items = []
      req.body.items.forEach(function (item) {
        const itemJson = itemsArray.find(function (i) {
          return i.id == item.id
        })
        line_items.push({
          price_data: {
            currency: 'vnd',
            product_data: {
              name: itemJson.name,
              images: [
                'https://i.imgur.com/EHyR2nP.png',
                itemJson.imgName.split(' ').join(''),
              ],
              // Đặt tên image Không được có khoảng trắng
            },
            unit_amount: itemJson.price * item.quantity,
          },
          quantity: item.quantity,
        })
      })

      //console.log(line_items)

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        success_url: `${process.env.APP_URL}/stripe-store/success.html`,
        cancel_url: `${process.env.APP_URL}/store`,
        // cancel_url: `${process.env.APP_URL}/stripe-store/cancel.html`,
      })
      res.json({ id: session.id })
    }
  }) // fs.readFile
})

module.exports = router
