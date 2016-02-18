'use strict';

/**
 * Dependencies
 */
let mongoose = require('mongoose');
let ValidationError = require('../error/types/validationError');
let handleError = require('../error/handlers/handleError');
let tokens = require('../shared/services/tokens.js');
let mailer = require('../shared/services/mailer');

/**
 * Emails
 */
let verifyEmailAddressEmail = require('./emails/verifyEmailAddress');
let passwordHasChangedEmail = require('./emails/passwordHasChanged');
let resetPasswordEmail = require('./emails/resetPassword');

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

        //Store in request
        req.user = user;

        //Send verification email (allow failure at this stage)
        mailer.send(verifyEmailAddressEmail(user)).catch(handleError);

        //Generate access token for immediate login
        user.accessToken = tokens.generate('access', user.toJSON());
        return user;
      })
      .then(user => user.save())
      .then(user => {

        //Convert to JSON
        let userJson = user.toJSON();

        //Manually append access token now to allow the user to login,
        //because the model deletes it from JSON form by default
        userJson.accessToken = user.accessToken;
        res.status(201).json(userJson);
      })
      .catch(next);
  },

  /**
   * Update user
   */
  update(req, res, next) {

    //Get user data and check if email changed
    let user = Object.assign(req.user, req.data);
    let isEmailChanged = user.isModified('email');

    //Save user
    user.save()
      .then(user => {

        //Store updated user in request
        req.user = user;
        res.json(user.toJSON());

        //Send new email verification
        if (isEmailChanged) {
          mailer.send(verifyEmailAddressEmail(user)).catch(handleError);
        }
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
        mailer.send(passwordHasChangedEmail(user)).catch(handleError);
        res.end();
      })
      .catch(next);
  },

  /**
   * Exists check
   */
  exists(req, res, next) {
    User.find(req.body).limit(1)
      .then(users => {
        res.json({exists: users.length > 0});
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
    mailer.send(resetPasswordEmail(user))
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
          throw new ValidationError('INVALID_TOKEN');
        }
        if (user.usedTokens && user.usedTokens.includes(token)) {
          throw new ValidationError('INVALID_TOKEN');
        }

        //Update password, mark token as used
        user.password = req.body.password;
        user.usedTokens.push(token);
        return user;
      })
      .then(user => user.save())
      .then(user => {
        mailer.send(passwordHasChangedEmail(user)).catch(handleError);
        res.end();
      })
      .catch(next);
  },

  /**
   * Send verification email
   */
  sendVerificationEmail(req, res, next) {
    let user = req.user;
    mailer.send(verifyEmailAddressEmail(user))
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
