'use strict';

/**
 * Module dependencies
 */
var chalk = require('chalk');
var object = require('utils/object');

/**
 * Helper to get specific environment config
 */
function getEnvConfig(env) {
  if (!env) {
    return {};
  }
  try {
    return require('env/' + env) || {};
  }
  catch (e) {
    if (env !== 'local') {
      console.warn(chalk.yellow('Config file for environment "%s" not found!'), env);
    }
    return {};
  }
}

/**
 * Get combined config
 */
var getCombinedConfig = function() {

  //Detect environment and create config
  var env = require('utils/detect-environment')(true);
  var config = object.merge(
    getEnvConfig('all'),
    getEnvConfig(env),
    getEnvConfig('local')
  );

  //Append environment
  config.env = env;
  return config;
};

/**
 * Load combined configuration
 */
module.exports = getCombinedConfig();
