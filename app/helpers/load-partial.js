'use strict';

/**
 * Dependencies
 */
const fs = require('fs');
const readFileSync = fs.readFileSync;

/**
 * Partials cache
 */
const cache = new Map();

/**
 * Load a file helper
 */
function loadFile(BASE_PATH, path) {

  //Check if we have in cache
  if (!cache.has(path)) {
    const contents = readFileSync(BASE_PATH + path, 'utf8');
    cache.set(path, contents);
  }

  //Return from cache
  return cache.get(path);
}

/**
 * Load a single partial
 */
module.exports = function loadPartial(BASE_PATH, path, type) {

  //Load template and partial
  const template = loadFile(BASE_PATH, 'template.' + type);
  const partial = loadFile(BASE_PATH, path + '.' + type);

  //Return embedded
  return template.replace('{{partial}}', partial);
};
