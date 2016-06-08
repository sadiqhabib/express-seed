'use strict';

/**
 * Dependencies
 */
let fs = require('fs');
let config = require('../../config');

/**
 * Error types
 */
let ValidationError = require('../type/client/validation');
let NotAuthenticatedError = require('../type/auth/not-authenticated');
let UserSuspendedError = require('../type/auth/user-suspended');
let ExpiredTokenError = require('../type/client/expired-token');

/**
 * Constants
 */
const APP_NAME = config.APP_NAME;
const APP_VERSION = config.APP_VERSION;
const LOG_PATH = config.GCLOUD_LOG_PATH;
const LOG_FILE = config.GCLOUD_LOG_FILE;

/**
 * Module export
 */
module.exports = function(error, req, res, next) {

  //Skip certain errors
  if (
    error instanceof ValidationError ||
    error instanceof NotAuthenticatedError ||
    error instanceof UserSuspendedError ||
    error instanceof ExpiredTokenError
  ) {
    return next(error);
  }

  //Create error data for log file
  let data = {
    eventTime: Date.now(),
    serviceContext: {
      service: APP_NAME,
      version: APP_VERSION
    },
    message: error.stack,
    context: {
      httpRequest: {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
        remoteIp: req.ip
      },
      user: req.user ? req.user._id : ''
    }
  };

  //Write to log file
  fs.appendFile(LOG_PATH + LOG_FILE, JSON.stringify(data), () => {
    next(error);
  });
};
