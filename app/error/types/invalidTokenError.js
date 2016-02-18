'use strict';

/**
 * Dependencies
 */
let ClientError = require('./clientError');
const INVALID_TOKEN = require('../codes').invalidToken;

/**
 * Constructor
 */
function InvalidTokenError(message) {
  message = message || 'Invalid token';
  ClientError.call(this, message, 422);
}

/**
 * Extend prototype
 */
InvalidTokenError.prototype = Object.create(ClientError.prototype);
InvalidTokenError.prototype.constructor = InvalidTokenError;
InvalidTokenError.prototype.name = 'InvalidTokenError';
InvalidTokenError.prototype.code = INVALID_TOKEN;

//Export
module.exports = InvalidTokenError;
