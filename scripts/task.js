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
const argv = require('yargs').argv;
const db = require('../app/services/db');
const log = require('./lib/log');
const run = require('./lib/run');

/**
 * Fix CWD if run from scripts path
 */
const cwd = process.cwd().split(path.sep);
if (cwd.length && cwd[cwd.length - 1] === 'scripts') {
  cwd.pop();
  process.chdir(cwd.join(path.sep));
}

/**
 * Define tasks path
 */
const TASKS_PATH = './tasks/';

/**
 * Get parameters
 */
const task = path.join(TASKS_PATH, (argv._.length ? argv._[0] : ''));
const debug = (typeof argv.debug !== 'undefined');

//Log
console.log(chalk.grey('Running task'), chalk.magenta(task));

//Run when DB connected
db(null, {debug}).connection.on('connected', () => {
  run(task)
    .then(() => log.success('Task completed'))
    .catch(log.error)
    .finally(() => process.exit(0));
});
