'use strict';

/**
 * External dependencies
 */
let chalk = require('chalk');

/**
 * Application dependencies
 */
let config = require('app/config');

/**
 * Configuration
 */
const SERVER_PORT = config.SERVER_PORT;

/**
 * Error handlers
 */
module.exports = function(err) {
  if (err.errno === 'EADDRINUSE') {
    console.error(chalk.red('Web server port %s is already in use'), SERVER_PORT);
  }
  else {
    console.error(chalk.red('Web server error:'));
    console.error(chalk.red(err));
  }
  process.exit(-1);
};
