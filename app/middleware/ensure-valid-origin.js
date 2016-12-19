'use strict';

/**
 * Dependencies
 */
const errors = require('meanie-express-error-handling');
const NotAuthorizedError = errors.NotAuthorizedError;

/**
 * Ensure request is coming from a valid origin
 */
module.exports = function ensureValidOrigin(req, res, next) {

  //Get app origins
  const origins = req.app.locals.APP_ORIGINS;
  const origin = req.headers.origin || req.headers.referer;

  //If nothing there, all good
  if (!Array.isArray(origins) || origins.length === 0) {
    return next();
  }

  //If no origin, disallow
  if (!origin) {
    return next(new NotAuthorizedError('Anonymous origin not allowed'));
  }

  //Check if matches something
  if (!origins.some(pattern => origin.match(pattern))) {
    return next(new NotAuthorizedError('Invalid origin'));
  }

  //All good
  next();
};
