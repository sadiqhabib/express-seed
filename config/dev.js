'use strict';

/**
 * Get base environment to extend from
 */
const base = require('./base');

/**
 * Environment configuration (production)
 */
module.exports = Object.assign({}, base, {

  //App
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
  SERVER_PORT: 8081,
  SERVER_LATENCY: true,
  SERVER_LATENCY_MIN: 500,
  SERVER_LATENCY_MAX: 1000,

  //Database
  DB_URI: 'mongodb://localhost/my-application',
  DB_USER: '',
  DB_PASS: '',
  DB_DEBUG: true,
  DB_AUTO_INDEX: true,

  //Google cloud
  GCLOUD_PROJECT_ID: '',
  GCLOUD_BUCKET_CONTENT: '',
  GCLOUD_TEST_FILES: [],

  //Sendgrid
  SENDGRID_API_KEY: 'provide in config/local.js',

  //Error handling middleware
  ERROR_MIDDLEWARE: [
    'normalize', 'log-to-console',
  ],

  //Tokens
  TOKEN_SECRET: 'SECRET_KEY',
});
