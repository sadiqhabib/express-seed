'use strict';

/**
 * Dependencies
 */
const chalk = require('chalk');
const log = require('./log');

/**
 * Export interface
 */
module.exports = {

  /**
   * Start message
   */
  start(message, file) {
    process.stdout.write(chalk.grey(message + ' ' + file + '... '));
  },

  /**
   * Success outcome
   */
  ok() {
    process.stdout.write(chalk.green('✓\n'));
  },

  /**
   * Error outcome
   */
  error(error) {
    process.stdout.write(chalk.red('✗\n'));
    log.error(error);
  },
};
