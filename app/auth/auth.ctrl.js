'use strict';

/**
 * Dependencies
 */
let passport = require('passport');
let moment = require('moment');
let NotAuthenticatedError = require('../error/type/auth/not-authenticated');
let NotAuthorizedError = require('../error/type/auth/not-authorized');
let UserSuspendedError = require('../error/type/auth/user-suspended');
let UserPendingError = require('../error/type/auth/user-pending');
let tokens = require('../services/tokens');
let config = require('../config');

/**
 * Constants
 */
const REFRESH_TOKEN_COOKIE_MAX_AGE = config.REFRESH_TOKEN_COOKIE_MAX_AGE;
const REFRESH_TOKEN_COOKIE_SECURE = config.REFRESH_TOKEN_COOKIE_SECURE;
const SECURE_STATUS_EXPIRATION = config.SECURE_STATUS_EXPIRATION;

/**
 * To camel case
 */
function toCamelCase(str, ucfirst) {
  if (typeof str === 'number') {
    return String(str);
  }
  else if (typeof str !== 'string') {
    return '';
  }
  if ((str = String(str).trim()) === '') {
    return '';
  }
  return str
    .replace(/_+|\-+/g, ' ')
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (+match === 0) {
        return '';
      }
      return (index === 0 && !ucfirst) ?
        match.toLowerCase() : match.toUpperCase();
    });
}

/**
 * Auth controller
 */
module.exports = {

  /**
   * Verify authentication
   */
  verify(req, res) {
    res.end();
  },

  /**
   * Forget a user
   */
  forget(req, res) {
    res.clearCookie('refreshToken', {
      secure: REFRESH_TOKEN_COOKIE_SECURE,
      httpOnly: true
    });
    res.end();
  },

  /**
   * Token request handler
   */
  token(req, res, next) {

    //Get grant type and initialize access token
    let grantType = toCamelCase(req.body.grantType);
    let remember = !!req.body.remember;
    let secureStatus = !!req.body.secureStatus;

    /**
     * Callback handler
     */
    function authCallback(error, user) {

      //Error given?
      if (error) {
        error = new NotAuthenticatedError(error);
      }

      //No user found?
      else if (!user) {
        error = new NotAuthenticatedError();
      }

      //User suspended?
      else if (user.isSuspended) {
        error = new UserSuspendedError();
      }

      //User pending approval?
      else if (!user.isApproved) {
        error = new UserPendingError();
      }

      //Check error
      if (error) {
        return next(error);
      }

      //Set user in request and get claims
      req.me = user;
      let claims = user.getClaims();

      //Requesting secure status?
      if (secureStatus && grantType === 'password') {
        claims.secureStatus = moment()
          .add(SECURE_STATUS_EXPIRATION, 'seconds')
          .toJSON();
      }

      //Generate access token
      let accessToken = tokens.generate('access', claims);

      //Generate refresh token if we want to be remembered
      if (remember) {
        let refreshToken = tokens.generate('refresh', user.getClaims());
        res.cookie('refreshToken', refreshToken, {
          maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE * 1000, //in ms
          secure: REFRESH_TOKEN_COOKIE_SECURE,
          httpOnly: true
        });
      }

      //Send response
      return res.send({accessToken});
    }

    //Handle specific grant types
    switch (grantType) {
      case 'password':
        passport.authenticate('local', authCallback)(req, res, next);
        break;
      case 'refreshToken':
        passport.authenticate('refresh', authCallback)(req, res, next);
        break;
    }
  },

  /**************************************************************************
   * Middleware
   ***/

  /**
   * Ensure a user is an admin
   */
  ensureAdmin(req, res, next) {
    if (!req.me || !req.me.hasRole('admin')) {
      return next(new NotAuthorizedError());
    }
    next();
  },

  /**
   * Ensure a user is authenticated
   */
  ensureAuthenticated(req, res, next) {

    //Authenticate now
    passport.authenticate('bearer', {
      session: false
    }, (error, user) => {

      //Error given?
      if (error) {
        error = new NotAuthenticatedError(error);
      }

      //No user found?
      else if (!user) {
        error = new NotAuthenticatedError();
      }

      //User suspended?
      else if (user.isSuspended) {
        error = new UserSuspendedError();
      }

      //User pending approval?
      else if (!user.isApproved) {
        error = new UserPendingError();
      }

      //Check error
      if (error) {
        return next(error);
      }

      //Set user in request
      req.me = user;
      next();
    })(req, res, next);
  },

  /**
   * Check if a user is authenticated (doesn't throw errors if isn't)
   * Use this if authentication is optional for a route but you
   * need the authenticated user object if they are authenticated.
   */
  checkAuthenticated(req, res, next) {

    //Authenticate now
    passport.authenticate('bearer', {
      session: false
    }, (error, user) => {
      if (user) {
        req.me = user;
      }
      next();
    })(req, res, next);
  }
};
