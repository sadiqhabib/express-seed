'use strict';

/**
 * Dependencies
 */
let path = require('path');
let Promise = require('bluebird');
let status = require('./status');
let errors = require('./errors');
let Migration = require('./migration');
let MethodInvalid = errors.MethodInvalidError;
let AlreadyRan = errors.AlreadyRanError;

/**
 * Helper to load a migration script
 */
function loadScript(file) {
  return Promise.try(() => {
    return require(path.resolve(file));
  });
}

/**
 * Helper to check if a migration ran before
 */
function checkDidntRunBefore(file, existing) {
  return Promise.try(() => {
    if (existing[file]) {
      throw new AlreadyRan('Already executed on' + existing[file].date);
    }
    return file;
  });
}

/**
 * Helper to check if a script method is present
 */
function checkHasMethod(script, method) {
  if (typeof script[method] !== 'function') {
    throw new MethodInvalid('No `' + method + '` method present');
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
  status.start('Rolling back migration', migration.file);

  //Load the script and run the migration
  return loadScript(migration.file)
    .then(script => checkHasMethod(script, 'down'))
    .then(runner => runner())
    .then(() => status.ok())
    .catch(MethodInvalid, error => status.skip(error.message))
    .catch(error => status.error(error))
    .then(() => Migration.remove(migration))
    .then(() => runDownMigrations(migrations));
}

/**
 * Helper to run up migrations one by one
 */
function runUpMigrations(migrations, existing) {

  //Done
  if (migrations.length === 0) {
    return Promise.resolve('Finished all migrations');
  }

  //Get migration
  let migration = migrations.shift();
  status.start('Running migration', migration);

  //Run migration
  return checkDidntRunBefore(migration, existing)
    .then(() => loadScript(migration))
    .then(script => checkHasMethod(script, 'up'))
    .then(runner => runner())
    .then(() => status.ok())
    .then(() => Migration.save(migration))
    .catch(MethodInvalid, AlreadyRan, error => status.skip(error.message))
    .catch(error => status.error(error))
    .then(() => runUpMigrations(migrations, existing));
}

/**
 * Export interface
 */
module.exports = {
  up: runUpMigrations,
  down: runDownMigrations
};
