'use strict';

/**
 * External dependencies
 */
let path = require('path');
let chalk = require('chalk');

/**
 * Application dependencies
 */
let passport = require('passport');
let globber = require('app/shared/globber');

/**
 * Export
 */
module.exports = function(app) {

  //Passport initialization and strategies loading
  app.use(passport.initialize());

  //Load authentication strategies
  console.log('Loading authentication strategies...');
  globber.files('./server/app/auth/strategies/**/*.js').forEach(function(strategyPath) {
    console.log(chalk.grey(' - %s'), strategyPath.replace('./server/app/', ''));
    require(path.resolve(strategyPath))();
  });
};
