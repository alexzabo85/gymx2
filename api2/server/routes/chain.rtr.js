var express = require('express');
var authCtrl = require('../ctrl/auth.ctrl');
var blockCtrl = require('../ctrl/block.ctrl');

const router = express.Router()
// router.param('shopId', shopCtrl.shopByID)
// router.param('productId', productCtrl.productByID)

// router.route('/')
// .post(authCtrl.requireSignin, blockCtrl.chainSet)
// .get(productCtrl.chainGet)
router.route('/')
  .get(blockCtrl.list)
  .post(blockCtrl.create)

// router.route('/check')
//   .get(authCtrl.requireSignin,/* shopCtrl.isOwner,*/(req, res) => res.json({ status: "chain is OK" }))

// router.route('/tx')
//   .post(authCtrl.requireSignin,/* shopCtrl.isOwner,*/ blockCtrl.txSet)


// router.route('/tx/:blockId/:txId')
//   .get(blockCtrl.txGet)

// router.route('/tx/:txId')
//   .post(authCtrl.requireSignin,/* shopCtrl.isOwner,*/ blockCtrl.txSet)
//   .get(productCtrl.txGetById)

// router.route('/:blockId')
//   .post(authCtrl.requireSignin,/* shopCtrl.isOwner,*/ blockCtrl.txSet)
//   .get(productCtrl.txGet)

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
