const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('../../config/config');

const productDbConnection = mongoose.createConnection(config.mongoUris[config.mongoNames.product], {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: true,
  useFindAndModify: false
});

const VotesColSchema = new mongoose.Schema({

  status: String,

  vote: {},

  _voterId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    index: true,
    unique: true
  },

  _productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    index: true
  },

  filterIndex: {
    type: String,
    required: false,
    unique: true,
    default: ''
  },


  gpsCoor: {
    type: String
  }
})

const FilterSchema = new mongoose.Schema({
  votersMap: {

  },

  origin: {
    type: String
  },

  language: {
    type: String
  },


  kind: { type: String },

  counter: {
    type: Number,
    min: 0,
    required: true
  },

  counterInit: {
    type: Number,
    min: 0,
    required: true
  },

  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },

  minAge: {
    type: Number,
    min: 0,
    max: 250,
  },

  maxAge: {
    type: Number,
    min: 0,
    max: 250,
  },

  address: {
    type: String
  },

  votes: [String],

}, { timestamps: false })

const ProductSchema = new mongoose.Schema({

  keyPair: {
    pubKey: String,
    privKey: String,
  },

  mode: {
    type: String,
    enum: [
      config.productMode.private,
      config.productMode.public,
    ],

  },

  invitations: {
    type: {},
  },

  timing: {
    duedate: String,
  },

  _ownerId: mongoose.Schema.ObjectId,

  _accountId: { type: mongoose.Schema.ObjectId, ref: 'Accounts' },

  question: String,

  body: String,

  filters: [FilterSchema],



}, { timestamps: true })

ProductSchema.methods = {

  hasVoter: function (userId) {
    // return this.get(`resultsMap.${userId}`) !== undefined;
    return `${this._id}`
  },
  verifyAddress: function (area, address) {
    return area === address;
  }
}

module.exports = {
  productDbConnection,

  Product: productDbConnection.model('Product', ProductSchema),

  VotesColSchema,

  FilterSchema,

}
