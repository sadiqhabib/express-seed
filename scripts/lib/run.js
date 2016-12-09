'use strict';

/**
 * Dependencies
 */
const path = require('path');
const status = require('./status');
const argv = require('yargs').argv;

/**
 * Helper to run scripts
 */
function run(scripts) {

  //Convert to array if single script given
  if (!Array.isArray(scripts)) {
    scripts = [scripts];
  }

  //Done
  if (scripts.length === 0) {
    return Promise.resolve();
  }

  //Get script file
  const file = scripts.shift();
  status.start('Running', path.basename(file));

  //Load script and run it
  return Promise.try(() => require(path.resolve(file)))
    .then(script => script(argv))
    .then(() => status.ok())
    .catch(error => status.error(error))
    .then(() => run(scripts));
}

/**
 * Export interface
 */
module.exports = run;
