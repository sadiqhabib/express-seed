'use strict';

/**
 * Dependencies
 */
let passport = require('passport');
let moment = require('moment');
let jwt = require('meanie-express-jwt-service');
let types = require('meanie-express-error-types');
let NotAuthenticatedError = types.NotAuthenticatedError;
let NotAuthorizedError = types.NotAuthorizedError;
let UserSuspendedError = types.UserSuspendedError;

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
      if (Number(match) === 0) {
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
    const COOKIE_SECURE = req.app.locals.REFRESH_TOKEN_COOKIE_SECURE;
    res.clearCookie('refreshToken', {
      secure: COOKIE_SECURE,
      httpOnly: true,
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

      //Check error
      if (error) {
        return next(error);
      }

      //Set user in request and get claims
      req.me = user;
      let claims = user.getClaims();

      //Requesting secure status?
      if (secureStatus && grantType === 'password') {
        const EXPIRATION = req.app.locals.SECURE_STATUS_EXPIRATION;
        claims.secureStatus = moment()
          .add(EXPIRATION, 'seconds')
          .toJSON();
      }

      //Generate access token
      let accessToken = jwt.generate('access', claims);

      //Generate refresh token if we want to be remembered
      if (remember) {

        //Get locals
        const COOKIE_MAX_AGE = req.app.locals.REFRESH_TOKEN_COOKIE_MAX_AGE;
        const COOKIE_SECURE = req.app.locals.REFRESH_TOKEN_COOKIE_SECURE;

        //Create refresh token and set cookie
        let refreshToken = jwt.generate('refresh', user.getClaims());
        res.cookie('refreshToken', refreshToken, {
          maxAge: COOKIE_MAX_AGE * 1000, //in ms
          secure: COOKIE_SECURE,
          httpOnly: true,
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
      session: false,
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
      session: false,
    }, (error, user) => {
      if (user) {
        req.me = user;
      }
      next();
    })(req, res, next);
  },
};
