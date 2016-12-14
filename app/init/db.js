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

/**
 * Helper to check if an ID is an object ID
 */
mongoose.isObjectId = function(id) {
  return (id instanceof mongoose.Types.ObjectId);
};

/**
 * Wrapper to enable overriding of configuration options
 */
module.exports = function(options) {

  //Extend main config options
  const cfg = Object.assign({}, {
    uri: config.DB_URI,
    user: config.DB_USER,
    pass: config.DB_PASS,
    debug: config.DB_DEBUG,
    autoIndex: config.DB_AUTO_INDEX,
  }, options || {});

  //Connect to database
  console.log('Connecting to database', chalk.magenta(cfg.uri), '...');
  mongoose.set('debug', cfg.debug);
  mongoose.connect(cfg.uri, {
    user: cfg.user,
    pass: cfg.pass,
    config: {
      autoIndex: cfg.autoIndex,
    },
  });

  //Handle connection events
  mongoose.connection.on('error', error => {
    console.log(chalk.red('Database error:'));
    console.log(chalk.red(error.stack || error));
    process.exit(-1);
  });
  mongoose.connection.on('connected', () => {
    console.log(chalk.green('Database connected @'), chalk.magenta(cfg.uri));
  });

  //Load models
  console.log('Loading model files...');
  glob.sync('./app/**/*.model.js').forEach(modelPath => {
    console.log(chalk.grey(' - %s'), modelPath.replace('./app/', ''));
    require(path.resolve(modelPath));
  });
};
