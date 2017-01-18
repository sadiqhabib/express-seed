'use strict';

/**
 * Dependencies
 */
const passport = require('passport');
const RefreshStrategy = require('meanie-passport-refresh-strategy');
const validateToken = require('../helpers/validate-token');
const findUserByClaims = require('../helpers/find-user-by-claims');

/**
 * Refresh token strategy
 */
module.exports = function() {
  passport.use(new RefreshStrategy((refreshToken, cb) => {
    validateToken(refreshToken)
      .then(findUserByClaims)
      .then(([user, claims]) => cb(null, user, claims))
      .catch(cb);
  }));
};
