'use strict';

/**
 * Dependencies
 */
let normalizeError = require('../handlers/normalizeError');

/**
 * Module export
 */
module.exports = function(error, req, res, next) {
  normalizeError(error);
  next(error);
};
