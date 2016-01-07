'use strict';

/**
 * Application dependencies
 */
let storeError = require('app/error/handlers/storeError.js');

/**
 * Module export
 */
module.exports = function(err, req, res, next) {
  storeError(err, req);
  next(err);
};
