var express = require('express');
var orgCtrl = require('./org.ctrl');
var authCtrl = require('../auth/auth.ctrl');
// var orgCtrl = {};

// import express from 'express'
// import orgCtrl from '../controllers/user.controller'
// import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.param('orgId', orgCtrl.getById)
router.route('/loopback').get((req, res) => { res.json({ status: 'ok' }) })
router.route('/secured-loopback').get(authCtrl.requireSignin, (req, res) => { res.json({ status: 'ok' }) })

router.route('/')
  .get(orgCtrl.list)
  .post(authCtrl.requireSignin,
    authCtrl.authorizedToUpdateProfile, //TBD
    orgCtrl.create /**create organization */
  )

router.route('/:orgId')
  .get(authCtrl.requireSignin, orgCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.authorizedToUpdateOrgProfile, orgCtrl.update)
// .post(authCtrl.requireSignin,
//   authCtrl.authorizedToUpdateProfile, //TBD
//   orgCtrl.createFacility /**create organization */
// )
router.route('/:orgId/facility')
  .get(authCtrl.requireSignin, orgCtrl.readFacility)
  .put(authCtrl.requireSignin,
    authCtrl.authorizedToUpdateOrgProfile,
    orgCtrl.updateFacility
  )
  .post(authCtrl.requireSignin,
    authCtrl.authorizedToUpdateProfile, //TBD
    orgCtrl.createFacility /**create organization */
  )

router.route('/:orgId/facility-list')
  .get(authCtrl.requireSignin, orgCtrl.listFacility)


router.route('/:orgId/:facId/device')
  .get(authCtrl.requireSignin, orgCtrl.readDevice)
  .put(authCtrl.requireSignin,
    authCtrl.authorizedToUpdateOrgProfile,
    orgCtrl.updateDevice
  )
  .post(authCtrl.requireSignin,
    authCtrl.authorizedToUpdateOrgProfile,
    orgCtrl.createDevice
  )

router.route('/:orgId/:facId/device-list')
  .get(authCtrl.requireSignin, orgCtrl.listDevice)

// router.route('/follow')
//   .get(authCtrl.requireSignin, orgCtrl.followerList)
//   .post(authCtrl.requireSignin, orgCtrl.follow)

// router.route('/unfollow')
//   .get(authCtrl.requireSignin, orgCtrl.followerList)
//   .put(authCtrl.requireSignin, orgCtrl.unfollow)

// .delete(authCtrl.requireSignin, orgCtrl.removePair)
// router.route('/api/stripe_auth/:userId')
// .put(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, orgCtrl.stripe_auth, orgCtrl.update)

// router.route('/generate-key-pair/:userId')
// .put(/*authCtrl.requireSignin,*/ orgCtrl.generateKeyPair)
// .delete(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, orgCtrl.remove)
// router.route('/api/stripe_auth/:userId')
// .put(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, orgCtrl.stripe_auth, orgCtrl.update)


// export default router
module.exports = router;
