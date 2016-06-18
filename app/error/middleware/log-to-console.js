'use strict';

/**
 * Dependencies
 */
let chalk = require('chalk');
let ValidationError = require('../type/client/validation');
let ReportedError = require('../type/reported');

/**
 * Module export
 */
module.exports = function(error, req, res, next) {

  //Don't log reported errors
  if (error instanceof ReportedError) {
    return next(error);
  }

  //Log stack if present and if not trivial
  if (error.stack && !error.isTrivial) {
    console.log(chalk.red(error.stack));
  }

  //Log error name and message
  else {
    console.log(chalk.red(
      error.name + (error.message ? (': ' + error.message) : '')
    ));
  }

  //Log validation errors fields
  if (error instanceof ValidationError && error.data && error.data.fields) {
    let fields = error.data.fields;
    let lines = [];
    for (let field in fields) {
      if (fields.hasOwnProperty(field)) {
        let message = fields[field].message || fields[field].type;
        lines.push(chalk.red('  - ', field + ':', message));
      }
    }
    if (lines.length) {
      console.log(chalk.red('\nFields:'));
      lines.forEach(line => console.log(line));
    }
  }

  //Call next middleware
  next(error);
};
