'use strict';

/**
 * Get package info and server port
 */
let pkg = require('../package.json');

/**
 * Environment configuration (production)
 */
module.exports = {

  //App
  APP_NAME: pkg.name,
  APP_VERSION: pkg.version,
  APP_BASE_URL: 'http://my-application.com',

  //API
  API_BASE_URL: 'http://my-application.com',
  API_BASE_PATH: '/api/',

  //CORS origins
  CORS_ORIGINS: [
    /[[a-z0-9\-]+\.]*my\-application\.com/
  ],

  //Server
  SERVER_PORT: process.env.PORT || 80,
  SERVER_HTTPS: false,
  SERVER_LATENCY: false,
  SERVER_LATENCY_MIN: 0,
  SERVER_LATENCY_MAX: 0,
  SERVER_PUBLIC_INDEX: './public/index.html',

  //Database
  DB_URI: 'mongodb://localhost/my-application',
  DB_DEBUG: false,
  DB_USER: '',
  DB_PASS: '',

  //Google cloud
  GCLOUD_STORAGE_BASE_URL: 'https://storage.googleapis.com/',
  GCLOUD_PROJECT_ID: '',
  GCLOUD_BUCKET_CONTENT: '',
  GCLOUD_LOG_PATH: '/var/log/app_engine/custom_logs/',
  GCLOUD_LOG_FILE: 'errors.log.json',

  //Github
  GITHUB_USER: '',
  GITHUB_REPO: '',
  GITHUB_TOKEN: '',
  GITHUB_USER_AGENT: '',

  //Error handling middleware
  ERROR_MIDDLEWARE: [
    'normalize', 'log-to-console', 'log-to-gcloud'
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
  TOKEN_DEFAULT_AUDIENCE: 'http://my-application.com/app',
  TOKEN_DEFAULT_ISSUER: 'http://my-application.com/api',
  TOKEN_TYPES: {
    access: {
      secret: '',
      expiration: 3600
    },
    refresh: {
      secret: '',
      expiration: 30 * 24 * 3600
    },
    verifyEmail: {
      secret: '',
      expiration: 48 * 3600
    },
    resetPassword: {
      secret: '',
      expiration: 24 * 3600
    }
  },

  //Sendgrid
  SENDGRID_API_KEY: '',

  //Cryptography
  BCRYPT_ROUNDS: 10,

  //User
  USER_PASSWORD_MIN_LENGTH: 6,
  USER_AVATAR_MAX_FILE_SIZE: 512 * 1024 //bytes
};
