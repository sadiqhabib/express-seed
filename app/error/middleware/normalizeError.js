'use strict';

/**
 * Application dependencies
 */
let normalizeError = require('app/error/handlers/normalizeError.js');

/**
 * Module export
 */
module.exports = function(err, req, res, next) {
  normalizeError(err);
  next(err);
};
