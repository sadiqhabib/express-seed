'use strict';

/**
 * Dependencies
 */
let i18n = require('i18n');

/**
 * Create locale bound locale/translation service
 */
let Locale = function(locale) {
  this.locale = locale;
  this.t = i18n.__;
};

//Export
module.exports = Locale;
