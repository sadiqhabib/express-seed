'use strict';

/**
 * Dependencies
 */
let mongoose = require('mongoose');

/**
 * Module export
 */
module.exports = function(error, req) {

  //Create error data
  let data = {
    name: error.name || 'UnknownError',
    code: error.code || '',
    message: error.message || '',
    data: error.data || null,
    stack: error.stack || null,
    request: req ? {
      url: req.baseUrl,
      body: req.body
    } : null,
    user: req.user ? req.user._id : null
  };

  //Save in database
  mongoose.model('Error').create(data);
};
