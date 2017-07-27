'use strict';

/**
 * Use bluebird for promises globally
 */
global.Promise = require('bluebird');

/**
 * Common initialization scripts
 */
require('../../app/init/console');
require('../../app/init/moment');
require('../../app/init/jwt');

/**
 * Dependencies
 */
const path = require('path');
const chalk = require('chalk');
const argv = require('yargs').argv;
const db = require('../../app/init/db');
const log = require('./log');
const runScripts = require('./run-scripts');
const loadScripts = require('./load-scripts');

/**
 * Run function
 */
module.exports = async function run(config) {

  //Get target and base path
  const target = (argv._.length ? argv._[0] : '');
  const {basePath} = config;

  //Must specify a target
  if (!target) {
    console.warn('Please specify a script or subfolder');
    process.exit(0);
  }

  //Must specify a base path
  if (!basePath) {
    console.warn('Please specify a base path');
    process.exit(0);
  }

  //Load scripts
  const scripts = loadScripts(path.join(basePath, target));
  const isMany = (scripts.length > 1);

  //Nothing found
  if (scripts.length === 0) {
    console.warn('No scripts found!');
    process.exit(0);
  }

  //Initialize database
  await db({
    debug: (typeof argv.debug !== 'undefined'),
    autoIndex: false,
  });

  //Log
  console.log(
    'Running script' + (isMany ? 's from' : ''), chalk.magenta(target)
  );

  //Run scripts
  try {
    await runScripts(scripts, config);
    log.success('Finished running script' + (isMany ? 's' : ''));
  }
  catch (error) {
    log.error(error);
  }

  //Done
  process.exit(0);
};
