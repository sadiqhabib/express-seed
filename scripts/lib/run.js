'use strict';

/**
 * Dependencies
 */
let path = require('path');
let Promise = require('bluebird');
let status = require('./status');

/**
 * Invalid method error
 */
function MethodInvalidError() {}
MethodInvalidError.prototype = Object.create(Error.prototype);

/**
 * Helper to load a migration script
 */
function loadScript(file) {
  return Promise.try(() => {
    return require(path.resolve(file));
  });
}

/**
 * Helper to check if a script method is present
 */
function checkHasMethod(script, method) {
  if (typeof script[method] !== 'function') {
    throw new MethodInvalidError('No `' + method + '` method present');
  }
  return script[method];
}

/**
 * Helper to run down migrations one by one
 */
function runDownMigrations(migrations) {

  //Done
  if (migrations.length === 0) {
    return Promise.resolve('Finished all migrations');
  }

  //Get migration
  let migration = migrations.shift();
  status.start('Rolling back migration', migration);

  //Load the script and run the migration
  return loadScript(migration)
    .then(script => checkHasMethod(script, 'down'))
    .then(runner => runner())
    .then(() => status.ok())
    .catch(MethodInvalidError, error => status.skip(error.message))
    .catch(error => status.error(error))
    .then(() => runDownMigrations(migrations));
}

/**
 * Helper to run up migrations one by one
 */
function runUpMigrations(migrations) {

  //Done
  if (migrations.length === 0) {
    return Promise.resolve('Finished all migrations');
  }

  //Get migration
  let migration = migrations.shift();
  status.start('Running migration', migration);

  //Run migration
  return loadScript(migration)
    .then(script => checkHasMethod(script, 'up'))
    .then(runner => runner())
    .then(() => status.ok())
    .catch(MethodInvalidError, error => status.skip(error.message))
    .catch(error => status.error(error))
    .then(() => runUpMigrations(migrations));
}

/**
 * Export interface
 */
module.exports = {
  up: runUpMigrations,
  down: runDownMigrations,
};
