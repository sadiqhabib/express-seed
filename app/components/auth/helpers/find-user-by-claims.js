'use strict';

/**
 * Dependencies
 */
const jwt = require('meanie-express-jwt-service');
const InvalidTokenError = jwt.InvalidTokenError;
const UserService = require('../../user/user.service');

/**
 * Find user by claims
 */
module.exports = function findUserByClaims(claims) {

  //No claims
  if (!claims) {
    return Promise.resolve([false, null]);
  }

  //Find user
  return UserService
    .findByClaims(claims)
    .then(user => {
      if (!user) {
        throw new InvalidTokenError('No matching user');
      }
      return [user, claims];
    });
};
