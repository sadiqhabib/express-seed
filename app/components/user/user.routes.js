'use strict';

/**
 * Dependencies
 */
let express = require('express');

/**
 * User routes
 */
module.exports = function(app) {

  //Get controllers and middleware
  let userCtrl = require('./user.ctrl');
  let avatarCtrl = require('./avatar.ctrl');
  let fileCtrl = require('../file/file.ctrl');
  let ensureAuthenticated = require('../auth/auth.ctrl').ensureAuthenticated;

  //Create new router
  let router = express.Router();

  //Parameter handling
  router.param('userId', userCtrl.findById);

  //Create user
  router.post(
    '/',
    userCtrl.collectData,
    userCtrl.create
  );

  //Edit logged in user
  router.put(
    '/',
    ensureAuthenticated,
    userCtrl.collectData,
    userCtrl.update
  );

  //Get logged in user data
  router.get(
    '/me',
    ensureAuthenticated,
    userCtrl.me
  );

  //Change password
  router.post(
    '/changePassword',
    ensureAuthenticated,
    userCtrl.changePassword
  );

  //Check if a user exists
  router.post(
    '/exists',
    userCtrl.exists
  );

  //Verify an email address verification token
  router.post(
    '/verifyEmail',
    userCtrl.verifyEmail
  );

  //Send out an email address verification token
  router.get(
    '/verifyEmail',
    ensureAuthenticated,
    userCtrl.sendVerificationEmail
  );

  //Sent out a password reset email
  router.post(
    '/forgotPassword',
    userCtrl.findByEmail,
    userCtrl.sendPasswordResetEmail
  );

  //Reset a user's password
  router.post(
    '/resetPassword',
    userCtrl.resetPassword
  );

  //Change a user's password
  router.post(
    '/changePassword',
    ensureAuthenticated,
    userCtrl.changePassword
  );

  //Upload new avatar
  router.post(
    '/:userId/avatar',
    ensureAuthenticated,
    avatarCtrl.configure,
    fileCtrl.deleteFromCloud,
    fileCtrl.upload,
    fileCtrl.streamToCloud,
    avatarCtrl.save
  );

  //Delete avatar
  router.delete(
    '/:userId/avatar',
    ensureAuthenticated,
    avatarCtrl.configure,
    fileCtrl.deleteFromCloud,
    avatarCtrl.delete
  );

  //Register router
  app.use('/user', router);
};
