'use strict';

/**
 * Dependencies
 */
let express = require('express');

/**
 * Auth routes
 */
module.exports = function(app) {

  //Get controllers and middleware
  let authCtrl = require('./auth.ctrl');
  let ensureAuthenticated = authCtrl.ensureAuthenticated;

  //Create new router
  let router = express.Router();

  //Define routes
  router.get('/verify', ensureAuthenticated, authCtrl.verify);
  router.get('/forget', authCtrl.forget);
  router.post('/token', authCtrl.token);

  //Register router
  app.use('/auth', router);
};
