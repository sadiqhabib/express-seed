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
const PATH_HELPERS = path.resolve('./app/helpers/transform/');

/**
 * Register handlebars helpers
 */
fs.readdirSync(PATH_HELPERS)
  .forEach(file => {
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const helperPath = path.join(PATH_HELPERS, file);
    const helper = require(helperPath);
    handlebars.registerHelper(name, helper);
  });
