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
const glob = require('glob');
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
 * Define migrations path
 */
const MIGRATIONS_PATH = './migrations/';

/**
 * Get parameters
 */
const folder = path.join(MIGRATIONS_PATH, (argv._.length ? argv._[0] : ''));
const debug = (typeof argv.debug !== 'undefined');

//Log
console.log(chalk.grey('Loading migrations from'), chalk.magenta(folder));

//Get the migrations
let migrations = glob.sync(path.join(folder, '*.js'));
if (migrations.length === 0) {
  console.warn(chalk.yellow('No migrations found!'));
  process.exit(0);
}

//Run when DB connected
db(null, {debug}).connection.on('connected', () => {
  run(migrations)
    .then(() => log.success('Finished all migrations'))
    .catch(log.error)
    .finally(() => process.exit(0));
});
