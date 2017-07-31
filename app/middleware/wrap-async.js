'use strict';

/**
 * Helper middleware to wrap async functions
 */
module.exports = function wrapAsync(fn) {
  return function(req, res, next) {
    Promise
      .resolve(fn(req, res, next))
      .catch(error => next(error));
  };
};
