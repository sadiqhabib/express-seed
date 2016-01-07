'use strict';

/**
 * External dependencies
 */
let passport = require('passport');

/**
 * Application dependencies
 */
let User = require('app/user/user.model');
let UnauthenticatedError = require('app/error/types/unauthenticatedError');

/**
 * Module export
 */
module.exports = function(req, res, next) {

  //Authenticate now
  passport.authenticate('bearer', {
    session: false
  }, function(error, user) {

    //Check error
    if (error) {
      return next(error);
    }

    //No user found?
    if (!user) {
      return next(new UnauthenticatedError('INVALID_TOKEN', 'Invalid token'));
    }

    //User suspended?
    if (user.isSuspended) {
      return next(new UnauthenticatedError('USER_SUSPENDED'));
    }

    //Set user in request
    req.user = user;

    //Spoofing user?
    if (user.hasRole('admin') && req.headers['x-use-site-as']) {
      return User.findById(req.headers['x-use-site-as']).then(function(spoofUser) {
        if (spoofUser) {
          console.log('Spoofing as user:', req.headers['x-use-site-as']);
          req.user = spoofUser;
          req.user.addRole('admin');
        }
      }).finally(next);
    }

    //Just call next middleware
    next();
  })(req, res, next);
};
