'use strict';

/**
 * External dependencies
 */
let join = require('path').join;
let argv = require('yargs').argv;
let chalk = require('chalk');

/**
 * Determine environment
 */
const ENV = argv.env || process.env.NODE_ENV || 'dev';

/**
 * Load and merge environment configuration files
 */
let env = loadConfig(ENV);
let local = loadConfig('local');
let config = Object.assign(env, local, {ENV: ENV});

/**
 * Export config
 */
module.exports = config;

/**
 * Helper to load a config file and return parsed YAML object
 */
function loadConfig(env) {
  try {
    let configPath = join('..', 'config', env);
    return require(configPath);
  }
  catch (e) {
    console.error(chalk.red(e));
    return {};
  }
}
