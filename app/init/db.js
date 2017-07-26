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

  //Extend main config options and extract data
  const {uri, debug, autoIndex} = Object.assign({}, {
    uri: config.DB_URI,
    debug: config.DB_DEBUG,
    autoIndex: config.DB_AUTO_INDEX,
  }, options || {});

  //Connect to database
  console.log('Connecting to database', chalk.magenta(uri), '...');
  mongoose.set('debug', debug);
  const connection = mongoose
    .connect(uri, {
      useMongoClient: true,
      config: {
        autoIndex,
      },
    })
    .then(() => {
      console.log(chalk.green('Database connected @'), chalk.magenta(uri));
    })
    .catch(error => {
      console.log(chalk.red('Database error:'));
      console.log(chalk.red(error.stack || error));
      process.exit(-1);
    });

  //Load models
  console.log('Loading model files...');
  glob.sync('./app/**/*.model.js').forEach(modelPath => {
    console.log(chalk.grey(' - %s'), modelPath.replace('./app/', ''));
    require(path.resolve(modelPath));
  });

  //Return connection promise
  return connection;
};
