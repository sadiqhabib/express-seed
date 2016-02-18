'use strict';

/**
 * External dependencies
 */
let passport = require('passport');

/**
 * Application dependencies
 */
let UnauthenticatedError = require('app/error/types/unauthenticatedError');

/**
 * Module export
 */
module.exports = function(req, res, next) {

  //Authenticate now
  passport.authenticate('bearer', {
    session: false
  }, (error, user) => {

    //Check error
    if (error) {
      return next(error);
    }

    //No user found?
    if (!user) {
      return next(new UnauthenticatedError('INVALID_TOKEN'));
    }

    //User suspended?
    if (user.isSuspended) {
      return next(new UnauthenticatedError('USER_SUSPENDED'));
    }

    //User pending approval?
    if (!user.isApproved) {
      return next(new UnauthenticatedError('USER_PENDING'));
    }

    //Set user in request
    req.user = user;

    //Call next middleware
    next();
  })(req, res, next);
};
