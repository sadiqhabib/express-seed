'use strict';

/**
 * Dependencies
 */
let ClientError = require('./clientError');
const NOT_AUTHORIZED = require('../codes').notAuthorized;

/**
 * Constructor
 */
function UnauthorizedError(code, message) {
  if (code) {
    this.code = code;
  }
  message = message || 'Not authorized';
  ClientError.call(this, message, 403);
}

/**
 * Extend prototype
 */
UnauthorizedError.prototype = Object.create(ClientError.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;
UnauthorizedError.prototype.name = 'UnauthorizedError';
UnauthorizedError.prototype.code = NOT_AUTHORIZED;

//Export
module.exports = UnauthorizedError;
