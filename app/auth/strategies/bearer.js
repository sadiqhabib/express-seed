'use strict';

/**
 * External dependencies
 */
let passport = require('passport');
let BearerStrategy = require('passport-http-bearer').Strategy;

/**
 * Application dependencies
 */
let token = require('app/shared/token');
let User = require('app/user/user.model');

/**
 * Bearer strategy
 */
module.exports = function() {

  //Use local strategy
  passport.use(new BearerStrategy(function(accessToken, cb) {

    //Validate token
    token.validate('access', accessToken).then(function(payload) {

      //No ID?
      if (!payload.id) {
        return cb(null, false, {
          error: 'INVALID_TOKEN'
        });
      }

      //Find user by matching ID and access token
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
