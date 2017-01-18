'use strict';

/**
 * Dependencies
 */
const jwt = require('meanie-express-jwt-service');
const ensureTokenUnused = require('./ensure-token-unused');

/**
 * Validate token
 */
module.exports = function validateToken(token) {

  //No token
  if (!token) {
    return Promise.resolve(false);
  }

  //Validate
  return jwt
    .validate(token)
    .then(ensureTokenUnused);
};
