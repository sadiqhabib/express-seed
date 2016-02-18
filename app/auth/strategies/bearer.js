'use strict';

/**
 * Dependencies
 */
let passport = require('passport');
let mongoose = require('mongoose');
let BearerStrategy = require('passport-http-bearer').Strategy;
let tokens = require('../../shared/services/tokens');
let User = mongoose.model('User');

/**
 * Bearer strategy
 */
module.exports = function() {

  //Use local strategy
  passport.use(new BearerStrategy((accessToken, cb) => {

    //Validate token
    tokens.validate('access', accessToken)
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
