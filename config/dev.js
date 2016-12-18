'use strict';

/**
 * Get package info and server port
 */
const pkg = require('../package.json');

/**
 * Environment configuration (dev)
 */
module.exports = {

  //App
  APP_NAME: pkg.name,
  APP_VERSION: pkg.version,
  APP_BASE_URL: 'http://localhost:8080',

  //API
  API_BASE_URL: 'http://localhost:8081',
  API_BASE_PATH: '/api/',

  //CORS origins
  CORS_ORIGINS: [
    /localhost\:8080/,
    /192\.168\.1\.[0-9]+/,
  ],

  //Server
  SERVER_PORT: process.env.PORT || 8081,
  SERVER_LATENCY: true,
  SERVER_LATENCY_MIN: 500,
  SERVER_LATENCY_MAX: 1000,
  SERVER_PUBLIC_INDEX: '',

  //Database
  DB_URI: 'mongodb://localhost/my-application',
  DB_USER: '',
  DB_PASS: '',
  DB_DEBUG: true,
  DB_AUTO_INDEX: true,

  //Google cloud
  GCLOUD_STORAGE_BASE_URL: 'https://storage.googleapis.com/',
  GCLOUD_PROJECT_ID: '',
  GCLOUD_BUCKET_CONTENT: '',
  GCLOUD_TEST_FILES: [],

  //Error handling middleware
  ERROR_MIDDLEWARE: [
    'normalize', 'log-to-console',
  ],

  //Internationalization
  I18N_LOCALES: ['en'],
  I18N_DEFAULT_LOCALE: 'en',

  //Email identities
  EMAIL_IDENTITY_NOREPLY: 'My Application <no-reply@my-application.com>',
  EMAIL_IDENTITY_ADMIN: 'Admin <admin@my-application.com>',

  //Authentication
  REFRESH_TOKEN_COOKIE_MAX_AGE: 30 * 24 * 3600, //seconds
  REFRESH_TOKEN_COOKIE_SECURE: false,
  SECURE_STATUS_EXPIRATION: 300, //seconds

  //Tokens
  TOKEN_AUDIENCE: 'http://my-application.com/app',
  TOKEN_ISSUER: 'http://my-application.com/api',
  TOKEN_SECRET: 'SECRET_STRING_CHANGE_ME',
  TOKEN_EXP_ACCESS: 3600,
  TOKEN_EXP_REFRESH: 30 * 24 * 3600,
  TOKEN_EXP_VERIFY_EMAIL: 7 * 24 * 3600,
  TOKEN_EXP_RESET_PASSWORD: 24 * 3600,

  //Sendgrid
  SENDGRID_API_KEY: '',

  //Cryptography
  BCRYPT_ROUNDS: 10,

  //User
  USER_PASSWORD_MIN_LENGTH: 6,
  USER_AVATAR_MAX_FILE_SIZE: 512 * 1024, //bytes
};
