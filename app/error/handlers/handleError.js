'use strict';

/**
 * Dependencies
 */
let normalizeError = require('./normalizeError');
let logError = require('./logError');
let storeError = require('./storeError');

/**
 * Module export
 */
module.exports = function(err, req) {
  normalizeError(err, req);
  logError(err, req);
  storeError(err, req);
};
