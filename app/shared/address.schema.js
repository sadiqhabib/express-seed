'use strict';

/**
 * Dependencies
 */
let Schema = require('mongoose').Schema;

/**
 * Address schema
 */
let AddressSchema = new Schema({
  inputValue: String,
  streetNumber: String,
  streetName: String,
  suburb: String,
  postalCode: String,
  city: String,
  country: String
}, {
  _id: false
});

/**
 * Export schema
 */
module.exports = AddressSchema;
