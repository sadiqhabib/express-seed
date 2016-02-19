'use strict';

/**
 * Dependencies
 */
let passport = require('passport');
let mongoose = require('mongoose');
let BearerStrategy = require('passport-http-bearer').Strategy;
let InvalidTokenError = require('../../error/type/client/invalid-token');
let tokens = require('../../services/tokens');
let User = mongoose.model('User');

/**
 * Bearer strategy
 */
module.exports = function() {
  passport.use(new BearerStrategy((accessToken, cb) => {
    tokens.validate('access', accessToken)
      .then(tokens.getId)
      .then(id => User.findByIdAndPopulate(id))
      .then(user => {
        if (!user) {
          throw new InvalidTokenError('No matching user found');
        }
        return cb(null, user);
      })
      .catch(cb);
  }));
};
