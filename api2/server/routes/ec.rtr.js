const express = require('express');
const userCtrl = require('./../modules/user/user.ctrl');
const authCtrl = require('./../modules/auth/auth.ctrl');
const ec = require('./../ctrl/ec.ctrl');

// import express from 'express'
// import userCtrl from '../controllers/user.controller'
// import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/loopback')
  .get((req, res) => { res.json({ status: 'ok' }) })

router.route('/secured-loopback')
  .get(authCtrl.requireSignin, (req, res) => { res.json({ status: 'ok' }) })

router.route('/generate-pair')
  .get(ec.generateKeyPair)

router.route('/hash')
  .get(ec.hash)

// router.route('/:userId')
//   .get(authCtrl.requireSignin, userCtrl.read)
//   .put(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, userCtrl.update)
//   .delete(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, userCtrl.remove)
// router.route('/api/stripe_auth/:userId')
// .put(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, userCtrl.stripe_auth, userCtrl.update)

// router.route('/generate-key-pair/:userId')
//   .put(/*authCtrl.requireSignin,*/ userCtrl.generateKeyPair)
// .delete(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, userCtrl.remove)
// router.route('/api/stripe_auth/:userId')
// .put(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, userCtrl.stripe_auth, userCtrl.update)

// router.param('userId', userCtrl.userByID)

// export default router
module.exports = router;
