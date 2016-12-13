'use strict';

/**
 * Dependencies
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Scripts loader
 */
module.exports = function loadScripts(target) {

  //Load multiple files
  if (fs.statSync(target).isDirectory()) {
    return glob.sync(path.join(target, '*.js'));
  }

  //Load single file
  return target;
};
