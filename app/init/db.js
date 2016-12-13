'use strict';

/**
 * Dependencies
 */
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const mongoose = require('mongoose');
const config = require('../config');

/**
 * Configure mongoose
 */
mongoose.Promise = require('bluebird');
mongoose.plugin(require('meanie-mongoose-to-json'));
mongoose.plugin(require('meanie-mongoose-set-properties'));
mongoose.set('debug', config.DB_DEBUG);

/**
 * Helper to check if an ID is an object ID
 */
mongoose.isObjectId = function(id) {
  return (id instanceof mongoose.Types.ObjectId);
};

//Connect to database
console.log('Connecting to database', chalk.magenta(config.DB_URI), '...');
mongoose.connect(config.DB_URI, {
  user: config.DB_USER,
  pass: config.DB_PASS,
  debug: config.DB_DEBUG,
  config: {
    autoIndex: config.DB_AUTO_INDEX,
  },
});

//Handle connection events
mongoose.connection.on('error', error => {
  console.log(chalk.red('Database error:'));
  console.log(chalk.red(error.stack || error));
  process.exit(-1);
});
mongoose.connection.on('connected', () => {
  console.log(
    chalk.green('Database connected @'),
    chalk.magenta(config.DB_URI)
  );
});

//Load models
console.log('Loading model files...');
glob.sync('./app/**/*.model.js').forEach(modelPath => {
  console.log(chalk.grey(' - %s'), modelPath.replace('./app/', ''));
  require(path.resolve(modelPath));
});
