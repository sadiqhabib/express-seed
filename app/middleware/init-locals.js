'use strict';

/**
 * Initialize locals on the req object rather than res, so we don't need to
 * pass both to our services and helpers.
 */
module.exports = function(req, res, next) {
  req.locals = req.locals || {};
  next();
};
