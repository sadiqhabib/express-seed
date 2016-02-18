'use strict';

/**
 * Dependencies
 */
let chalk = require('chalk');
let types = require('../types');
let ValidationError = types.ValidationError;

/**
 * Module export
 */
module.exports = function(error) {

  //Log error name and code
  console.log(chalk.red(
    error.name + (error.code ? (' (' + error.code + ')') : '') +
    (error.message ? (': ' + error.message) : '')
  ));

  //Log validation error data
  if (error instanceof ValidationError && error.data && error.data.fields) {
    let fields = error.data.fields;
    for (let field in fields) {
      if (fields.hasOwnProperty(field)) {
        console.log(chalk.red('  - ', field + ':', fields[field].message));
      }
    }
  }

  //Log stack if present
  if (error.stack) {
    console.log(chalk.red(error.stack));
  }
};
