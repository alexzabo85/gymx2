
const request = require('request');
const extend = require('lodash/extend');
let ec = require('elliptic').ec('secp256k1');
const config = require('../../config/config');
const { Org } = require('./org.model');
const errorHandler = require('../../helpers/dbErrorHandler');
const txLib = require('../../helpers/tx.lib')

// let ec = new elliptic;

// let elliptic = require('elliptic');
// let sha3 = require('js-sha3');
// let ec = new elliptic.ec('secp256k1');


// import stripe from 'stripe'
// const myStripe = stripe(config.stripe_test_secret_key)

const create = async (req, res) => {
  const user = new Org(req.body)
  try {
    await user.save()
    return res.status(201).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

//TODO
const createFacility = async (req, res) => {
  return res.status(201).json({
    message: "Successfully signed up!"
  })
}
//TODO
const createDevice = async (req, res) => {
  return res.status(201).json({
    message: "Successfully signed up!"
  })
}

/**
 * Load user and append to req.
 */
const getById = async (req, res, next, id) => {
  try {
    let user = await Org.findById(id)
    if (!user)
      return res.status('400').json({
        error: "Org not found"
      })
    req.profile = user
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve user"
    })
  }
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}
//TODO
const readFacility = (req, res) => {
  // req.profile.hashed_password = undefined
  // req.profile.salt = undefined
  return res.json({ demo: "profile" })
}
//TODO
const readDevice = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}


const list = async (req, res) => {
  try {
    let users = await Org.find().select('name email updated created pairs')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
//TODO
const listFacility = async (req, res) => {
  // try {
  //   let users = await Org.find().select('name email updated created pairs')
  //   res.json(users)
  // } catch (err) {
  //   return res.status(400).json({
  //     error: errorHandler.getErrorMessage(err)
  //   })
  // }
  res.json([1, 2, 4])
}

//TODO
const listDevice = async (req, res) => {
  // try {
  //   let users = await Org.find().select('name email updated created pairs')
  //   res.json(users)
  // } catch (err) {
  //   return res.status(400).json({
  //     error: errorHandler.getErrorMessage(err)
  //   })
  // }
  res.json([1, 2, 4])
}

const update = async (req, res) => {
  try {
    let user = req.profile
    user = extend(user, req.body)
    user.updated = Date.now()
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

//TODO
const updateFacility = async (req, res) => {
  // try {
  //   let user = req.profile
  //   user = extend(user, req.body)
  //   user.updated = Date.now()
  //   await user.save()
  //   user.hashed_password = undefined
  //   user.salt = undefined
  //   res.json(user)
  // } catch (err) {
  //   return res.status(400).json({
  //     error: errorHandler.getErrorMessage(err)
  //   })
  // }
  res.json({ demo: 'facility' })
}

//TODO
const updateDevice = async (req, res) => {
  res.json({ demo: 'facility' })
}

const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const follow = (req, res, next) => { }
const unfollow = (req, res, next) => { }
const followerList = (req, res, next) => { }


const isSeller = (req, res, next) => {
  const isSeller = req.profile && req.profile.seller
  if (!isSeller) {
    return res.status('403').json({
      error: "Org is not a seller"
    })
  }
  next()
}

const stripe_auth = (req, res, next) => {
  request({
    url: "https://connect.stripe.com/oauth/token",
    method: "POST",
    json: true,
    body: { client_secret: config.stripe_test_secret_key, code: req.body.stripe, grant_type: 'authorization_code' }
  }, (error, response, body) => {
    //update user
    if (body.error) {
      return res.status('400').json({
        error: body.error_description
      })
    }
    req.body.stripe_seller = body
    next()
  })
}

const stripeCustomer = (req, res, next) => {
  if (req.profile.stripe_customer) {
    //update stripe customer
    myStripe.customers.update(req.profile.stripe_customer, {
      source: req.body.token
    }, (err, customer) => {
      if (err) {
        return res.status(400).send({
          error: "Could not update charge details"
        })
      }
      req.body.order.payment_id = customer.id
      next()
    })
  } else {
    myStripe.customers.create({
      email: req.profile.email,
      source: req.body.token
    }).then((customer) => {
      Org.update({ '_id': req.profile._id },
        { '$set': { 'stripe_customer': customer.id } },
        (err, order) => {
          if (err) {
            return res.status(400).send({
              error: errorHandler.getErrorMessage(err)
            })
          }
          req.body.order.payment_id = customer.id
          next()
        })
    })
  }
}

const createCharge = (req, res, next) => {
  if (!req.profile.stripe_seller) {
    return res.status('400').json({
      error: "Please connect your Stripe account"
    })
  }
  myStripe.tokens.create({
    customer: req.order.payment_id,
  }, {
    stripeAccount: req.profile.stripe_seller.stripe_user_id,
  }).then((token) => {
    myStripe.charges.create({
      amount: req.body.amount * 100, //amount in cents
      currency: "usd",
      source: token.id,
    }, {
      stripeAccount: req.profile.stripe_seller.stripe_user_id,
    }).then((charge) => {
      next()
    })
  })
}

module.exports = {
  create,
  createFacility,
  createDevice,
  getById,
  read,
  readFacility,
  readDevice,
  list,
  listFacility,
  listDevice,
  remove,
  update,
  updateFacility,
  updateDevice,
  follow,
  unfollow,
  followerList,
  // isSeller,
  // stripe_auth,
  // stripeCustomer,
  // createCharge,
  // generateKeyPair,
}
