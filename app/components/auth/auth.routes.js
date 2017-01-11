'use strict';

/**
 * Dependencies
 */
const express = require('express');
const authCtrl = require('./auth.ctrl');

/**
 * Auth routes
 */
module.exports = function(app) {

  //Create new router
  const router = express.Router();

  //Forget any refresh tokens
  router.get(
    '/forget',
    authCtrl.forget
  );

  //Obtain access token
  router.post(
    '/token',
    authCtrl.token
  );

  //Register router
  app.use('/auth', router);
};
