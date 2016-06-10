'use strict';

/**
 * Dependencies
 */
let chalk = require('chalk');
let ValidationError = require('../type/client/validation');

/**
 * Module export
 */
module.exports = function(error, req, res, next) {

  //Log validation errors differently
  if (error instanceof ValidationError && error.data && error.data.fields) {
    console.log(chalk.red(
      error.name + (error.message ? (': ' + error.message) : '')
    ));
    let fields = error.data.fields;
    for (let field in fields) {
      if (fields.hasOwnProperty(field)) {
        console.log(chalk.red('  - ', field + ':', fields[field].message));
      }
    }
  }

  //Log stack if present
  else if (error.stack) {
    console.log(chalk.red(error.stack));
  }

  //Log error name and code
  else {
    console.log(chalk.red(
      error.name + (error.message ? (': ' + error.message) : '')
    ));
  }

  //Call next middleware
  next(error);
};
