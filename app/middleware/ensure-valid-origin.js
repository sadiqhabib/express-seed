'use strict';

/**
 * Dependencies
 */
const url = require('url');
const errors = require('meanie-express-error-handling');
const NotAuthorizedError = errors.NotAuthorizedError;

/**
 * Ensure request is coming from a valid origin
 */
module.exports = function ensureValidOrigin(req, res, next) {

  //Check if anything present
  if (!req.headers.origin && !req.headers.referer) {
    return next();
  }

  //Determine origin
  const ref = url.parse(req.headers.origin || req.headers.referer);
  const origin = ref.protocol + '//' + ref.host;
  const origins = req.app.locals.APP_ORIGINS;

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
    return next(new NotAuthorizedError('Invalid origin: ' + origin));
  }

  //Set domain in locals
  req.locals.origin = ref.hostname;

  //All good
  next();
};
