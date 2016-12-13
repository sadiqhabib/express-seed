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
const mongoose = require('mongoose');
const argv = require('yargs').argv;
const log = require('./lib/log');
const run = require('./lib/run');
const loadScripts = require('./lib/load-scripts');

//Get parameters and load scripts
const target = (argv._.length ? argv._[0] : '');
const basePath = path.resolve(__dirname, '..', 'tasks');
const scripts = loadScripts(path.join(basePath, target));
const isMany = (scripts.length > 1);

//Nothing found
if (scripts.length === 0) {
  console.warn(chalk.yellow('No tasks found!'));
  process.exit(0);
}

//Initialize database
require('../app/init/db');
mongoose.set('debug', (typeof argv.debug !== 'undefined'));

//Run when DB connected
mongoose.connection.on('connected', () => {

  //Log
  console.log(
    'Running task' + (isMany ? 's from' : ''), chalk.magenta(target)
  );

  //Run scripts
  run(scripts)
    .then(() => log.success('Finished task' + (isMany ? 's' : '')))
    .catch(log.error)
    .finally(() => process.exit(0));
});
