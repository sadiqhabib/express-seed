'use strict';

/**
 * Dependencies
 */
const i18n = require('i18n');
const config = require('../config');

/**
 * Configuration
 */
const I18N_LOCALES = config.I18N_LOCALES;
const I18N_DEFAULT_LOCALE = config.I18N_DEFAULT_LOCALE;

//Configure i18n
i18n.configure({
  directory: 'app/locales',
  locales: I18N_LOCALES,
  defaultLocale: I18N_DEFAULT_LOCALE,
  objectNotation: true,
  api: {'__': 't'},
});
