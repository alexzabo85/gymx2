var config = require('./../config/config');
var mongoose = require('mongoose');
var crypto = require('crypto');

const TextSchema = new mongoose.Schema({

  value: { type: String },

}, { _id: false, timestamps: true })

const EmailSchema = new mongoose.Schema({

  value: {
    type: String,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
}, { _id: false, timestamps: true })

const PhoneNumberSchema = new mongoose.Schema({

  value: {
    type: String,
    trim: true,
    match: [/^[0-9]{}$/, 'Please fill a valid phone number'],
  },
}, { _id: false, timestamps: true })


module.exports = {
  Product: mongoose.model('Product', ProductSchema),
  VotesColSchema,
  FilterSchema
  // AgeGenderPyramid: mongoose.model('AgeGenderPyramid', AgeGenderPyramidSchema),
}



