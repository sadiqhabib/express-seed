'use strict';

/**
 * Dependencies
 */
var chalk = require('chalk');
var meanie = require('meanie-core');

/**
 * Load config
 */
var config = meanie.getConfig();

/**
 * Trigger warning if using default environment
 */
if (meanie.isUsingDefaultEnvironment()) {
  console.warn(chalk.yellow(
    'Environment not specified, using default environment `%s`.'
  ), config.env);
  console.info(chalk.grey(
    'To set your NODE_ENV, add "export NODE_ENV=development" to your bash profile,',
    'or run the application with the -env=environment flag.'
  ));
}

/**
 * Return config
 */
module.exports = config;
