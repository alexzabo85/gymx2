let express = require('express');
let productCtrl = require('./product.ctrl');
let authCtrl = require('../auth/auth.ctrl');

// let shopCtrl = require('../controllers/shop.ctrl');


// import express from 'express'
// import productCtrl from '../controllers/product.controller'
// import authCtrl from '../controllers/auth.controller'
// import shopCtrl from '../controllers/shop.controller'

const router = express.Router()
// router.param('shopId', shopCtrl.shopByID)
router.param('prodId', productCtrl.productByID)

router.route('/loopback')
  .get((req, res) => { res.json({ status: 'ok' }) })

router.route('/secured-loopback')
  .get(authCtrl.requireSignin, (req, res) => { res.json({ status: 'ok' }) })

router.route('/')
  .post(
    authCtrl.requireSignin,
    productCtrl.create
  )
  .get(productCtrl.list)

router.route('/:prodId')
  .post(
    authCtrl.requireSignin,
    productCtrl.vote
  )

// router.route('/api/product/:shopId/:productId')
//   .put(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.update)
//   .delete(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.remove)

// router.route('/api/products/latest')
//   .get(productCtrl.listLatest)

// router.route('/api/products/related/:productId')
//   .get(productCtrl.listRelated)

// router.route('/api/products/categories')
//   .get(productCtrl.listCategories)

// router.route('/api/products')
//   .get(productCtrl.list)

// router.route('/api/products/:productId')
//   .get(productCtrl.read)

// router.route('/api/product/image/:productId')
//   .get(productCtrl.photo, productCtrl.defaultPhoto)
// router.route('/api/product/defaultphoto')
//   .get(productCtrl.defaultPhoto)

module.exports = router;
