'use strict';

/**
 * Dependencies
 */
const express = require('express');
const userCtrl = require('./user.ctrl');
const avatarCtrl = require('./avatar.ctrl');
const fileCtrl = require('../file/file.ctrl');
const authCtrl = require('../auth/auth.ctrl');

/**
 * User routes
 */
module.exports = function(app) {

  //Extract middleware
  const {ensureAuthenticated} = authCtrl;

  //Create new router
  const router = express.Router();

  //Parameter handling
  router.param('property', userCtrl.setProperty);

  //Register user
  router.post(
    '/',
    userCtrl.ensureUsernameNotInUse,
    userCtrl.collectData,
    userCtrl.create,
    userCtrl.get
  );

  //Update logged in user
  router.put(
    '/',
    ensureAuthenticated(),
    userCtrl.collectData,
    userCtrl.update,
    userCtrl.get
  );

  //Change credentials
  router.patch(
    '/credentials',
    ensureAuthenticated(),
    userCtrl.ensureUsernameNotInUse,
    userCtrl.changeCredentials
  );

  //Patch logged in user
  router.patch(
    '/:property',
    ensureAuthenticated(),
    userCtrl.collectData,
    userCtrl.patch
  );

  //Get logged in user data
  router.get(
    '/me',
    ensureAuthenticated(),
    userCtrl.me,
    userCtrl.get
  );

  //Check if a user exists
  router.get(
    '/exists',
    userCtrl.exists
  );

  //Verify an email address verification token
  router.post(
    '/verifyEmail',
    function(req, res, next) {
      req.tokenType = 'verifyEmail';
      next();
    },
    userCtrl.findByToken,
    userCtrl.verifyEmail
  );

  //Send out an email address verification token
  router.get(
    '/verifyEmail',
    ensureAuthenticated(),
    userCtrl.sendVerificationEmail
  );

  //Send out a password reset email
  router.post(
    '/forgotPassword',
    userCtrl.findByUsername,
    userCtrl.sendPasswordResetEmail
  );

  //Send out an email with username
  router.post(
    '/forgotUsername',
    userCtrl.findByEmail,
    userCtrl.sendUsernamesEmail
  );

  //Check user for reset password
  router.get(
    '/checkResetPassword',
    function(req, res, next) {
      req.tokenType = 'resetPassword';
      next();
    },
    userCtrl.findByToken,
    userCtrl.get
  );

  //Reset a user's password
  router.post(
    '/resetPassword',
    function(req, res, next) {
      req.tokenType = 'resetPassword';
      next();
    },
    userCtrl.findByToken,
    userCtrl.resetPassword
  );

  //Change a user's credentials
  router.post(
    '/changeCredentials',
    ensureAuthenticated(),
    userCtrl.changeCredentials
  );

  //Upload an avatar
  router.post(
    '/avatar',
    ensureAuthenticated(),
    userCtrl.setUser,
    avatarCtrl.configure,
    fileCtrl.deleteFromCloud,
    fileCtrl.upload,
    fileCtrl.streamToCloud,
    avatarCtrl.save
  );

  //Delete an avatar
  router.delete(
    '/avatar',
    ensureAuthenticated(),
    userCtrl.setUser,
    avatarCtrl.configure,
    fileCtrl.deleteFromCloud,
    avatarCtrl.delete
  );

  //Register router
  app.use('/user', router);
};
