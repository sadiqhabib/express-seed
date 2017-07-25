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
const PATH_TRANSFORMS = path.resolve('./app/transforms/');

/**
 * Register handlebars helpers
 */
fs.readdirSync(PATH_TRANSFORMS)
  .forEach(file => {
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const helperPath = path.join(PATH_TRANSFORMS, file);
    const helper = require(helperPath);
    handlebars.registerHelper(name, helper);
  });
