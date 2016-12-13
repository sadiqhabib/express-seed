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
const glob = require('glob');
const log = require('./lib/log');
const run = require('./lib/run');

//Fix CWD if run from scripts path
const cwd = process.cwd().split(path.sep);
if (cwd.length && cwd[cwd.length - 1] === 'scripts') {
  cwd.pop();
  process.chdir(cwd.join(path.sep));
}

//Get parameters
const basePath = './migrations/';
const folder = path.join(basePath, (argv._.length ? argv._[0] : ''));
const debug = (typeof argv.debug !== 'undefined');

//Initialize database
require('../app/init/db');

//Load migrations
console.log(chalk.grey('Loading migrations from'), chalk.magenta(folder));
const migrations = glob.sync(path.join(folder, '*.js'));
if (migrations.length === 0) {
  console.warn(chalk.yellow('No migrations found!'));
  process.exit(0);
}

//Override mongoose debugging setting
mongoose.set('debug', debug);

//Run when DB connected
mongoose.connection.on('connected', () => {
  run(migrations)
    .then(() => log.success('Finished all migrations'))
    .catch(log.error)
    .finally(() => process.exit(0));
});
