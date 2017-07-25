'use strict';

/**
 * Use bluebird for promises globally
 */
global.Promise = require('bluebird');

/**
 * Common initialization scripts
 */
require('../app/init/console');

/**
 * Dependencies
 */
const path = require('path');
const chalk = require('chalk');
const argv = require('yargs').argv;
const db = require('../app/init/db');
const log = require('./lib/log');
const run = require('./lib/run');
const loadScripts = require('./lib/load-scripts');

//Get target
const target = (argv._.length ? argv._[0] : '');

//Must specify a target
if (!target) {
  console.warn('Please specify a script or subfolder');
  process.exit(0);
}

//Load scripts
const basePath = path.resolve(__dirname, '..', 'tasks');
const scripts = loadScripts(path.join(basePath, target));
const isMany = (scripts.length > 1);

//Nothing found
if (scripts.length === 0) {
  console.warn('No tasks found!');
  process.exit(0);
}

//Initialize database
db({
  debug: (typeof argv.debug !== 'undefined'),
  autoIndex: false,
}).then(() => {

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
