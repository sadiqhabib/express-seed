'use strict';

/**
 * Dependencies
 */
const passport = require('passport');
const RefreshStrategy = require('meanie-passport-refresh-strategy');
const jwt = require('meanie-express-jwt-service');
const InvalidTokenError = jwt.InvalidTokenError;
const User = require('../../user/user.service');

/**
 * Refresh token strategy
 */
module.exports = function() {
  passport.use(new RefreshStrategy((refreshToken, cb) => {

    //No refresh token?
    if (!refreshToken) {
      return cb(null, false);
    }

    //Validate token
    jwt.validate('refresh', refreshToken)
      .then(User.findByTokenPayload)
      .then(user => {
        if (!user) {
          throw new InvalidTokenError('No matching user found');
        }
        return cb(null, user);
      })
      .catch(cb);
  }));
};
