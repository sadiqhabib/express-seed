'use strict';

/**
 * Dependencies
 */
const chalk = require('chalk');
const ValidationError = require('mongoose').Error.ValidationError;

/**
 * Helper to log an error
 */
function logError(error) {
  if (!error) {
    return;
  }
  else if (error instanceof ValidationError) {
    logValidationError(error);
  }
  else if (error.stack) {
    console.log('\n' + chalk.red(error.stack));
  }
  else if (error.message) {
    console.log('\n' + chalk.red(error.message));
  }
  else {
    console.log('\n' + chalk.red(error));
  }
}

/**
 * Helper to log a validation error
 */
function logValidationError(error) {
  console.log('\n' + chalk.red(error.message));
  for (let property in error.errors) {
    if (error.errors.hasOwnProperty(property)) {
      let vError = error.errors[property];
      console.log(chalk.red('  -', property + ':', vError.message));
    }
  }
}

/**
 * Helper to log success
 */
function logSuccess(message) {
  if (message) {
    console.log(chalk.green(message));
  }
}

/**
 * Export interface
 */
module.exports = {
  success: logSuccess,
  error: logError,
};
