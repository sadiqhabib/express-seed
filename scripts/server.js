'use strict';

/**
 * External dependencies
 */
var path = require('path');
var chalk = require('chalk');

/**
 * Fix CWD if run from scripts path
 */
var cwd = process.cwd().split(path.sep);
if (cwd.length && cwd[cwd.length - 1] === 'scripts') {
  cwd.pop();
  process.chdir(cwd.join(path.sep));
}

/**
 * Add root folder to path
 */
require('app-module-path').addPath(__dirname + '/..');

/**
 * Application dependencies
 */
var config = require('app/config');
var expressErrorHandler = require('app/error/handlers/express');

/**
 * Log
 */
console.log('Running application', chalk.magenta(config.app.name),
  'in the', chalk.magenta(process.env.NODE_ENV), 'environment');

/**
 * Initialize express application
 */
console.log('Starting Express server...');
var app = require('app/app')();
var server = app.listen(config.server.port, function() {

  //Skip if no address
  if (!this.address()) {
    return;
  }

  //Determine address
  var host = this.address().address.replace('::', 'localhost');
  var port = this.address().port;
  var protocol = (process.env.NODE_ENV === 'secure') ? 'https://' : 'http://';

  //Remember in config and output success message
  config.server.address = protocol + host + ':' + port;
  console.log(chalk.green('Express server started @ '), chalk.magenta(config.server.address));
});
server.on('error', expressErrorHandler);

/**
 * Expose app
 */
module.exports = app;
