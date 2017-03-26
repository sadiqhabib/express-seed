'use strict';

/**
 * Get production environment to extend from
 */
const production = require('./production');

/**
 * Environment configuration (staging)
 */
module.exports = Object.assign({}, production, {

  //App and API base URL's
  APP_BASE_URL: 'https://staging.my-application.com',
  API_BASE_URL: 'https://staging.my-application.com',

  //CORS origins
  APP_ORIGINS: [
    /staging\.my\-application\.com/,
  ],
});
