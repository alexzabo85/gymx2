var config = require('./../config/config');
var mongoose = require('mongoose');
let sha3 = require('js-sha3');
var txLib = require('./../helpers/tx.lib');

const userDbConnection = mongoose.createConnection(config.mongoUris[config.mongoNames.user]);
// const userDbConnection = await config.mongooseInit(mongoose, config.mongoUris[config.mongoNames.user])


const ClientSchema = new mongoose.Schema({

  profile: {},
  token: {},
  payload: {},

}, {
  timestamps: false,
  _id: true,
})

const Client = userDbConnection.model('Client', ClientSchema)

module.exports = Client
