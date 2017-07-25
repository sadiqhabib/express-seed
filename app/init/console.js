'use strict';

/**
 * Dependencies
 */
const chalk = require('chalk');

/**
 * Helper to create a wrapper
 */
function wrap(method, color, handler = 'log') {
  console[method] = function(...args) {
    console[handler](chalk[color](...args));
  };
}

//Save original methods
console._warn = console.warn;
console._error = console.error;

//Create wrappers
wrap('warn', 'yellow', '_warn');
wrap('error', 'red', '_error');
wrap('success', 'green');
wrap('info', 'grey');
