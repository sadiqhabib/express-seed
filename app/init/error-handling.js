'use strict';

/**
 * Dependencies
 */
const raven = require('meanie-express-raven-service');
const config = require('../config');

//Increase stack trace limit for non production environments
if (config.ENV !== 'production') {
  Error.stackTraceLimit = Infinity;
}

//Use sentry
if (config.SENTRY_DSN) {
  raven(config.SENTRY_DSN, config.SENTRY_CONFIG);
}
