'use strict';

/**
 * Dependencies
 */
let chalk = require('chalk');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * Define migration model
 */
let Migration = mongoose.model('Migration', new Schema({
  file: String,
  date: {
    type: Date,
    default: Date.now
  }
}));

/**
 * Helper to Save a migration to DB
 */
function saveMiration(migration) {
  return Migration.create({file: migration})
    .catch(error => {
      console.error(chalk.red('Failed to save migration:'));
      console.error(chalk.red(error.message));
    });
}

/**
 * Helper to remove a migration from DB
 */
function removeMigration(migration) {
  return migration.remove()
    .catch(error => {
      console.error(chalk.red('Failed to remove migration:'));
      console.error(chalk.red(error.message));
    });
}

/**
 * Helper to find existing migrations
 */
function findMigrations(asHash) {
  return Migration
    .find({})
    .sort({date: -1})
    .then(migrations => {
      if (asHash) {
        let hash = {};
        migrations.forEach(migration => {
          hash[migration.file] = migration;
        });
        return hash;
      }
      return migrations;
    })
    .catch(error => {
      throw new Error('Failed to read existing migrations:\n' + error.message);
    });
}

/**
 * Export interface
 */
module.exports = {
  save: saveMiration,
  remove: removeMigration,
  find: findMigrations
};
