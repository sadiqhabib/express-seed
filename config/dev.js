'use strict';

/**
 * Get package info and server port
 */
let pkg = require('../package.json');

/**
 * Environment configuration (dev)
 */
module.exports = {

  //App
  APP_NAME: pkg.name,
  APP_VERSION: pkg.version,
  APP_BASE_URL: 'http://localhost:8080',

  //API
  API_VERSION: 1,
  API_BASE_PATH: '/api/v1/',

  //Server
  SERVER_PORT: process.env.PORT || 8081,
  SERVER_HTTPS: false,

  //Database
  DB_URI: 'mongodb://localhost/my-application',
  DB_DEBUG: true,
  DB_USER: '',
  DB_PASS: '',

  //Internationalization
  I18N_LOCALES: ['en'],
  I18N_DEFAULT_LOCALE: 'en',

  //Email identities
  EMAIL_IDENTITY_NOREPLY: 'My Application <no-reply@my-application.com>',
  EMAIL_IDENTITY_ADMIN: 'Admin <admin@my-application.com>',

  //Authentication
  REFRESH_TOKEN_COOKIE_MAX_AGE: 30 * 24 * 3600, //seconds
  REFRESH_TOKEN_COOKIE_SECURE: false,

  //Tokens
  TOKEN_DEFAULT_AUDIENCE: 'http://my-application.com/app',
  TOKEN_DEFAULT_ISSUER: 'http://my-application.com/api',
  TOKEN_TYPES: {
    access: {
      secret: 'test',
      expiration: 3600
    },
    refresh: {
      secret: 'test',
      expiration: 30 * 24 * 3600
    },
    verifyEmail: {
      secret: 'test',
      expiration: 48 * 3600
    },
    resetPassword: {
      secret: 'test',
      expiration: 24 * 3600
    }
  },

  //Sendgrid
  SENDGRID_API_KEY: '',

  //Cryptography
  BCRYPT_ROUNDS: 10
};
