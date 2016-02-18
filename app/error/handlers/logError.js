'use strict';

/**
 * Dependencies
 */
let chalk = require('chalk');

/**
 * Module export
 */
module.exports = function(err) {

  //Log stack or error name and message
  console.error(chalk.red(err.name), (err.message ? ':' : ''), err.message);
  if (err.code) {
    console.error(chalk.red(err.code));
  }
  if (err.stack) {
    console.error(err.stack);
  }

  //Validation error data
  if (err.name === 'ValidationError') {
    if (err.data && err.data.fields) {
      let fields = err.data.fields;
      for (let field in fields) {
        if (fields.hasOwnProperty(field)) {
          console.error(chalk.red('  - ', field + ':', fields[field].message));
        }
      }
    }
  }
};
