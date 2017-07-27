'use strict';

/**
 * Dependencies
 */
const path = require('path');
const status = require('./status');
const argv = require('yargs').argv;
const errors = require('meanie-express-error-handling');

/**
 * Helper to run scripts
 */
module.exports = async function runScripts(scripts, config) {

  //Convert to array if single script given
  if (!Array.isArray(scripts)) {
    scripts = [scripts];
  }

  //Done
  if (scripts.length === 0) {
    return;
  }

  //Get configuration and script file
  const {useErrorHandler, context, basePath} = config;
  const file = scripts.shift();
  const scriptName = file.replace(basePath, '').replace(/\.js/, '');

  //Log
  status.start('Running', path.basename(scriptName));

  //Try to run
  try {

    //Load script and run it
    const script = require(path.resolve(file));
    await script(argv);

    //Log success
    status.ok();
  }
  catch (error) {

    //Use error handler
    if (useErrorHandler) {
      errors.handler(error, Object.assign({scriptName}, context));
    }

    //Log error
    status.error(error);
  }

  //Run remaining scripts
  return runScripts(scripts, config);
};
