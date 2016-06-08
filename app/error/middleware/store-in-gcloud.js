'use strict';

/**
 * Dependencies
 */
let chalk = require('chalk');
let gcloud = require('../../services/gcloud');
let config = require('../../config');
let replaceDotPaths = require('../../helpers/replace-dot-paths');

/**
 * Constants
 */
const BASE_PATH = config.API_BASE_PATH;

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

  //Replace url base path
  if (BASE_PATH) {
    url = url.replace(BASE_PATH, '');
  }

  //Create error data
  let data = [
    {
      name: 'timestamp',
      value: timestamp
    },
    {
      name: 'name',
      value: name
    },
    {
      name: 'code',
      value: code
    },
    {
      name: 'message',
      value: message,
      excludeFromIndexes: true
    },
    {
      name: 'stack',
      value: stack,
      excludeFromIndexes: true
    },
    {
      name: 'url',
      value: url
    },
    {
      name: 'user',
      value: user
    }
  ];

  //Get datastore and generate key
  let datastore = gcloud.datastore();
  let key = datastore.key('error');

  //Create entity
  datastore.save({
    key, data
  }, error => {
    if (error) {
      console.log(chalk.yellow('Error trying to store error in cloud:'));
      console.log(chalk.yellow(error));
    }
  });

  //Call next middleware if given
  if (next) {
    next(error);
  }
};
