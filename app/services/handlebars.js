'use strict';

/**
 * Dependencies
 */
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

/**
 * Settings
 */
const PATH_HELPERS = './app/helpers/transform/';

/**
 * Register handlebars helpers
 */
fs.readdirSync(path.resolve(PATH_HELPERS))
  .forEach(file => {
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const helper = require(path.resolve(PATH_HELPERS + file));
    handlebars.registerHelper(name, helper);
  });

/**
 * Export handlebars service now
 */
module.exports = handlebars;
