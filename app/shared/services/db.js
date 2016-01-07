'use strict';

/**
 * External dependencies
 */
let path = require('path');
let glob = require('glob');
let chalk = require('chalk');
let mongoose = require('mongoose');

/**
 * Application dependencies
 */
let config = require('app/config');

/**
 * Configuration
 */
const DB_URI = config.DB_URI;
const DB_USER = config.DB_USER;
const DB_PASS = config.DB_PASS;
const DB_DEBUG = config.DB_DEBUG;

/**
 * Add string to object ID method
 */
String.prototype.toObjectId = function() {
  return new mongoose.Types.ObjectId(this.toString());
};

/**
 * Error handler
 */
function dbErrorHandler(err) {
  console.error(chalk.red('Database error:'));
  console.error(chalk.red(err.stack ? err.stack : err));
  process.exit(-1);
}

/**
 * Export
 */
module.exports = function(app, options) {

  //Merge options
  options = Object.assign({
    user: DB_USER,
    pass: DB_PASS,
    debug: DB_DEBUG
  }, options);

  //Set debugging on or off
  mongoose.set('debug', options.debug);

  //Connect to database
  console.log('Connecting to database', chalk.magenta(DB_URI), '...');
  let db = mongoose.connect(DB_URI, options);

  //Handle connection events
  mongoose.connection.on('error', dbErrorHandler);
  mongoose.connection.on('connected', function() {
    console.log(chalk.green('Database connected @'), chalk.magenta(DB_URI));
  });

  //Loading within app?
  if (app) {

    //Load models
    console.log('Loading model files...');
    glob.sync('./app/**/*.model.js').forEach(function(modelPath) {
      console.log(chalk.grey(' - %s'), modelPath.replace('./app/', ''));
      require(path.resolve(modelPath));
    });

    //Append to app
    app.db = db;
  }

  //Return the database instance
  return db;
};
