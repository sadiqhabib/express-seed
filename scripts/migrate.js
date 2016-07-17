'use strict';

/**
 * Dependencies
 */
let path = require('path');
let glob = require('glob');
let chalk = require('chalk');
let argv = require('yargs').argv;
let Promise = require('bluebird');
let db = require('../app/services/db');
let log = require('./lib/log');
let run = require('./lib/run');

/**
 * Fix CWD if run from scripts path
 */
let cwd = process.cwd().split(path.sep);
if (cwd.length && cwd[cwd.length - 1] === 'scripts') {
  cwd.pop();
  process.chdir(cwd.join(path.sep));
}

/**
 * Define migrations path
 */
const MIGRATIONS_PATH = './migrations/';

/**
 * Available commands
 */
let commands = {

  /**
   * Migrate up
   */
  up() {

    //Load all migrations from the migrations path
    let migrations = glob.sync(MIGRATIONS_PATH + '*.js');
    if (migrations.length === 0) {
      return Promise.resolve('No migrations found');
    }

    //Run up migrations
    return run.up(migrations);
  },

  /**
   * Migrate down
   */
  down() {

    //Load all migrations from the migrations path
    let migrations = glob.sync(MIGRATIONS_PATH + '*.js');
    if (migrations.length === 0) {
      return Promise.resolve('No migrations found');
    }

    //Run down migrations
    return run.down(migrations);
  },

  /**
   * Refresh database (migrate down and up again)
   */
  refresh() {
    return this.down()
      .then(() => this.up())
      .then(() => 'Database refreshed');
  },
};

//Defaults
let command = (argv._.length ? argv._[0] : 'up');
let debug = (typeof argv.debug !== 'undefined');

//Validate it
if (!command || !commands[command]) {
  console.log(chalk.red('Unknown migration command:', command));
  process.exit(0);
}

//Run when DB connected
db(null, {debug: debug}).connection.on('connected', () => {
  commands[command]()
    .then(log.success)
    .catch(log.error)
    .finally(() => process.exit(0));
});
