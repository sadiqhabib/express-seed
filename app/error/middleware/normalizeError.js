'use strict';

/**
 * Dependencies
 */
let normalizeError = require('../handlers/normalizeError');

/**
 * Module export
 */
module.exports = function(err, req, res, next) {
  normalizeError(err);
  next(err);
};
