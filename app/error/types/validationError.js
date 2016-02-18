'use strict';

/**
 * Dependencies
 */
let MongooseValidationError = require('mongoose').Error.ValidationError;
let ClientError = require('./clientError');
const NOT_VALIDATED = require('../codes').notValidated;

/**
 * Constructor
 */
function ValidationError(code, data, message) {

  //Mongoose validation error fed?
  if (code instanceof MongooseValidationError) {
    let mongooseError = code;
    message = mongooseError.message;
    data = {fields: {}};
    for (let field in mongooseError.errors) {
      if (mongooseError.errors.hasOwnProperty(field)) {
        let error = mongooseError.errors[field];
        data.fields[field] = {
          type: error.kind,
          message: error.message
        };
      }
    }
  }

  //Set code if given
  else if (code) {
    this.code = code;
    message = message || 'Validation error';
  }

  //Call parent constructor
  ClientError.call(this, message, data, 422);
}

/**
 * Extend prototype
 */
ValidationError.prototype = Object.create(ClientError.prototype);
ValidationError.prototype.constructor = ValidationError;
ValidationError.prototype.name = 'ValidationError';
ValidationError.prototype.code = NOT_VALIDATED;

//Export
module.exports = ValidationError;
