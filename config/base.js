'use strict';

/**
 * Get package info and server port
 */
const pkg = require('../package.json');

/**
 * Environment configuration (production)
 */
module.exports = {

  //App
  APP_NAME: pkg.name,
  APP_VERSION: pkg.version,
  APP_TITLE: 'My Application',

  //Google cloud
  GCLOUD_STORAGE_BASE_URL: 'https://storage.googleapis.com/',

  //Internationalization
  I18N_LOCALES: ['en'],
  I18N_DEFAULT_LOCALE: 'en',

  //Email identities
  EMAIL_IDENTITY_NOREPLY: 'My Application <no-reply@my-application.com>',
  EMAIL_IDENTITY_ADMIN: 'Admin <admin@my-application.com>',

  //Authentication
  REFRESH_TOKEN_COOKIE_MAX_AGE: 30 * 24 * 3600, //seconds
  SECURE_STATUS_EXPIRATION: 300, //seconds

  //Tokens
  TOKEN_AUDIENCE: 'http://my-application.com/app',
  TOKEN_ISSUER: 'http://my-application.com/api',
  TOKEN_EXP_ACCESS: 3600,
  TOKEN_EXP_REFRESH: 30 * 24 * 3600,
  TOKEN_EXP_VERIFY_EMAIL: 7 * 24 * 3600,
  TOKEN_EXP_RESET_PASSWORD: 24 * 3600,

  //Cryptography
  BCRYPT_ROUNDS: 15,

  //User
  USER_PASSWORD_MIN_LENGTH: 8,
  USER_AVATAR_MAX_FILE_SIZE: 512 * 1024, //bytes
};
