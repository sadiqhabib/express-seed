'use strict';

/**
 * External dependencies
 */
let express = require('express');

/**
 * User routes
 */
module.exports = function(app) {

  //Get controllers and middleware
  let userCtrl = require('app/user/user.ctrl');
  let ensureAuthenticated = require('app/auth/middleware/ensureAuthenticated');
  let ensureAdmin = require('app/auth/middleware/ensureAdmin');
  let findUserByEmail = userCtrl.findUserByEmail;

  //Create new router
  let router = express.Router();

  //Define routes
  router.get('/', ensureAuthenticated, ensureAdmin, userCtrl.query);
  router.post('/', userCtrl.create);
  router.put('/', ensureAuthenticated, userCtrl.update);
  router.get('/me', ensureAuthenticated, userCtrl.me);
  router.post('/exists', userCtrl.exists);
  router.post('/verifyEmail', userCtrl.verifyEmail);
  router.get('/verifyEmail', ensureAuthenticated, userCtrl.sendVerificationEmail);
  router.post('/forgotPassword', findUserByEmail, userCtrl.sendPasswordResetMail);
  router.post('/resetPassword', userCtrl.resetPassword);

  //Register router
  app.use('/user', router);
};
