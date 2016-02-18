'use strict';

/**
 * Dependencies
 */
let ServerError = require('../types/serverError');
let InternalError = require('../types/internalError');
let ValidationError = require('../types/validationError');
let MongooseValidationError = require('mongoose').Error.ValidationError;

/**
 * Check if internal error
 */
function isInternalError(err) {
  if (err instanceof EvalError) {
    return true;
  }
  if (err instanceof TypeError) {
    return true;
  }
  if (err instanceof RangeError) {
    return true;
  }
  if (err instanceof ReferenceError) {
    return true;
  }
  if (err instanceof SyntaxError) {
    return true;
  }
  if (err instanceof URIError) {
    return true;
  }
  return false;
}

/**
 * Module export
 */
module.exports = function(err) {

  //If this is not an object, create an error representation
  if (typeof err !== 'object') {
    err = new ServerError(String(err));
  }

  //Internal errors
  if (isInternalError(err)) {
    err = new InternalError(err);
  }

  //Mongoose validation error
  if (err instanceof MongooseValidationError) {
    err = new ValidationError(err);
  }

  //Must have code
  if (!err.code) {
    console.log(err);
    err = new InternalError(err);
  }

  //If this error does not have a response conversion method, create
  //generic server error
  if (typeof err.toResponse !== 'function') {
    err = new ServerError(err.code, err.message, err.data, 500);
  }

  //Ensure that err.message is enumerable (it is not by default)
  Object.defineProperty(err, 'message', {
    enumerable: true
  });
};
