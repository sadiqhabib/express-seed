'use strict';

/**
 * Dependencies
 */
let ClientError = require('./clientError');
const BAD_REQUEST = require('../codes').badRequest;

/**
 * Constructor
 */
function BadRequestError(code, message, data) {
  if (code) {
    this.code = code;
  }
  message = message || 'Bad request';
  ClientError.call(this, message, data);
}

/**
 * Extend prototype
 */
BadRequestError.prototype = Object.create(ClientError.prototype);
BadRequestError.prototype.constructor = BadRequestError;
BadRequestError.prototype.name = 'BadRequestError';
BadRequestError.prototype.code = BAD_REQUEST;

//Export
module.exports = BadRequestError;
