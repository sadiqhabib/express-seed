'use strict';

/**
 * Dependencies
 */
let passport = require('passport');
let BearerStrategy = require('passport-http-bearer').Strategy;
let types = require('meanie-express-error-types');
let InvalidTokenError = types.InvalidTokenError;
let tokens = require('../../services/tokens');
let User = require('../../services/user');

/**
 * Bearer strategy
 */
module.exports = function() {
  passport.use(new BearerStrategy((accessToken, cb) => {
    tokens.validate('access', accessToken)
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
