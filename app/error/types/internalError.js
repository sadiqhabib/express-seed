'use strict';

/**
 * Dependencies
 */
let BaseError = require('./baseError');
const INTERNAL_ERROR = require('../codes').internalError;

/**
 * Constructor
 */
function InternalError(error) {
  BaseError.call(this, error);
}

/**
 * Extend prototype
 */
InternalError.prototype = Object.create(BaseError.prototype);
InternalError.prototype.constructor = InternalError;
InternalError.prototype.name = 'InternalError';
InternalError.prototype.code = INTERNAL_ERROR;

//Export
module.exports = InternalError;
