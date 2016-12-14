'use strict';

/**
 * Dependencies
 */
const chalk = require('chalk');
const log = require('./log');

/**
 * Helpers to output status messages
 */
function statusStart(message, file) {
  process.stdout.write(chalk.grey(message + ' ' + file + '... '));
}
function statusOk() {
  process.stdout.write(chalk.green('✓\n'));
}
function statusError(error) {
  process.stdout.write(chalk.red('✗\n'));
  log.error(error);
}

/**
 * Export interface
 */
module.exports = {
  start: statusStart,
  ok: statusOk,
  error: statusError,
};
