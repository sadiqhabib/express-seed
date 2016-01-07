'use strict';

/**
 * External dependencies
 */
let chalk = require('chalk');

/**
 * Module export
 */
module.exports = function(err) {

  //Log stack or error name and message
  console.error(chalk.red(err.name), (err.message ? ':' : ''), err.message);
  if (err.stack) {
    console.error(err.stack);
  }

  //Validation error data
  if (err.name === 'ValidationError') {
    if (err.data && err.data.fields) {
      for (let field in err.data.fields) {
        if (err.data.fields.hasOwnProperty(field)) {
          console.error('  - ', err.data.fields[field].message);
        }
      }
    }
  }
};
