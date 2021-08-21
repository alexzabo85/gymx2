const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('../../config/config');

const userDbConnection =
  mongoose.createConnection(config.mongoUris[config.mongoNames.user],
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      autoIndex: true,
      useFindAndModify: false
    });
// const userDbConnection = config.mongooseInit(mongoose, config.mongoUris[config.mongoNames.user])


// const followSchema = new mongoose.Schema({

// }, { timestamps: true })


// const Follow = mongoose.model('Follow', Schema({
//   follower: { type: ObjectId, ref: 'User' },
//   followee: { type: ObjectId, ref: 'User' }
// }));


const UserSchema = new mongoose.Schema({

  id: {
    type: String,
    default: "auth0|611ce9c2acf16a0071af5112"
  },


  uid: {
    type: String,
    default: "auth0|611ce9c2acf16a0071af5112"
  },


  publisher: {
    type: Boolean,
    default: false
  },

  keyPairs: {
    type: [{}],
    default: []
  },

  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },

  gender: {
    type: String,
    enumm: ['male', 'female', 'other'],
    required: 'gender is required'
  },

  height: {
    type: Number,
    default: -1,
  },

  weight: {
    type: Number,
    default: -1,
  },

  programDetails: {
    type: {
      type: String,
      default: "MS/AB"
    },
    start: { type: Date },
    end: { type: Date },
    // default: {},
  },

  programSession: [
    [
      {
        muscle: {
          type: String,
          enumm: ['Chest', 'Back', 'other'],
          default: "_"
        },
        device: {
          type: String,
          default: "Device D0"
        },
        intensity: {
          type: Number,
          min: 0,
          default: 0
        },
        pattern: {
          type: String,
          default: "AxB"
        },
        note: {
          type: String,
          maxlength: 140,
          default: ""
        },
      },
    ],
  ],

  birthDay: {
    type: Date,
    required: 'Birth date is required'
  },

  origin: {
    type: String,
    default: '0-0-0-0'
  },

  address: {
    type: String,
    default: '0-0-0-0'
  },

  langages: {
    type: [String],
  },

  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required'
  },

  hashed_password: {
    type: String,
    required: 'Password is required'
  },

  salt: String,

}, { timestamps: true })



UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

// UserSchema.virtual('followers', {
//   ref: 'Follow',
//   localField: '_id',
//   foreignField: 'followee'
// });


UserSchema.path('hashed_password').validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null)

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },
  getYearsOld: function () {
    const msInYear = 31556952000
    return Math.floor((Date.now() - this.birthDay) / msInYear)
  },
  isLocatedAt: function (location) {
    return this.address === location
  },
  isLocatedAt: function (location) {
    return this.address === location
  },

}

module.exports = {
  Org: userDbConnection.model('User', UserSchema)
}