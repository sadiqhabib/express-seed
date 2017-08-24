'use strict';

/**
 * Dependencies
 */
const express = require('express');
const userCtrl = require('./user.ctrl');
const avatarCtrl = require('./avatar.ctrl');
const fileCtrl = require('../file/file.ctrl');
const authCtrl = require('../auth/auth.ctrl');
const setId = require('../../middleware/set-id');

/**
 * User routes
 */
module.exports = function(app) {

  //Extract middleware
  const {ensureAuthenticated, ensureScope} = authCtrl;

  //Create new router
  const router = express.Router();

  //Parameter handling
  router.param('userId', setId('userId'));

  //Get users
  router.get(
    '/',
    ensureAuthenticated(),
    ensureScope('user:read'),
    userCtrl.findByQuery,
    userCtrl.list
  );

  //Create user
  router.post(
    '/',
    // (req, res, next) => { console.log('Nomi 1'); next(); },
    // ensureAuthenticated(),
    // (req, res, next) => { console.log('Nomi 2'); next(); },
    // ensureScope('user:write'),
    userCtrl.ensureUsernameNotInUse(),
    userCtrl.collectData,
    userCtrl.create,
    userCtrl.get
  );

  //Get specific user
  router.get(
    '/:userId',
    ensureAuthenticated(),
    ensureScope('user:read'),
    userCtrl.findById,
    userCtrl.get
  );

  //Update specific user
  router.put(
    '/:userId',
    ensureAuthenticated(),
    ensureScope('user:write'),
    userCtrl.ensureUsernameNotInUse(true),
    userCtrl.findById,
    userCtrl.collectData,
    userCtrl.update,
    userCtrl.get
  );

  //Delete specific user
  router.delete(
    '/:userId',
    ensureAuthenticated(),
    ensureScope('user:write'),
    userCtrl.findById,
    userCtrl.delete
  );

  //Update user's password
  router.put(
    '/:userId/password',
    ensureAuthenticated(),
    ensureScope('user:write'),
    userCtrl.findById,
    userCtrl.updatePassword
  );

  /**************************************************************************
   * Own user routes
   ***/

  //Register user
  router.post(
    '/me',
    userCtrl.ensureUsernameNotInUse(),
    userCtrl.collectData,
    userCtrl.create,
    userCtrl.get
  );

  //Get authenticated user
  router.get(
    '/me',
    ensureAuthenticated(),
    ensureScope('user:own'),
    userCtrl.setClaimedId,
    userCtrl.findById,
    userCtrl.get
  );

  //Update authenticated user
  router.put(
    '/me',
    ensureAuthenticated(),
    ensureScope('user:own'),
    userCtrl.setClaimedId,
    userCtrl.ensureUsernameNotInUse(true),
    userCtrl.findById,
    userCtrl.collectData,
    userCtrl.update,
    userCtrl.get
  );

  //Update user's password
  router.put(
    '/me/password',
    ensureAuthenticated(),
    ensureScope('user:password'),
    userCtrl.setClaimedId,
    userCtrl.findById,
    userCtrl.updatePassword
  );

  //Upload avatar
  router.post(
    '/me/avatar',
    ensureAuthenticated(),
    ensureScope('user:own'),
    userCtrl.setClaimedId,
    userCtrl.findById,
    avatarCtrl.configure,
    fileCtrl.deleteFromGcs,
    fileCtrl.upload,
    fileCtrl.streamToGcs,
    avatarCtrl.save
  );

  //Delete avatar
  router.delete(
    '/me/avatar',
    ensureAuthenticated(),
    ensureScope('user:own'),
    userCtrl.setClaimedId,
    userCtrl.findById,
    avatarCtrl.configure,
    fileCtrl.deleteFromGcs,
    avatarCtrl.delete
  );

  //Send out an email address verification mail
  router.get(
    '/verifyEmail',
    ensureAuthenticated(),
    ensureScope('user:own'),
    userCtrl.setClaimedId,
    userCtrl.findById,
    userCtrl.sendVerificationEmail
  );

  //Verify an email address
  router.post(
    '/verifyEmail',
    ensureAuthenticated(),
    ensureScope('user:verify'),
    userCtrl.setClaimedId,
    userCtrl.findById,
    userCtrl.verifyEmail
  );

  /**************************************************************************
   * Unauthenticated routes
   ***/

  //Check if a user exists
  router.get(
    '/exists',
    userCtrl.exists
  );

  //Send out a password reset email
  router.post(
    '/forgotPassword',
    userCtrl.findByUsername,
    userCtrl.sendPasswordResetEmail
  );

  //Send out an email with usernames
  router.post(
    '/forgotUsername',
    userCtrl.findByEmail,
    userCtrl.sendUsernameRecoveryEmail
  );

  //Register router
  app.use('/user', router);
};
