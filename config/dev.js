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
  APP_ORIGINS: [
    /localhost:8081/,
    /chrome-extension:\/\/aicmkgpgakddgnaphhhpliifpcfhicfo/,
    /192\.168\.1\.[0-9]+/,
  ],

  //API
  API_BASE_URL: 'http://localhost:8081',
  API_BASE_PATH: '/api/',

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

  //S3
  S3_ACCESS_KEY: 'provide in config/local.js',
  S3_SECRET_KEY: 'provide in config/local.js',
  S3_REGION: 'ap-southeast-2',
  S3_BUCKET: 'dev-content.my-application.com',
  S3_BUCKET_URL: 'https://dev-content.my-application.com/',

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
