'use strict';

/**
 * Dependencies
 */
let fs = require('fs');
let config = require('../../config');

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

  //Skip trivial errors
  if (error.isTrivial) {
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
      user: req.me ? req.me._id : ''
    }
  };

  //Write to log file
  fs.appendFile(LOG_PATH + LOG_FILE, JSON.stringify(data), () => {
    next(error);
  });
};
