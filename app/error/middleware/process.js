'use strict';

/**
 * Dependencies
 */
let NotAuthenticatedError = require('../type/auth/not-authenticated');
let ReportedError = require('../type/reported');
let config = require('../../config');

/**
 * Constants
 */
const REFRESH_TOKEN_COOKIE_SECURE = config.REFRESH_TOKEN_COOKIE_SECURE;

/**
 * Module export
 */
module.exports = function(error, req, res, next) {

  //Reported errors don't need to be sent back to the client, so we end
  //the response here for the error reporter
  if (error instanceof ReportedError) {
    return res.end();
  }

  //For any unauthenticated error, clear the refresh token cookie
  //unless we were requesting secure status
  if (error instanceof NotAuthenticatedError && !req.body.secureStatus) {
    res.clearCookie('refreshToken', {
      secure: REFRESH_TOKEN_COOKIE_SECURE,
      httpOnly: true
    });
  }

  //Next middleware
  next(error);
};
