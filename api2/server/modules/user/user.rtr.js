var express = require('express');
var userCtrl = require('./user.ctrl');
var authCtrl = require('../auth/auth.ctrl');

// import express from 'express'
// import userCtrl from '../controllers/user.controller'
// import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.param('userId', userCtrl.userByID)

router.route('/loopback')
  .get((req, res) => { res.json({ status: 'ok' }) })

router.route('/secured-loopback')
  .get(authCtrl.requireSignin, (req, res) => { res.json({ status: 'ok' }) })

router.route('/')
  .get(userCtrl.list)
  .post(userCtrl.create)

router.route('/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, userCtrl.remove)

router.route('/follow')
  .get(authCtrl.requireSignin, userCtrl.followerList)
  .post(authCtrl.requireSignin, userCtrl.follow)

router.route('/unfollow')
  .get(authCtrl.requireSignin, userCtrl.followerList)
  .put(authCtrl.requireSignin, userCtrl.unfollow)

// .delete(authCtrl.requireSignin, userCtrl.removePair)
// router.route('/api/stripe_auth/:userId')
// .put(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, userCtrl.stripe_auth, userCtrl.update)

// router.route('/generate-key-pair/:userId')
// .put(/*authCtrl.requireSignin,*/ userCtrl.generateKeyPair)
// .delete(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, userCtrl.remove)
// router.route('/api/stripe_auth/:userId')
// .put(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, userCtrl.stripe_auth, userCtrl.update)


// export default router
module.exports = router;
