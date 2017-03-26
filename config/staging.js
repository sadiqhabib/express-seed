'use strict';

/**
 * Get production environment to extend from
 */
const production = require('./production');

/**
 * Environment configuration (staging)
 */
module.exports = Object.assign({}, production, {

  //App
  APP_BASE_URL: 'https://staging.my-application.com',
  APP_ORIGINS: [
    /staging\.my\-application\.com/,
  ],

  //API
  API_BASE_URL: 'https://staging.my-application.com',

  //S3
  S3_BUCKET: 'staging-content.my-application.com',
  S3_BUCKET_URL: 'https://staging-content.my-application.com/',
});
