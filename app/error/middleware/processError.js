'use strict';

/**
 * Dependencies
 */
let UnauthenticatedError = require('../types/unauthenticatedError');
let config = require('../../config');

/**
 * Constants
 */
const REFRESH_TOKEN_COOKIE_SECURE = config.REFRESH_TOKEN_COOKIE_SECURE;

/**
 * Module export
 */
module.exports = function(err, req, res, next) {
  next = next || null;

  //For any unauthenticated error, clear the refresh token cookie
  //unless we were requesting secure status
  if (err instanceof UnauthenticatedError && !req.body.secureStatus) {
    res.clearCookie('refreshToken', {
      secure: REFRESH_TOKEN_COOKIE_SECURE,
      httpOnly: true
    });
  }

  //Next middleware
  next(err);
};
