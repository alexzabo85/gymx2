const express = require('express');
const accCtrl = require('../account/account.ctrl');
const userCtrl = require('../user/user.ctrl');
const authCtrl = require('../auth/auth.ctrl');

const router = express.Router()
router.param('accId', accCtrl.accByID)
router.param('userId', userCtrl.userByID)

router.route('/loopback')
  .get((req, res) => { res.json({ status: 'ok' }) })

router.route('/secured-loopback')
  .get(authCtrl.requireSignin, (req, res) => { res.json({ status: 'ok' }) })

router.route('/')
  .get(accCtrl.list)
  .post(
    authCtrl.requireSignin,
    accCtrl.create
  )

router.route('/tx')
  .get(
    accCtrl.listTxs
  )
  .post(
    authCtrl.requireSignin,
    accCtrl.sendTx
  )

router.route('/tx/init')
  .post(
    authCtrl.requireSignin,
    accCtrl.generateAccount
  )

router.route('/tx/sign')
  .post(
    authCtrl.requireSignin,
    accCtrl.generateAccount
  )

router.route('/key')
  .get(authCtrl.requireSignin, accCtrl.genKeyPair)

router.route('/:accId')
  .get(accCtrl.read)
  .post(
    authCtrl.requireSignin,
    authCtrl.authorizedToSendTx,
    accCtrl.sendTx
  )

module.exports = router;
