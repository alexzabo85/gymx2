
var request = require('request');
let elliptic = require('elliptic');
let sha3 = require('js-sha3');
let ec = new elliptic.ec('secp256k1');
var extend = require('lodash/extend');
var config = require('../config/config');
var { User } = require('../modules/user/user.model');
var errorHandler = require('../helpers/dbErrorHandler');
const txLib = require('../helpers/tx.lib')
// import stripe from 'stripe'
// const myStripe = stripe(config.stripe_test_secret_key)





const generateKeyPair = async (req, res) => {
  // let keyPair = ec.keyFromPrivate("97ddae0f3a25b92268175400149d65d6887b9cefaf28ea2c078e05cdc15a3c0a");
  let keyPair = ec.genKeyPair();
  let privKey = keyPair.getPrivate("hex");
  let pubKey = keyPair.getPublic();

  res.json({
    pair: {
      private: privKey,
      public: pubKey.encode("hex").substr(2),
    }
  })

}

const hash = async (req, res) => {
  let string = JSON.stringify(req.body);
  let hash = sha3.keccak256(string);

  res.json({
    string,
    hash,
  })

}



const create = async (req, res) => {
  const user = new User(req.body)
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

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id)
    if (!user)
      return res.status('400').json({
        error: "User not found"
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

const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
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

const isSeller = (req, res, next) => {
  const isSeller = req.profile && req.profile.seller
  if (!isSeller) {
    return res.status('403').json({
      error: "User is not a seller"
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
      User.update({ '_id': req.profile._id },
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

// export default {
module.exports = {
  generateKeyPair,
  hash,
}
