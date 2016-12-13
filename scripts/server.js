'use strict';

/**
 * Use bluebird for promises globally
 */
global.Promise = require('bluebird');

/**
 * Dependencies
 */
const path = require('path');
const chalk = require('chalk');
const config = require('../app/config');

/**
 * Configuration
 */
const ENV = config.ENV;
const APP_NAME = config.APP_NAME;
const SERVER_PORT = config.SERVER_PORT;

/**
 * Fix CWD if run from scripts path
 */
const cwd = process.cwd().split(path.sep);
if (cwd.length && cwd[cwd.length - 1] === 'scripts') {
  cwd.pop();
  process.chdir(cwd.join(path.sep));
}

/**
 * Error handler
 */
function expressErrorHandler(err) {
  if (err.errno === 'EADDRINUSE') {
    console.log(chalk.red('Web server port %s is already in use'), SERVER_PORT);
  }
  else {
    console.log(chalk.red('Web server error:'));
    console.log(chalk.red(err));
  }
  process.exit(-1);
}

/**
 * Log
 */
console.log('Running application', chalk.magenta(APP_NAME),
  'in the', chalk.magenta(ENV), 'environment');

/**
 * Initialize express application
 */
console.log('Starting Express server...');
const app = require('../app/app')();
const server = app.listen(SERVER_PORT, function() {

  //Skip if no address
  if (!this.address()) {
    return;
  }

  //Determine address
  const host = this.address().address.replace('::', 'localhost');
  const port = this.address().port;
  const address = host + ':' + port;

  //Output success message
  console.log(chalk.green('Express server started @'), chalk.magenta(address));
});
server.on('error', expressErrorHandler);

/**
 * Expose app
 */
module.exports = app;
