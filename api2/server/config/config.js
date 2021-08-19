const txLib = require('../helpers/tx.lib');
// const mongoose = require('mongoose');

const mongooseInit = async (mongoose, mongoUri) => {

  mongoose.pluralize(null);

  mongoose.set('debug', false);

  mongoose.set('autoIndex', true);

  mongoose.Promise = Promise

  // return mongoose.createConnection(mongoUri, {
  //   useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useUnifiedTopology: true,
  //   autoIndex: true,
  //   useFindAndModify: false
  // });

}

// const mongooseInitial = () => {
// config.mongoUris.forEach(async (uri, idx) => {
//   config.mongoDbs[idx] = await mongooseInit(mongooseInit(mongoose, uri))
// })
// }

let config = {

  txLib,

  txStatus: {
    pending: 'pending',
    accept: 'accept',
    deny: 'deny',
  },

  filterTypes: {
    agl: 'AGL'
  },

  productMode: {
    private: 'private',
    public: 'public',
  },

  genderTypes: {
    male: 'male',
    female: 'female',
    other: 'other',
  },

  userAuth: {
    email: 'e@e.e',
    password: 'eeeeee',
  },

  env: process.env.NODE_ENV || 'development',

  port: process.env.PORT || 3000,

  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",

  mongoDbs: [],

  mongoNames: {
    user: 0,
    product: 1,
    account: 2,
  },

  mongoUris: [
    `mongodb://${(process.env.IP || 'localhost')}:${(process.env.MONGO_PORT || '27017')}/LNX_USER`,
    `mongodb://${(process.env.IP || 'localhost')}:${(process.env.MONGO_PORT || '27017')}/LNX_PRODUCT`,
    `mongodb://${(process.env.IP || 'localhost')}:${(process.env.MONGO_PORT || '27017')}/LNX_ACCOUNT`,
  ],

  mongooseInit,

  mongoDropDb: async () => { await mongoose.connection.db.dropDatabase() },

  stripe_connect_test_client_id: 'YOUR_stripe_connect_test_client',
  stripe_test_secret_key: 'YOUR_stripe_test_secret_key',
  stripe_test_api_key: 'YOUR_stripe_test_api_key'

}

// export default config
module.exports = config;
