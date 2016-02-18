'use strict';

/**
 * Dependencies
 */
let types = require('../types');
let config = require('../../config');
let UnauthenticatedError = types.UnauthenticatedError;

/**
 * Constants
 */
const REFRESH_TOKEN_COOKIE_SECURE = config.REFRESH_TOKEN_COOKIE_SECURE;

/**
 * Module export
 */
module.exports = function(error, req, res, next) {
  next = next || null;

  //For any unauthenticated error, clear the refresh token cookie
  //unless we were requesting secure status
  if (error instanceof UnauthenticatedError && !req.body.secureStatus) {
    res.clearCookie('refreshToken', {
      secure: REFRESH_TOKEN_COOKIE_SECURE,
      httpOnly: true
    });
  }

  //Next middleware
  next(error);
};
