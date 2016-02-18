'use strict';

/**
 * Dependencies
 */
let mongoose = require('mongoose');

/**
 * Module export
 */
module.exports = function(err, req) {

  //Create error data
  let data = {
    name: err.name || 'UnknownError',
    code: err.code || '',
    message: err.message || '',
    data: err.data || null,
    stack: err.stack || null,
    request: req ? {
      url: req.baseUrl,
      body: req.body
    } : null,
    user: req.user ? req.user._id : null
  };

  //Save in database
  mongoose.model('Error').create(data);
};
