'use strict';

/**
 * Dependencies
 */
const passport = require('passport');
const moment = require('moment');
const mongoose = require('mongoose');
const jwt = require('meanie-express-jwt-service');
const errors = require('meanie-express-error-handling');
const UsedToken = mongoose.model('UsedToken');
const ObjectId = mongoose.Types.ObjectId;
const ServerError = errors.ServerError;
const NotAuthenticatedError = errors.NotAuthenticatedError;
const NotAuthorizedError = errors.NotAuthorizedError;
const BadRequestError = errors.BadRequestError;

/**
 * Auth controller
 */
module.exports = {

  /**
   * Clear refresh token
   */
  forget(req, res) {

    //Get locals
    const API_BASE_PATH = req.app.locals.API_BASE_PATH;

    //Clear cookie
    res.clearCookie('refresh_token', {
      secure: req.secure,
      httpOnly: true,
      path: API_BASE_PATH + '/auth/token',
    });
    res.end();
  },

  /**
   * Token request handler
   */
  token(req, res, next) {

    //Get grant type and secure status
    const grantType = req.body.grant_type || req.body.grantType;
    const secureStatus = req.body.secure_status || req.body.secureStatus;

    //Check if we wanted to be remembered
    let remember = !!req.body.remember;

    /**
     * Callback handler (TODO split logic, getting too complex)
     */
    function authCallback(error, user, claims) {

      //Error given?
      if (error) {
        return next(new NotAuthenticatedError(error));
      }

      //No user found?
      if (!user) {
        return next(new NotAuthenticatedError());
      }

      //Get claims
      const payload = user.getClaims();

      //Requesting secure status?
      if (secureStatus && grantType === 'password') {
        const exp = req.app.locals.SECURE_STATUS_EXPIRATION;
        payload.secureStatus = moment().add(exp, 'seconds').toJSON();
      }

      //Generate access token
      const expiration = req.app.locals.TOKEN_EXP_ACCESS;
      const accessToken = jwt.generate(payload, expiration);

      //Refresh token grant type
      if (grantType === 'refresh_token') {

        //Invalidate one time use refresh token
        UsedToken.markAsUsed(claims)
          .catch(error => errors.handler(error, req));

        //Set remember flag so a new refresh token cookie gets generated
        remember = true;
      }

      //Generate refresh token if we want to be remembered
      if (remember) {

        //Get locals
        const COOKIE_MAX_AGE = req.app.locals.REFRESH_TOKEN_COOKIE_MAX_AGE;
        const API_BASE_PATH = req.app.locals.API_BASE_PATH;

        //Create refresh token and set cookie
        const id = new ObjectId();
        const payload = Object.assign(user.getClaims(), {
          id: id.toString(),
          once: true,
          scope: '',
        });
        const expiration = req.app.locals.TOKEN_EXP_REFRESH;
        const refreshToken = jwt.generate(payload, expiration);
        res.cookie('refresh_token', refreshToken, {
          maxAge: COOKIE_MAX_AGE * 1000, //in ms
          secure: req.secure,
          httpOnly: true,
          path: API_BASE_PATH + '/auth/token',
        });
      }

      //Send response
      return res.send({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: expiration,
      });
    }

    //Handle specific grant types
    switch (grantType) {
      case 'password':
        passport.authenticate('local', authCallback)(req, res, next);
        break;
      case 'refresh_token':
        passport.authenticate('refresh', authCallback)(req, res, next);
        break;
      default:
        next(new BadRequestError('Invalid grant type'));
        break;
    }
  },

  /**************************************************************************
   * Middleware
   ***/

  /**
   * Ensure a user is authenticated and has specific roles
   */
  ensureAuthenticated(...roles) {
    return function(req, res, next) {

      //Get claims
      const claims = req.claims;
      if (!claims) {
        return next(new NotAuthenticatedError());
      }

      //Check roles
      if (roles.length && !roles.some(role => claims.roles.includes(role))) {
        return next(new NotAuthorizedError('Invalid role'));
      }

      //All good
      next();
    };
  },

  /**
   * Ensure we have proper scope in our claims
   */
  ensureScope(...scopes) {
    return function(req, res, next) {

      //Get claims
      const claims = req.claims;
      if (!claims) {
        return next(new NotAuthenticatedError());
      }

      //Must have scope
      if (!claims.scope) {
        return next(new NotAuthorizedError('No scope'));
      }

      //Get user scopes and check scopes
      //Combine and split given scopes in case provided as string or params
      const claimed = claims.scope.split(' ');
      const checked = scopes.join(' ').split(' ');

      //Check if we have a match
      const match = checked.some(scope => claimed.includes(scope));
      if (!match) {
        return next(new NotAuthorizedError('Insufficient scope'));
      }

      //All good
      next();
    };
  },

  /**
   * Belongs to check
   */
  belongsTo(itemKey, ownerKey, propKey, roles) {

    //Array given as prop key, assume roles
    if (Array.isArray(propKey)) {
      roles = propKey;
      propKey = undefined;
    }

    //Guess prop key if not given
    if (typeof propKey === 'undefined') {
      switch (ownerKey) {
        case 'me':
          propKey = 'user';
          break;
      }
    }

    //Still no prop key?
    if (!propKey) {
      throw new Error('Missing prop key and unknown owner key');
    }

    //Return middleware
    return function(req, res, next) {

      //Get data
      const claims = req.claims;
      const owner = req[ownerKey];
      const item = req[itemKey];

      //Check roles if given
      if (roles && roles.some(role => claims.roles.includes(role))) {
        return next();
      }

      //Must have owner
      if (typeof owner === 'undefined') {
        return next(new ServerError(
          `Owner of type ${ownerKey} has not been loaded`
        ));
      }

      //Must have item
      if (typeof item === 'undefined') {
        return next(new ServerError(
          `Item of type ${itemKey} has not been loaded`
        ));
      }

      //Must have prop key
      if (typeof item[propKey] === 'undefined') {
        return next(new ServerError(
          `Item of type ${itemKey} has no ${propKey} property`
        ));
      }

      //Get ID
      const prop = item[propKey];
      let _id = prop;

      //If it's a populated object, check ID
      if (typeof prop === 'object' && prop._id instanceof ObjectId) {
        _id = prop._id;
      }

      //Compare
      if (!owner._id.equals(_id)) {
        return next(new NotAuthorizedError());
      }

      //All good
      next();
    };
  },
};
