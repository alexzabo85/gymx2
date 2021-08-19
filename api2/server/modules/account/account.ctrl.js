
const extend = require('lodash/extend');
const mongoose = require('mongoose');
const elliptic = require('elliptic');
const sha3 = require('js-sha3');
const ec = new elliptic.ec('secp256k1');
const config = require('../../config/config');
const { TxSchema, Account, accountDbConnection } = require('./account.model');
const { User } = require('../user/user.model');
const userCtrl = require('../user/user.ctrl');
const txLib = require('../../helpers/tx.lib');
const errorHandler = require('../../helpers/dbErrorHandler');
// const formidable = require('formidable');
// const fs = require('fs');
// const defaultImage = require('./../../client/assets/images/default.png');

const accByID = async (req, res, next, id) => {
  try {
    let account = await Account.findById(id).exec()
    if (!account)
      return res.status(400).json({
        error: "Account not found"
      })
    req.account = account
    next()
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve account"
    })
  }
}

const txByID = async (req, res, next, senderPubKey) => {

  req.senderPubKey = senderPubKey
  req.SenderCollection = mongoose.model(`_TX_${senderPubKey}`, TxSchema)
  req.senderNewTx = new req.SenderCollection();
  req.senderLastTx = null;

  try {
    req.senderLastTx = await req.SenderCollection.findOne().sort({ count: -1 })
  } catch (err) {
    return res.status(400).json({
      error: err
    })
  }

  return next()

}

const listTxs = async (req, res) => {

  const senderKeys = req.body.keyPairs[0]
  // const receiverKeys = req.body.keyPairs[1]

  const senderkeyPair = ec.keyFromPrivate(senderKeys.privKey)

  const senderQAddress = txLib.getAddressFromPair(senderkeyPair);

  const SenderQ = mongoose.model(`_TX_${senderQAddress}`, TxSchema)

  const list = await SenderQ.find({}).sort({ count: -1 }).lean()

  return res.json(list)
}

const generateAccount = async function (req, res) {

  const newSenderAccountState = await Account.create(
    {
      owner: req.body.keyPairs[0].pubKey,
      balance: req.body.amount,
    }
  ).catch(err => console.log('Failed to Init Tx: ' + err))

  return res.json({ newSenderAccountState })

}

/** signTx()
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const signTx = async function (req, res) {

  const { tx } = req.body

  tx.txString = JSON.stringify(tx);

  tx.txHash = txLib.hash(tx.txString);

  tx.txSign = txLib.sign(tx.txHash, req.body.keyPairs[0].privKey);

  tx.pubKeyRecovered = txLib.verifyTxSign(tx.txHash, tx.txSign);

  return res.json({ tx })

}

/** sendTx
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const sendTx = async (req, res) => {

  const tx = {}

  tx.txSign = req.body.tx.txSign;
  tx.txString = req.body.tx.txString;
  tx.txHash = txLib.hash(tx.txString);

  const pubKeyRecovered = txLib.verifyTxSign(tx.txHash, tx.txSign);

  if (!pubKeyRecovered) return res.status(401).json({
    status: false,
    msg: `Failed to recovered sender PubKey`,
  })

  const recoveredPair = ec.keyFromPublic(pubKeyRecovered)
  const txObj = JSON.parse(tx.txString)

  tx.sender = recoveredPair.getPublic().encode("hex").substr(2)
  tx.receiver = txObj.receiver;
  tx.amount = txObj.amount;
  tx.date = txObj.date;
  tx.data = txObj.data;
  tx.random = req.body.tx.random;
  tx.txStatus = config.txStatus.pending;

  const SenderQ = await accountDbConnection.model(`_TX_${txLib.getAddressFromPubKey(tx.sender)}`, TxSchema)

  const newTx = await SenderQ.create(tx)

  if (!newTx) {
    return res.json({ status: 'Failed to create pending tx' })
  }

  // db.collection.find({ field: { $size: { $gt: 0 } } })

  // const [status1, msg1] = await updateSenderAccount(newTx)
  let newSenderAccountState = await Account.findOneAndUpdate(
    {
      owner: tx.sender,
      balance: { $gte: tx.amount },
      // txs : {$size: { $gt : 0 } }
    },
    {
      $inc: {
        balance: -tx.amount,
      },
      $push: {
        txs: tx.txString,
      }
    },
    { new: true }
  ).catch(err => console.log(err))

  // if (!newSenderAccountState) {
  //   return [false, 'Failed to update sender account'];
  // }

  if (!newSenderAccountState) {

    await SenderQ.updateOne(   //  denyTx(newTx)
      { _id: tx._id },
      { txStatus: config.txStatus.deny },
    )
    return res.json({ status: 'Failed to update sender account' })

  }

  // const [status2, msg2] = status1 && await updateReceiverAccount(newTx)
  // update receiver account 
  //--------------------------------------------------
  let newReceiverAccountState = await Account.findOneAndUpdate(
    {
      owner: tx.receiver,
    },
    {
      $inc: {
        balance: +tx.amount
      },
      $addToSet: {
        txs: tx.txString,
      }
    },
    { new: true }
  ).catch(err => { })

  // create new account if not exist
  //-------------------------------------------------- 
  if (!newReceiverAccountState) {
    newReceiverAccountState = await Account.create(
      {
        owner: tx.receiver,
        balance: 0,
        txs: [tx.txString,]
      }
    ).catch(err => { })
  }

  // try to update receiver account again  
  //--------------------------------------------------
  if (!newReceiverAccountState) {
    newReceiverAccountState = await Account.findOneAndUpdate(
      {
        owner: tx.receiver,
      },
      {
        $inc: {
          balance: +tx.amount
        },
        $addToSet: {
          txs: tx.txString,
        }
      },
      { new: true }
    ).catch(err => console.log(err))
  }

  if (!newReceiverAccountState) {
    return res.json({ status: 'Failed to update receiver account' })
  }

  await SenderQ.updateOne(
    { _id: newTx._id },
    { txStatus: config.txStatus.accept },
  )

  const ReceiverQ = await accountDbConnection.model(`_TX_${txLib.getAddressFromPubKey(tx.receiver)}`, TxSchema)

  tx.txStatus = config.txStatus.accept;
  await ReceiverQ.create(tx)

  return res.status(201).json({ status: 'Accepted' })

}


const create = async (req, res) => {

  let user = req.profile;
  let account = req.profile[req.body.tx.accIdx];


  account = new Account({
    _ownerId: req.auth._id,
    balance: req.body.balance
  })

  try {
    let result = await account.save()
    res.status('201').json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }

}

// const receiveTx = async (req, res) => {

//   const tx = JSON.parse(req.body.txString)
//   const txSign = JSON.parse(req.body.txSign)

//   const senderPubKey = txLib.verifyTx(tx, txSign)

//   const SenderCollection = mongoose.model(`_Q_${senderPubKey}`, TxSchema)

//   let senderLastTx = await SenderCollection.findOne().sort({ count: -1 })

//   if (senderLastTx.count + 1 !== tx.count) {
//     return [false, 'Tx Count not accepted'] //error found tx in place
//   }

//   if (senderLastTx.balance < tx.amount) {
//     return [false, 'Balance not accepted'] //error found tx in place
//   }

//   tx.balance = senderLastTx.balance - tx.amount;

//   // tx.checkString = JSON.stringify({ ...tx.sender });

//   // tx.checkSign = signTx(tx.checkString)

//   const newSenderTx = await SenderCollection.create(tx).lean()

//   // const senderCol = SenderCol.findOne({ prevTxHash: tx.prevTxHash }).sort({ 'updatedAt': -1 })

//   const ReceiverCollection = mongoose.model(`_k_${tx.receiver}`, TxSchema)


//   lastTx = await ReceiverCollection.findOne().sort({ count: -1 })

//   // if (!lastTx) {
//   let newReceiverTx = new ReceiverCollection({
//     count: lastTx ? lastTx.count : 0,
//     balance: lastTx ?
//       lastTx.balance + newSenderTx.amount
//       : newSenderTx.amount,
//   })
//   // }else
//   // newReceiverTx.count = lastTx && lastTx.count + 1;

//   // newTx.balance = lastTx.balance + newTx.amount;

//   newReceiverTx = await newReceiverTx.save().lean()

//   // isNotLastTx = await receiverCollection.findOne({ prevTxHash: tx.prevTxHash }).lean()


//   if (!newReceiverTx) {
//     return false; //error last tx not found
//   }

//   return res.status(201).json({
//     status: 'Accepted',
//     newSenderTx,
//     newReceiverTx
//   })

// }

const read = (req, res) => {
  // req.account.image = undefined
  return res.json(req.account)
}

const list = async (req, res) => {
  let { address, pubKey } = req.query;
  // let  = req.query.pubKey;
  const Q = mongoose.model(`Q_${address}`, TxSchema)

  try {
    let txs = await Q.find().lean()
    if (!txs)
      return res.status('400').json({
        error: "Account not found"
      })
    // req.accounts = account
    // next()
    return res.json(
      txs.map(item => ({
        _Id: item._id,
        _ownerId: item._ownerId,
        balance: +item.balance.toFixed(2),
      }))
    )
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve accounts list"
    })
  }
}

const getPairs = (req, res) => {
  // let pairs = req.profile.keyPairs || []
  res.json(req.profile.keyPairs)

}

const genKeyPair = async (req, res) => {

  let keyPair = ec.genKeyPair();
  let privKey = keyPair.getPrivate("hex");
  let pubKey = keyPair.getPublic().encode("hex").substr(2);
  const newPair = { privKey, pubKey, address: txLib.hash(pubKey) };
  // req.profile.keyPairs.push(newPair)

  // await req.profile.save()

  res.status(201).json(newPair)

}

module.exports = {
  signTx,
  generateAccount,
  listTxs,
  // test1,
  // receiveTx,
  accByID,
  create,
  sendTx,
  read,
  list,
  getPairs,
  genKeyPair,
}
