'use strict';

/**
 * Dependencies
 */
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('meanie-express-jwt-service');
const InvalidTokenError = jwt.InvalidTokenError;
const User = require('../../user/user.service');

/**
 * Bearer strategy
 */
module.exports = function() {
  passport.use(new BearerStrategy((accessToken, cb) => {
    jwt.validate(accessToken)
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
