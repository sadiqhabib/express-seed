'use strict';

/**
 * Application dependencies
 */
let logError = require('app/error/handlers/logError.js');

/**
 * Module export
 */
module.exports = function(err, req, res, next) {
  logError(err);
  next(err);
};
