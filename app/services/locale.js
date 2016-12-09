'use strict';

/**
 * Dependencies
 */
const i18n = require('i18n');

/**
 * Create locale bound locale/translation service
 */
const Locale = function(locale) {

  //Set locale
  this.locale = locale;

  //Expose translation functions
  this.t = i18n.__;
};

//Export
module.exports = Locale;
