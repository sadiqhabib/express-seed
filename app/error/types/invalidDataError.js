'use strict';

/**
 * Dependencies
 */
let ClientError = require('./clientError');
const INVALID_DATA = require('../codes').invalidData;

/**
 * Constructor
 */
function InvalidDataError(message) {
  message = message || 'Invalid data';
  ClientError.call(this, message, 422);
}

/**
 * Extend prototype
 */
InvalidDataError.prototype = Object.create(ClientError.prototype);
InvalidDataError.prototype.constructor = InvalidDataError;
InvalidDataError.prototype.name = 'InvalidDataError';
InvalidDataError.prototype.code = INVALID_DATA;

//Export
module.exports = InvalidDataError;
