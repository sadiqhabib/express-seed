'use strict';

/**
 * Dependencies
 */
let passport = require('passport');
let RefreshStrategy = require('meanie-passport-refresh-strategy');
let jwt = require('meanie-express-jwt-service');
let InvalidTokenError = jwt.InvalidTokenError;
let User = require('../../user/user.service');

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
