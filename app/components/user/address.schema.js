'use strict';

/**
 * Dependencies
 */
const Schema = require('mongoose').Schema;

/**
 * Address schema
 */
const AddressSchema = new Schema({
  inputValue: String,
  streetNumber: String,
  streetName: String,
  suburb: String,
  postalCode: String,
  city: String,
  country: String,
}, {
  _id: false,
});

/**
 * Parts
 */
AddressSchema.virtual('parts').get(function() {
  const parts = [];
  if (this.streetNumber && this.streetName) {
    parts.push(this.streetNumber + ' ' + this.streetName);
  }
  if (this.suburb) {
    parts.push(this.suburb);
  }
  if (this.city) {
    if (this.postalCode) {
      parts.push(this.city + ' ' + this.postalCode);
    }
    else {
      parts.push(this.city);
    }
  }
  if (this.country) {
    parts.push(this.country);
  }
  return parts;
});

/**
 * Export schema
 */
module.exports = AddressSchema;
