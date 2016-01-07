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
  let authCtrl = require('app/auth/auth.ctrl');
  let ensureAuthenticated = require('app/auth/middleware/ensureAuthenticated');

  //Create new router
  let router = express.Router();

  //Define routes
  router.get('/verify', ensureAuthenticated, authCtrl.verify);
  router.get('/forget', authCtrl.forget);
  router.post('/token', authCtrl.token);

  //Register router
  app.use('/auth', router);
};
