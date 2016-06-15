'use strict';

/**
 * Dependencies
 */
let ClientError = require('../client');

/**
 * Constructor
 */
function ExistsError(message, data) {
  message = message || 'Already exists';
  ClientError.call(this, message, data, 400);
}

/**
 * Extend prototype
 */
ExistsError.prototype = Object.create(ClientError.prototype);
ExistsError.prototype.constructor = ExistsError;
ExistsError.prototype.name = 'ExistsError';
ExistsError.prototype.code = 'EXISTS';

//Export
module.exports = ExistsError;
