'use strict';

/**
 * Dependencies
 */
let ClientError = require('./clientError');
const NOT_AUTHENTICATED = require('../codes').notAuthenticated;

/**
 * Constructor
 */
function UnauthenticatedError(code, message) {
  if (code) {
    this.code = code;
  }
  message = message || 'Not authenticated';
  ClientError.call(this, message, 401);
}

/**
 * Extend prototype
 */
UnauthenticatedError.prototype = Object.create(ClientError.prototype);
UnauthenticatedError.prototype.constructor = UnauthenticatedError;
UnauthenticatedError.prototype.name = 'UnauthenticatedError';
UnauthenticatedError.prototype.code = NOT_AUTHENTICATED;

//Export
module.exports = UnauthenticatedError;
