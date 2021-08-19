
const fs = require('fs');
const mongoose = require('mongoose');
const extend = require('lodash/extend');
const formidable = require('formidable');
const config = require('../../config/config');
const { txLib } = require('../../config/config');
const { Product, VotesColSchema, productDbConnection } = require('./product.model');
const { User } = require('../user/user.model');
const errorHandler = require('../../helpers/dbErrorHandler');

// const defaultImage = require('./../../client/assets/images/default.png');

const productByID = async (req, res, next, id) => {
  try {
    let product = await Product.findById(id)
    if (!product)
      return res.status('400').json({
        error: "Product not found"
      })
    req.product = product
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve product"
    })
  }
}

const create = async (req, res) => {

  if (req.body.filters) {  ///NOTE: verify correct filters configuration
    //TODO: check ageGenderPyramid keys and values
  }

  const keyPair = txLib.generatePair()
  req.body.keyPair = {
    pubKey: txLib.getPublic(keyPair),
    privKey: txLib.getPrivate(keyPair),

  }

  let product = new Product(req.body)
  product._ownerId = req.auth._id + ''
  /// NOTE[PC02], NOTE[PC03], NOTE[PC04]
  // product.filters = [...product.filters] //...filters

  try {
    let result = await product.save()
    res.status(201).json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**placeVote() 
 * - save vote to pending collection (_QP_xxxx collection)
 * - check public/private-invited (Product collection)
 * - occupy product filter 
 * - create vote (_P_xxxx collection) 
 * 
 * @param {Mongoose Document} product 
 * @param {Mongoose Document} user 
 * @param {Object} payload (user vote)
 */
const placeVote = async function (product, user, payload) {

  let pending;
  let VotesQP;

  try { // <<<==============================================<<< save pending vote

    VotesQP = productDbConnection.model(`_QP_${('' + product._id).substr(0, 4)}`, VotesColSchema)

    pending = await VotesQP.create({
      vote: payload,
      _voterId: user._id,
      status: 'pending',
      filterIndex: ''
    })
  } catch (err) { throw new Error(`${err}`) }

  if (!pending) return ['Failed', 'Error save to pendind collection']

  if ((product.mode === config.productMode.private) && !product.invitations['' + user._id]) {
    return ['Failed', 'Product is private']
  }

  for (let i = 0; i < product.filters.length; i++) {

    let filter = product.filters[i]

    if (filter.kind === config.filterTypes.agl && filter.counter) {

      if ((filter.gender !== 'any') && (user.gender !== filter.gender)) continue;

      if ((filter.origin !== 'any') && (user.origin !== filter.origin)) continue;

      if ((filter.language !== 'any') && (user.languages[0] !== filter.language)) continue;

      const age = user.getYearsOld()

      if (age < filter.minAge || age > filter.maxAge) continue;

      let vote = {};

      const newPro = await Product.findOneAndUpdate(// <<<===<<< occupy filter 
        {
          _id: product._id, //TODO change to product.hash which is 
          [`filters.${i}.counter`]: { $gt: 0 }
        },
        {
          $inc: {
            [`filters.${i}.counter`]: -1
          },
          $set: { [`filters.${i}.votersMap.${user._id}`]: payload, },
        },
        { new: true }
      ).catch(err => null)

      if (!newPro) continue;

      try { // <<<===========================================<<< create vote

        let VotesQ = productDbConnection.model(`_Q_${('' + product._id).substr(0, 4)}`, VotesColSchema)

        vote = await VotesQ.create({
          vote: payload,
          _voterId: user._id,
          _productId: newPro._id,
          status: 'accept',
          filterIndex: `${i}:${newPro.filters[i].counter}`,
        })
      } catch (err) {
        throw new Error(`>>>=====>>> unable to place vote: ${err}`)
      }

      try { // <<<======================================<<< (soft) delete pending vote 
        pending = await VotesQP.deleteOne({
          _voterId: user._id,
          status: 'pending',
        })
      } catch (err) {
        throw new Error(`${err}`)
      }

      return ['Accepted', vote._id];

    }
  }

  try { // <<<==============================================<<< deny pending vote

    pending.status = 'deny'
    pending.save()

  } catch (err) { throw new Error(`${err}`) }


  return ['Failed', 'Filter not found']
}

const vote = async (req, res) => {
  let product = req.product
  let user;

  try {
    user = await User.findById(req.auth._id)
    if (!user)
      return res.status('400').json({
        error: "User not found"
      })
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve user: " + err.message
    })
  }

  // console.log('product::::: ', product)
  const [status, payload] = await placeVote(product, user, req.body)

  if (status !== 'Accepted') {
    return res.status(401).json({
      status,
      payload
    })
  }

  return res.status(201).json({
    status,
    payload
  })

}

const list = async (req, res) => { //TODO: allow to list for specific user (user-filter match) 
  // const query = {}
  // if (req.query.search) 
  //   query.name = { '$regex': req.query.search, '$options': "i" }
  // if (req.query.category && req.query.category != 'All')
  //   query.category = req.query.category
  try {
    let products = await Product.find({}, '-votes').select('-image') //TODO: use projection to disable votes field 
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const photo = (req, res, next) => {
  if (req.product.image.data) {
    res.set("Content-Type", req.product.image.contentType)
    return res.send(req.product.image.data)
  }
  next()
}

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + defaultImage)
}

const read = (req, res) => {
  req.product.image = undefined
  return res.json(req.product)
}

const update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        message: "Photo could not be uploaded"
      })
    }
    let product = req.product
    product = extend(product, fields)
    product.updated = Date.now()
    if (files.image) {
      product.image.data = fs.readFileSync(files.image.path)
      product.image.contentType = files.image.type
    }
    try {
      let result = await product.save()
      res.json(result)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const remove = async (req, res) => {
  try {
    let product = req.product
    let deletedProduct = await product.remove()
    res.json(deletedProduct)

  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listByShop = async (req, res) => {
  try {
    let products = await Product.find({ shop: req.shop._id }).select('name image price quantity').lean()
    // let products = await Product.find({shop: req.shop._id}).populate('shop', '_id name').select('-image')
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listLatest = async (req, res) => {
  try {
    let products = await Product.find({}).sort('-created').limit(5).populate('shop', '_id name').exec()
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listRelated = async (req, res) => {
  try {
    let products = await Product.find({ "_id": { "$ne": req.product }, "category": req.product.category }).limit(5).populate('shop', '_id name').exec()
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listCategories = async (req, res) => {
  try {
    let products = await Product.distinct('category', {})
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listExample = async (req, res) => {
  const query = {}
  if (req.query.search)
    query.name = { '$regex': req.query.search, '$options': "i" }
  if (req.query.category && req.query.category != 'All')
    query.category = req.query.category
  try {
    let products = await Product.find(query).populate('shop', '_id name').select('-image').exec()
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const decreaseQuantity = async (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      "updateOne": {
        "filter": { "_id": item.product._id },
        "update": { "$inc": { "quantity": -item.quantity } }
      }
    }
  })
  try {
    await Product.bulkWrite(bulkOps, {})
    next()
  } catch (err) {
    return res.status(400).json({
      error: "Could not update product"
    })
  }
}

const increaseQuantity = async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(req.product._id, { $inc: { "quantity": req.body.quantity } }, { new: true })
      .exec()
    next()
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

module.exports = {
  create,
  productByID,
  vote,
  list,
}

