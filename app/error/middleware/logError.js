'use strict';

/**
 * Dependencies
 */
let logError = require('../handlers/logError');

/**
 * Module export
 */
module.exports = function(error, req, res, next) {
  logError(error);
  next(error);
};
