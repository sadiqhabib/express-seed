'use strict';

/**
 * External dependencies
 */
let path = require('path');
let glob = require('glob');
let chalk = require('chalk');
let express = require('express');

/**
 * Application dependencies
 */
let config = require('./config');

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
  glob.sync('./app/**/*.routes.js').forEach(function(routePath) {
    console.log(chalk.grey(' - %s'), routePath.replace('./app/', ''));
    require(path.resolve(routePath))(api);
  });

  //Use the API router
  app.use(API_BASE_PATH, api);
};
