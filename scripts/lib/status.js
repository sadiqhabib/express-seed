'use strict';

/**
 * Dependencies
 */
let path = require('path');
let chalk = require('chalk');
let log = require('./log');

/**
 * Helpers to output status messages
 */
function statusStart(message, file) {
  process.stdout.write(chalk.grey(
    message + ' ' + path.basename(file) + '... '
  ));
}
function statusOk() {
  process.stdout.write(chalk.green('OK\n'));
}
function statusError(error) {
  process.stdout.write(chalk.red('ERROR\n'));
  log.error(error);
}
function statusSkip(reason) {
  process.stdout.write(chalk.yellow('SKIP\n'));
  if (reason) {
    console.warn(chalk.yellow(reason));
  }
}

/**
 * Export interface
 */
module.exports = {
  start: statusStart,
  ok: statusOk,
  error: statusError,
  skip: statusSkip
};
