'use strict';

/**
 * Module export
 */
module.exports = function(err, req, res, next) {
  next = next || null;
  let errResponse;
  if (typeof err.toResponse === 'function') {
    errResponse = err.toResponse();
  }
  else {
    errResponse = err;
  }
  return res.status(err.status || 500).json(errResponse);
};
