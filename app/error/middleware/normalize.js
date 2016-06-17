'use strict';

/**
 * Dependencies
 */
let BaseError = require('../type/base');
let ServerError = require('../type/server');
let InternalError = require('../type/internal');
let ValidationError = require('../type/client/validation');
let MongooseValidationError = require('mongoose').Error.ValidationError;
let config = require('../../config');

/**
 * Config
 */
const SERVER_VERSION = config.APP_VERSION;

/**
 * Module export
 */
module.exports = function(error, req, res, next) {

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
  if (!(error instanceof BaseError) && !error.isClientOriginated) {
    error = new BaseError(error);
  }

  //Ensure that error.message is enumerable (it is not by default)
  Object.defineProperty(error, 'message', {
    enumerable: true
  });

  //Add context to error
  error.context = error.context || {};
  error.context.user = req.me;
  error.context.userAgent = req.headers['user-agent'];
  error.context.clientVersion = req.headers['x-version'];
  error.context.serverVersion = SERVER_VERSION;
  error.context.serverUrl = req.originalUrl;

  //Call next middleware
  next(error);
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
