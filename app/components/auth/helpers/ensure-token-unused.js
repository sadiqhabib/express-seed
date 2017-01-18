'use strict';

/**
 * Dependencies
 */
const jwt = require('meanie-express-jwt-service');
const ExpiredTokenError = jwt.ExpiredTokenError;
const mongoose = require('mongoose');
const UsedToken = mongoose.model('UsedToken');

/**
 * Ensure a token hasn't already been used (if one time token)
 */
module.exports = function ensureTokenUnused(claims) {

  //Check if used
  return UsedToken
    .checkIfUsed(claims)
    .then(used => {

      //Already used
      if (used) {
        throw new ExpiredTokenError('Already used');
      }

      //Pass through claims
      return claims;
    });
};
