'use strict';

/**
 * Application dependencies
 */
let normalizeError = require('app/error/handlers/normalizeError.js');
let logError = require('app/error/handlers/logError.js');
let storeError = require('app/error/handlers/storeError.js');

/**
 * Module export
 */
module.exports = function(err, req) {
  normalizeError(err, req);
  logError(err, req);
  storeError(err, req);
};
