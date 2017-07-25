'use strict';

/**
 * Dependencies
 */
const path = require('path');

/**
 * Task name determination helper
 */
module.exports = function taskName(file) {
  const parts = file.split(path.sep);
  const i = parts.indexOf('tasks');
  return parts
    .filter((part, index) => index > i)
    .reduce((task, part) => task + '/' + part)
    .replace(/\.js/, '');
};
