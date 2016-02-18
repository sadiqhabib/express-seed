'use strict';

/**
 * Dependencies
 */
let types = require('../types');
let BaseError = types.BaseError;
let ServerError = types.ServerError;
let InternalError = types.InternalError;
let ValidationError = types.ValidationError;
let MongooseValidationError = types.MongooseValidationError;

/**
 * Module export
 */
module.exports = function(error) {

  //If this is not an object yet at this stage, create an error representation
  if (typeof error !== 'object') {
    error = new ServerError(String(error));
  }

  //Wrap internal errors
  if (isInternalError(error)) {
    error = new InternalError(error);
  }

  //Convert mongoose validation errors
  if (error instanceof MongooseValidationError) {
    error = new ValidationError(error);
  }

  //Still not an instance of BaseError at this stage?
  if (!(error instanceof BaseError)) {
    error = new BaseError(error);
  }

  //Ensure that error.message is enumerable (it is not by default)
  Object.defineProperty(error, 'message', {
    enumerable: true
  });
};

/**
 * Check if internal error
 */
function isInternalError(error) {
  if (error instanceof EvalError) {
    return true;
  }
  if (error instanceof TypeError) {
    return true;
  }
  if (error instanceof RangeError) {
    return true;
  }
  if (error instanceof ReferenceError) {
    return true;
  }
  if (error instanceof SyntaxError) {
    return true;
  }
  if (error instanceof URIError) {
    return true;
  }
  return false;
}
