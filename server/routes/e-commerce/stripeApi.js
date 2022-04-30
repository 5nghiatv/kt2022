
require('dotenv').config()
const express = require('express');
const app = express();
const router = express.Router();
const stripeSecretKey = process.env.STRIPE_SECRET
const stripePublicKey = process.env.STRIPE_KEY
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)
app.use(express.json())


router.get('/custCreate', async function(req, res) {
    const customer = await stripe.customers.create({
      name: 'Trần Văn Nghĩa',
      phone: '0903917963',
      email: 'nghiatv@gmail.com',
      address: {
        line1: '118/63 Bạch Đằng, P24, Bình Thạnh',
        city: 'TP HCM',
        country: 'Việt Nam'
      },
      description: 'My First Test Customer (created for API docs)'
    });
    return res.status(200).json({ message: 'Successfully customer items...', customer: customer  })
});

router.get('/custList', async function(req, res) {
    const customers = await stripe.customers.list({ limit: 5, });
    return res.status(200).json({ message: 'Successfully customers items...', customers: customers  })
});
router.get('/custDel/:id', async function(req, res) {
  var id = ( req.path.replace("/custDel/", ""));
  const deleted = await stripe.customers.del(id);
  return res.json({ message: 'Successfully Delete items...'+ id })
});

router.get('/transactions', async function(req, res) {
  const trans = await stripe.balanceTransactions.list({ limit: 10,  });
  return res.status(200).json({
    message: 'retrieve id Transactions items...',
    items: trans.data
  })
  
});

router.get('/trandetail/:id', async function(req, res) {
    var id = ( req.path.replace("/trandetail/", ""));
    const retrieve = await stripe.balanceTransactions.retrieve(id );
    //https://stripe.com/docs/api/balance_transactions/retrieve
    return res.status(200).json({
          message: 'retrieve id Transactions items...',
          id: id,
          retrieve: retrieve,
    })
});



router.post('/purchase',async (req, res) => {
      //console.log(req.body)
      let total = 0
      let line_items = []
      req.body.items.forEach(function(item) {
        line_items.push(
          {
            price_data: {
              currency: 'vnd',
              product_data: {
                name: item.productName,
                images: ['https://i.imgur.com/EHyR2nP.png', item.productImage.split(" ").join("")],
                // Đặt tên image Không được có khoảng trắng
              },
              unit_amount: item.productPrice.split(",").join("") * 1 ,
            },
            quantity: item.amount || 1,
          }
        )
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        success_url: `${req.body.url}/#/e-commerce/success`,
        cancel_url: `${req.body.url}/#/e-commerce/checkout`,

      });
      res.json({ id: session.id });
});

module.exports = router ;