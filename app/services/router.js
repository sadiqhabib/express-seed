'use strict';

/**
 * Dependencies
 */
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const express = require('express');
const config = require('../config');

/**
 * Export
 */
module.exports = function(app) {

  //Create API sub router
  const api = express.Router();

  //Load API routes
  console.log('Loading API routes...');
  glob.sync('./app/**/*.routes.js').forEach(routePath => {
    console.log(chalk.grey(' - %s'), routePath.replace('./app/', ''));
    require(path.resolve(routePath))(api);
  });

  //Use the API router
  app.use(config.API_BASE_PATH, api);
};
