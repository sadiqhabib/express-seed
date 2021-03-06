'use strict';

/**
 * Dependencies
 */
const path = require('path');
const run = require('./lib/run');

//Run with predefined settings
run({
  basePath: path.resolve(__dirname, '..', 'tasks'),
  useErrorHandler: true,
  context: {
    isTask: true,
  },
});
