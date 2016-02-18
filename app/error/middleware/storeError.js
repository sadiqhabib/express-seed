'use strict';

/**
 * Dependencies
 */
let storeError = require('../handlers/storeError');

/**
 * Module export
 */
module.exports = function(err, req, res, next) {
  storeError(err, req);
  next(err);
};
