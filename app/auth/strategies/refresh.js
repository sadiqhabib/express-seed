'use strict';

/**
 * Dependencies
 */
let passport = require('passport');
let RefreshStrategy = require('../../plugins/passport/refresh-strategy');
let InvalidTokenError = require('../../error/type/client/invalid-token');
let tokens = require('../../services/tokens');
let User = require('../../services/user');

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
    tokens.validate('refresh', refreshToken)
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
