'use strict';

/**
 * Module dependencies
 */
let ClientError = require('app/error/types/clientError');
let MongooseValidationError = require('mongoose').Error.ValidationError;

/**
 * Error constructor
 */
function ValidationError(code, data, message) {

  //Mongoose validation error fed?
  if (code instanceof MongooseValidationError) {
    let mve = code;
    message = mve.message;
    code = 'NOT_VALIDATED';
    data = {fields: {}};
    for (let field in mve.errors) {
      if (mve.errors.hasOwnProperty(field)) {
        let error = mve.errors[field];
        data.fields[field] = {
          type: error.kind,
          message: error.message
        };
      }
    }
  }

  //Call parent constructor
  ClientError.call(this, code, message, data, 422);
}

/**
 * Extend client error
 */
ValidationError.prototype = Object.create(ClientError.prototype);
ValidationError.prototype.constructor = ValidationError;
ValidationError.prototype.name = 'ValidationError';

/**
 * Module export
 */
module.exports = ValidationError;
