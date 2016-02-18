'use strict';

/**
 * Dependencies
 */
let logError = require('../handlers/logError');

/**
 * Module export
 */
module.exports = function(err, req, res, next) {
  logError(err);
  next(err);
};
