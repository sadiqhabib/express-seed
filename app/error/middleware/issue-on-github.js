'use strict';

/**
 * Dependencies
 */
let github = require('../../services/github');
let errorHandler = require('../handler');

/**
 * Module export
 */
module.exports = function(error, req, res, next) {

  //Skip trivial errors
  if (error.isTrivial) {
    return next(error);
  }

  //Get context
  let {
    user, userAgent,
    serverVersion, serverUrl,
    clientVersion, clientUrl
  } = error.context;

  //Prepare labels and title
  let labels = ['error', error.isClientOriginated ? 'client' : 'server'];
  let title = error.message;

  //Initialize body parts
  let parts = [];

  //Context
  parts.push('\n### Context');
  parts.push('Server version: **' + serverVersion + '**');
  parts.push('Server URL: `' + serverUrl + '`');
  parts.push('Client version: **' + clientVersion + '**');
  parts.push('Client URL: `' + clientUrl + '`');

  //User data
  if (user) {
    parts.push('User: `' + user.id + '`');
  }

  //User agent
  if (userAgent) {
    parts.push('\n### User agent');
    parts.push('`' + userAgent + '`');
  }

  //Stack trace
  if (error.stack) {
    parts.push('\n### Stack trace');
    parts.push('```');
    parts.push(error.stack);
    parts.push('```');
  }

  //Create body from body parts
  let body = parts.join('\n');

  //Create issue
  github.issues.create({title, body, labels})
    .catch(errorHandler)
    .finally(() => next(error));
};
