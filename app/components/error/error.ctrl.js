'use strict';

/**
 * Dependencies
 */
let types = require('meanie-express-error-types');
let ReportedError = types.ReportedError;

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
