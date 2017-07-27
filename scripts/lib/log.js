'use strict';

/**
 * Dependencies
 */
const chalk = require('chalk');
const ValidationError = require('mongoose').Error.ValidationError;

/**
 * Helper to log a validation error
 */
function logValidationError(error) {
  console.log('\n' + chalk.red(error.message));
  for (const property in error.errors) {
    if (error.errors.hasOwnProperty(property)) {
      const v = error.errors[property];
      console.log(chalk.red('  -', property + ':', v.message));
    }
  }
}

/**
 * Export interface
 */
module.exports = {

  /**
   * Log success message
   */
  success(message) {
    if (message) {
      console.log(chalk.green(message));
    }
  },

  /**
   * Log error
   */
  error(error) {
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
  },
};
