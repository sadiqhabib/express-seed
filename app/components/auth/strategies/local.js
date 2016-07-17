'use strict';

/**
 * Dependencies
 */
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../../user/user.service');

/**
 * Local strategy
 */
module.exports = function() {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, (req, email, password, cb) => {

    //Find user by email
    User.findByEmailAndPassword(req, email, password)
      .then(user => {
        if (!user) {
          return cb(null, false);
        }
        return cb(null, user);
      })
      .catch(cb);
  }));
};
