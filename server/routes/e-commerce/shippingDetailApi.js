const express = require("express");
const router = express.Router();

// const mongodb = require('../mongo/config')

const ShippingModel = require("../mongo/model/shipping-detail");

/*
  API for ShippingSchema Schema
  Product Create and Read all Policies API 's

*/
router
  .route("/shipping")

  //  Create a new Shipping :  POST http://localhost:8080/api/shipping
  .post((req, res) => {
    const shipping = new ShippingModel(); // create a new instance of the Product model

    shipping.address1 = req.body.address1;
    shipping.address2 = req.body.address2;
    shipping.country = req.body.country;
    shipping.zipCode = req.body.zipCode;
    shipping.shippingDate = req.body.shippingDate;
    shipping.products = req.body.products;
    shipping.userId = req.body.userId;
    shipping.totalPrice = req.body.totalPrice;
    shipping.paycash = req.body.paycash;

    // save the bear and check for errors
    shipping.save(shipping, (err, shipping) => {
      if (err) {
        res.send(err);
      }

      console.log("**********NEWLY CREATED SITEURL***********");
      console.log(shipping);
      res.send(shipping);
    })
  })
  // Get All shipping: GET http://localhost:8080/api/shipping
  .get((req, res) => {
    ShippingModel.find((err, data) => {
      if (err) {
        res.send(err);
      }
      //console.log(111,"data.products", data[0].products);
      res.json(data);
    });
  });
  
// ----------------------------------------------------
router
  .route("/shipping/:shipping_id")

  // get the shipping with that id (accessed at GET http://localhost:8080/api/shipping/:shipping_id)
  .get(function(req, res) {
    ShippingModel.findById(req.params.shipping_id, function(err, data) {
      if (err) {
        res.send(err);
      }
      console.log("data", data);
      res.json(data);
    });
  })

  // update the shipping with this id (accessed at PUT http://localhost:8080/api/shipping/:shipping_id)
  .put(function(req, res) {
    // use our shipping model to find the shipping we want
    ShippingModel.findById(req.params.shipping_id, function(err, shipping) {
      if (err) {
        res.send(err);
      }
      shipping.address1 = req.body.address1;
      shipping.address2 = req.body.address2;
      shipping.country = req.body.country;
      shipping.zipCode = req.body.zipCode;
      shipping.shippingDate = req.body.shippingDate;
      shipping.products = req.body.products;
      shipping.userId = req.body.userId;
      shipping.totalPrice = req.body.totalPrice;
      shipping.paycash = req.body.paycash;
      
      // save the bear
      shipping.save(function(err, data) {
        if (err) {
          res.send(err);
        }
        //console.log("Updating shipping", data);
        res.send(data);
      });
    });
  })

  // delete the shipping with this id (accessed at DELETE http://localhost:8080/api/shipping/:shipping_id)
  .delete(function(req, res) {
    //console.log('Delete OK')
    ShippingModel.deleteOne(
      {
        _id: req.params.shipping_id,
      },
      function(err, shipping) {
        if (err) {
          res.send(err);
        }
        res.send(shipping);
      }
    );
  });

module.exports = router;
