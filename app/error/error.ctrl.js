'use strict';

/**
 * Dependencies
 */
let ReportedError = require('./type/reported');

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
