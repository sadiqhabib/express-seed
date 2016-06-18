'use strict';

/**
 * Module export
 */
module.exports = function(error, req, res, next) {
  next = next || null;

  //Headers already sent?
  if (res.headersSent) {
    return;
  }

  //Initialise data
  let json;
  let status = error.status || 500;

  //Check if we have a to JSON converter present
  if (typeof error.toJSON === 'function' && (json = error.toJSON())) {
    res.status(status).json(json);
  }
  else {
    res.status(status).end();
  }
};
