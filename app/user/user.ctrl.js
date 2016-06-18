'use strict';

/**
 * Dependencies
 */
let mongoose = require('mongoose');
let NotFoundError = require('../error/type/client/not-found');
let BadRequestError = require('../error/type/client/bad-request');
let InvalidTokenError = require('../error/type/client/invalid-token');
let errorHandler = require('../error/handler');
let tokens = require('../services/tokens');
let mailer = require('../services/mailer');

/**
 * Emails
 */
let verifyEmailAddressEmail = require('./emails/verify-email-address');
let passwordHasChangedEmail = require('./emails/password-has-changed');
let resetPasswordEmail = require('./emails/reset-password');

/**
 * Models
 */
let User = mongoose.model('User');

/**
 * User controller
 */
module.exports = {

  /**
   * Get data of authenticated user
   */
  me(req, res) {
    let user = req.user;
    res.json(user.toJSON());
  },

  /**
   * Create user
   */
  create(req, res, next) {

    //Get user data
    let data = req.body;

    //Create user
    User.create(data)
      .then(user => {
        verifyEmailAddressEmail(user)
          .then(email => mailer.send(email))
          .catch(error => errorHandler(error, req));
        return (req.user = user);
      })
      .then(user => {

        //Generate access token for immediate login
        let json = user.toJSON();
        json.accessToken = tokens.generate('access', user.getClaims());
        return json;
      })
      .then(user => {
        res.status(201).json(user);
      })
      .catch(next);
  },

  /**
   * Update user
   */
  update(req, res, next) {

    //Get user and data
    let user = req.me;
    let data = User.parseData(req.data);

    //Set data and check if email changed
    user.setProperties(data);
    let isEmailChanged = user.isModified('email');

    //Save user
    user.save()
      .then(user => {
        if (isEmailChanged) {
          verifyEmailAddressEmail(user)
          .then(email => mailer.send(email))
          .catch(error => errorHandler(error, req));
        }
        return (req.user = user);
      })
      .then(user => user.toJSON())
      .then(user => {
        res.json(user);
      })
      .catch(next);
  },

  /**
   * Change password
   */
  changePassword(req, res, next) {

    //Get user and new password
    let user = req.user;
    let password = req.body.password;

    //Set password
    user.password = password;
    user.save()
      .then(user => {
        passwordHasChangedEmail(user)
          .then(email => mailer.send(email))
          .catch(error => errorHandler(error, req));
        res.end();
      })
      .catch(next);
  },

  /**
   * Exists check
   */
  exists(req, res, next) {
    User.find(req.body).limit(1)
      .then(users => (users.length > 0))
      .then(exists => {
        res.json({exists: exists});
      })
      .catch(next);
  },

  /**
   * Send password reset mail
   */
  sendPasswordResetEmail(req, res, next) {

    //If no user was found, send response anyway to prevent hackers from
    //figuring out which email addresses are valid and which aren't.
    if (!req.user) {
      return setTimeout(() => {
        res.end();
      }, 1000);
    }

    //Get user
    let user = req.user;

    //Send password reset email
    resetPasswordEmail(user)
      .then(email => mailer.send(email))
      .then(() => res.end())
      .catch(next);
  },

  /**
   * Reset password
   */
  resetPassword(req, res, next) {

    //Get token from body
    let token = req.body.token;

    //Validate token
    tokens.validate('resetPassword', token)
      .then(tokens.getId)
      .then(id => User.findById(id))
      .then(user => {

        //No user or token already used?
        if (!user) {
          throw new InvalidTokenError('No matching user found');
        }
        if (user.usedTokens && user.usedTokens.includes(token)) {
          throw new InvalidTokenError('Token already used');
        }

        //Update password, mark token as used
        user.password = req.body.password;
        user.usedTokens.push(token);
        return user;
      })
      .then(user => user.save())
      .then(user => {
        passwordHasChangedEmail(user)
          .then(email => mailer.send(email))
          .catch(error => errorHandler(error, req));
        res.end();
      })
      .catch(next);
  },

  /**
   * Send verification email
   */
  sendVerificationEmail(req, res, next) {
    let user = req.user;
    verifyEmailAddressEmail(user)
      .then(email => mailer.send(email))
      .then(() => res.end())
      .catch(next);
  },

  /**
   * Verify sent email verification token
   */
  verifyEmail(req, res, next) {

    //Get token from body
    let token = req.body.token;

    //Validate token
    tokens.validate('verifyEmail', token)
      .then(tokens.getId)
      .then(id => User.findOneAndUpdate({
        _id: id
      }, {
        isEmailVerified: true
      }))
      .then(() => {
        res.json({
          isValid: true
        });
      })
      .catch(next);
  },

  /**************************************************************************
   * Middleware
   ***/

  /**
   * Find by ID
   */
  findById(req, res, next, id) {

    //Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new BadRequestError());
    }

    //Find by ID
    User.findById(id)
      .then(user => {
        if (!user) {
          return next(new NotFoundError());
        }
        req.user = user;
        next();
      })
      .catch(next);
  },

  /**
   * Find by email (doesn't trigger 404's)
   */
  findByEmail(req, res, next) {

    //No email?
    if (!req.body.email) {
      return next();
    }

    //Find by email
    User.findOne({
      email: req.body.email
    }).then(user => {
      req.user = user;
      next();
    }).catch(next);
  },

  /**
   * Data collection
   */
  collectData(req, res, next) {

    //Extract posted data and collect other data from request
    let {firstName, lastName, email, phone, address, password} = req.body;
    let user = req.user;

    //Prepare data object
    req.data = {
      firstName, lastName, email, phone, address
    };

    //Password is only appended when creating a new user. For editing, we
    //use a separate route to change password with higher security.
    if (!user) {
      req.data.password = password;
    }

    //Next middleware
    next();
  }
};
