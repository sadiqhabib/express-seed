'use strict';

/**
 * External dependencies
 */
let passport = require('passport');
let mongoose = require('mongoose');

/**
 * Application dependencies
 */
let RefreshStrategy = require('app/auth/passport/refreshStrategy');
let tokens = require('app/shared/services/tokens');
let User = mongoose.model('User');

/**
 * Refresh token strategy
 */
module.exports = function() {

  //Use local strategy
  passport.use(new RefreshStrategy((refreshToken, cb) => {

    //No refresh token?
    if (!refreshToken) {
      return cb(null, false);
    }

    //Validate token
    tokens.validate('refresh', refreshToken)
      .then(payload => {
        if (!payload.id) {
          return cb(null, false, {
            error: 'INVALID_TOKEN'
          });
        }
        return User.findByIdAndPopulate(payload.id);
      })
      .then(user => {
        if (!user) {
          return cb(null, false, {
            error: 'INVALID_TOKEN'
          });
        }
        return cb(null, user);
      })
      .catch(error => {
        if (error.name === 'TokenExpiredError') {
          return cb(null, false, {
            error: 'EXPIRED_TOKEN'
          });
        }
        return cb(error);
      });
  }));
};
