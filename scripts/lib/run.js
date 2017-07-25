'use strict';

/**
 * Dependencies
 */
const path = require('path');
const status = require('./status');
const argv = require('yargs').argv;
const errors = require('meanie-express-error-handling');
const taskNameFromFile = require('./task-name');

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

  //Define mock request object for error handling
  const req = {
    isTask: true,
    taskName: taskNameFromFile(file),
  };

  console.log(req.taskName);

  //Load script and run it
  return Promise
    .try(() => require(path.resolve(file)))
    .then(script => script(argv))
    .then(() => status.ok())
    .catch(error => {
      errors.handler(error, req);
      status.error(error);
    })
    .then(() => run(scripts));
}

/**
 * Export interface
 */
module.exports = run;
