var mongoose = require('mongoose');
let sha3 = require('js-sha3');
var txLib = require('../../helpers/tx.lib');
var config = require('../../config/config');

const accountDbConnection = mongoose.createConnection(config.mongoUris[config.mongoNames.account], {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: true,
  useFindAndModify: false
});
// const accountDbConnection =
//   config.mongooseInit(mongoose, config.mongoUris[config.mongoNames.account],
//     {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useUnifiedTopology: true,
//       autoIndex: true,
//       useFindAndModify: false
//     }
//   )


const key = (opt) => ({
  type: String,
  index: opt.index || false,
  // required: "Public key is required",
  // unique: 'Public key already exists',
  // match: [/^(|[0-9a-f]{64})$/, 'Please fill a valid Public key'],
  trim: true,
  // immutable: true
})

const TxSchema = new mongoose.Schema({

  txString: {
    type: String,
  },

  // header: {
  sender: key({ index: true }),

  receiver: key({ index: true }),

  amount: Number,

  count: {
    type: Number,
    // index: true,
    // unique: true
  },
  date: Date,

  data: {
    type: String,
    maxlength: 1024
  },


  txStatus: {
    type: String,
    enum: [
      'pending',
      'accept',
      'deny',
    ],
    required: false
    // unique: true,
    // maxlength: 1024
  },

  txString: {
    type: String,
    // unique: true,
    // maxlength: 1024
  },

  txHash: {
    type: String,
    index: true,
    // unique: true,
  },

  txSign: {
    r: String,
    s: String,
    recoveryParam: Number,
  },

  // },

  // random: {
  //   type: String,
  //   unique: 'random already exists',
  //   maxlength: 9999,
  // },



  // description: {
  // type: String,
  // index: true,
  // default: 0,
  // unique: true,
  // required: true
  // },



  // createdAt: {
  //   type: Date,
  //   default: new Date()
  // }

}, {
  timestamps: true,
  _id: true,
})

const AccountSchema = new mongoose.Schema({

  // publicKey:String,
  // publicKey:String,
  txs: [{
    type: String,
    // unique: true,
    // index: true,
  }],

  owner: {
    type: String,
    unique: 'Owner already exists',
    required: 'Owner is required'
  },

  balance: {
    type: Number,
    min: 0,
    required: 'Balance is required',
  },

  // count: {
  //   type: Number,
  //   unique: true,
  //   index: true,
  //   required: 'count is required',
  // },

}, {
  timestamps: true,
  _id: true,
})

TxSchema.methods = {

  initSendTx: function (SenderQ, senderLastTx, ops) {

    if (ops.txHash !== txLib.hash(ops.txString)) {
      return null;
    }
    const recoveredPublicKey =
      txLib.verifyTxSign(ops.txHash, ops.txSign)

    if (!recoveredPublicKey) { return null; }

    const txTempObj = JSON.parse(ops.txString)

    if (recoveredPublicKey !== txTempObj.sender) {
      return null;
    }
    if (0 && senderLastTx.balance < txTempObj.amount) {
      return null;
    }

    return new SenderQ({
      txString,
      txHash,
      txSign,
      sender: txTempObj.sender,
      receiver: txTempObj.receiver,
      amount: txTempObj.amount,
      count: txTempObj.count,
      data: txTempObj.data,
      balance: senderLastTx.balance - txTempObj.amount
    })
  },

  setTxString: function (tx) {

    this.txString = JSON.stringify({
      sender: tx.sender,
      receiver: tx.receiver,
      amount: tx.amount,
      data: tx.data,
    })

    return this.txString;
  },

  setTxHash: function (str) {

    this.txHash = sha3.keccak256(str);

    return this.txHash;
  },


  toHash: function (str) {
    return sha3.keccak256(str);

  },

}

const Account = accountDbConnection.model('Account', AccountSchema);

Account.on('index', function (err) {
  if (err) {
    console.error('User index error: %s', err);
  } else {
    console.info('User indexing complete');
  }
});

module.exports = {
  accountDbConnection,
  Account,
  TxSchema
}
