'use strict';

/**
 * Dependencies
 */
let express = require('express');

/**
 * Error routes
 */
module.exports = function(app) {

  //Get controllers and middleware
  let errorCtrl = require('./error.ctrl');
  let checkAuthenticated = require('../auth/auth.ctrl').checkAuthenticated;

  //Create new router
  let router = express.Router();

  //Report error
  router.post(
    '/',
    checkAuthenticated,
    errorCtrl.report
  );

  //Register router
  app.use('/error', router);
};
