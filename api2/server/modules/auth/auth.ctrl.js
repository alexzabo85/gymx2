
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../../config/config');
var { User } = require('../user/user.model');
// var Acc = require('../models/account.model');

const signin = async (req, res) => {

  try {
    let user = await User.findOne({
      "email": req.body.email
    })

    if (!user)
      return res.status('401').json({
        error: "User not found"
      })

    if (!user.authenticate(req.body.pass)) {
      return res.status('401').send({
        error: "Email and password don't match."
      })
    }

    const payload = {
      _id: user._id,
      user,
    }
    const token = jwt.sign(payload, config.jwtSecret)

    res.cookie("t", token, {
      expire: new Date() + 9999
    })

    return res.status('200').json({
      token,
      payload,
    })
  } catch (err) {
    return res.status('401').json({
      error: "Could not sign in because " + err.message
    })
  }
}

const signout = (req, res) => {
  const cookie = req.headers.cookie || 'No Cookie Was Found'

  res.clearCookie("t")
  return res.status('200').json({
    message: "signed out",
    cookie
  })
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  userProperty: 'auth'
})

const authorizedToUpdateProfile = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}
// TODO
const authorizedToUpdateOrgProfile = (req, res, next) => {
  // const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  // if (!(authorized)) {
  //   return res.status('403').json({
  //     error: "User is not authorized"
  //   })
  // }
  next()
}

const authorizedToSendTx = (req, res, next) => {
  const authorized = req.account && req.auth && req.account._ownerId == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized to send"
    })
  }
  next()
}

// const getAccountByOwner = async (req, res, next) => {
//   try {
//     let acc = await Acc.findOne({ _ownerId: req.auth._id })
//     if (!acc)
//       return res.status('400').json({
//         error: "Account not found"
//       })
//     req.account = acc
//     next()
//   } catch (err) {
//     return res.status('400').json({
//       error: "Could not retrieve account"
//     })
//   }
// }

const loopback = (req, res) => {
  res.json({
    body: req.body,
    cookie: req.headers.cookie || '',
    headers: req.headers || ''
  });
}

module.exports = {
  signin,
  signout,
  requireSignin,
  authorizedToUpdateProfile,
  authorizedToUpdateOrgProfile,
  authorizedToSendTx,
  // getAccountByOwner,
  loopback,
}
