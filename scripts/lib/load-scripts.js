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

  //Strip of JS extension
  target = target.replace(/\.js$/, '');

  //Load multiple files
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    return glob.sync(path.join(target, '*.js'));
  }

  //Load single file
  return [target];
};
