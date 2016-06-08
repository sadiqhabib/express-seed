'use strict';

/**
 * Dependencies
 */
let mongoose = require('mongoose');
let chalk = require('chalk');
let replaceDotPaths = require('../../helpers/replace-dot-paths');
let Schema = mongoose.Schema;

/**
 * Error schema
 */
let ErrorSchema = new Schema({
  timestamp: {
    type: Date
  },
  name: {
    type: String
  },
  code: {
    type: String
  },
  message: {
    type: String
  },
  stack: {},
  request: {},
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

/**
 * Define model
 */
let ErrorModel = mongoose.model('Error', ErrorSchema);

/**
 * Module export
 */
module.exports = function(error, req, res, next) {

  //Fix fields keys (can't contain dots in key)
  if (error.name === 'ValidationError') {
    if (error.data && error.data.fields) {
      replaceDotPaths(error.data.fields);
    }
  }

  //Collect data
  let timestamp = Date.now();
  let user = (req && req.user) ? req.user._id.toString() : null;
  let url = req ? req.originalUrl : '';
  let name = error.name || 'UnknownError';
  let code = error.code || '';
  let message = error.message || '';
  let stack = error.stack || '';

  //Create error data
  let data = {
    timestamp, name, code, message, stack, url, user
  };

  //Disable debugging for this operation
  let debug = mongoose.get('debug');
  if (debug) {
    mongoose.set('debug', false);
  }

  //Save in database and re-enable debug if needed
  ErrorModel.create(data)
    .then(() => {
      if (debug) {
        mongoose.set('debug', true);
      }
    })
    .catch(error => {
      console.log(chalk.yellow('Error trying to store error in DB:'));
      console.log(chalk.yellow(error));
    });

  //Call next middleware if given
  if (next) {
    next(error);
  }
};
