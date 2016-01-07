'use strict';

/**
 * External dependencies
 */
let path = require('path');
let chalk = require('chalk');
let express = require('express');

/**
 * Application dependencies
 */
let config = require('./config');
let globber = require('./shared/globber');

/**
 * Configuration
 */
const API_BASE_PATH = config.API_BASE_PATH;

/**
 * Export
 */
module.exports = function(app) {

  //Create API sub router
  let api = express.Router();

  //Load API routes
  console.log('Loading API routes...');
  globber.files('./app/**/*.routes.js').forEach(function(routePath) {
    console.log(chalk.grey(' - %s'), routePath.replace('./app/', ''));
    require(path.resolve(routePath))(api);
  });

  //Use the API router
  app.use(API_BASE_PATH, api);
};
