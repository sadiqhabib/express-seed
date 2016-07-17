'use strict';

/**
 * Dependencies
 */
let errors = require('meanie-express-error-handling');
let ReportedError = errors.ReportedError;

/**
 * Error controller
 */
module.exports = {

  /**
   * Report
   */
  report(req, res, next) {

    //Get data and prepare error
    let {message, stack, context} = req.body;
    let error = new ReportedError(message, stack, context);

    //Use express error middleware to handle it
    next(error);
  }
};
