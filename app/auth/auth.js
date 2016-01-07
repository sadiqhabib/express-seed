'use strict';

/**
 * External dependencies
 */
let path = require('path');
let glob = require('glob');
let chalk = require('chalk');

/**
 * Application dependencies
 */
let passport = require('passport');

/**
 * Export
 */
module.exports = function(app) {

  //Passport initialization and strategies loading
  app.use(passport.initialize());

  //Load authentication strategies
  console.log('Loading authentication strategies...');
  glob.sync('./app/auth/strategies/**/*.js').forEach(function(strategyPath) {
    console.log(chalk.grey(' - %s'), strategyPath.replace('./app/', ''));
    require(path.resolve(strategyPath))();
  });
};
