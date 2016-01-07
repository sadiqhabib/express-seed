'use strict';

/**
 * External dependencies
 */
let passport = require('passport');

/**
 * Application dependencies
 */
let RefreshStrategy = require('app/auth/passport/refreshStrategy');
let tokenizer = require('app/shared/tokenizer');
let User = require('app/user/user.model');

/**
 * Refresh token strategy
 */
module.exports = function() {

  //Use local strategy
  passport.use(new RefreshStrategy(function(refreshToken, cb) {

    //No refresh token?
    if (!refreshToken) {
      return cb(null, false);
    }

    //Validate token
    tokenizer.validate('refresh', refreshToken).then(function(payload) {

      //No ID?
      if (!payload.id) {
        return cb(null, false, {
          error: 'INVALID_TOKEN'
        });
      }

      //Find user by matching ID
      User.findByIdAndPopulate(payload.id).then(function(user) {
        if (!user) {
          return cb(null, false, {
            error: 'INVALID_TOKEN'
          });
        }
        return cb(null, user);
      }, function(error) {
        return cb(error);
      });
    }, function(error) {
      if (error.name === 'TokenExpiredError') {
        return cb(null, false, {
          error: 'EXPIRED_TOKEN'
        });
      }
      return cb(error);
    });
  }));
};
