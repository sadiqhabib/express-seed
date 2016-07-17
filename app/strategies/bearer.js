'use strict';

/**
 * Dependencies
 */
let passport = require('passport');
let BearerStrategy = require('passport-http-bearer').Strategy;
let jwt = require('meanie-express-jwt-service');
let InvalidTokenError = jwt.InvalidTokenError;
let User = require('../components/user/user.service');

/**
 * Bearer strategy
 */
module.exports = function() {
  passport.use(new BearerStrategy((accessToken, cb) => {
    jwt.validate('access', accessToken)
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
