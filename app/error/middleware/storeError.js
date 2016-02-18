'use strict';

/**
 * Dependencies
 */
let storeError = require('../handlers/storeError');

/**
 * Module export
 */
module.exports = function(error, req, res, next) {
  storeError(error, req);
  next(error);
};
