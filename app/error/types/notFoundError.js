'use strict';

/**
 * Module dependencies
 */
let ClientError = require('app/error/types/clientError');

/**
 * Error constructor
 */
function NotFoundError(code, message, data) {
  ClientError.call(this, code || 'NOT_FOUND', message, data, 404);
}

/**
 * Extend client error
 */
NotFoundError.prototype = Object.create(ClientError.prototype);
NotFoundError.prototype.constructor = NotFoundError;
NotFoundError.prototype.name = 'NotFoundError';

/**
 * Module export
 */
module.exports = NotFoundError;
