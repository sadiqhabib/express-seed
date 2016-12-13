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

//Fix CWD if run from scripts path
const cwd = process.cwd().split(path.sep);
if (cwd.length && cwd[cwd.length - 1] === 'scripts') {
  cwd.pop();
  process.chdir(cwd.join(path.sep));
}

//Get parameters
const basePath = './tasks/';
const task = path.join(basePath, (argv._.length ? argv._[0] : ''));
const debug = (typeof argv.debug !== 'undefined');

//Initialize database
require('../app/init/db');

//Override mongoose debugging setting
mongoose.set('debug', debug);

//Run when DB connected
mongoose.connection.on('connected', () => {
  console.log(chalk.grey('Running task'), chalk.magenta(task));
  run(task)
    .then(() => log.success('Task completed'))
    .catch(log.error)
    .finally(() => process.exit(0));
});
