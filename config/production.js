'use strict';

/**
 * Environment configuration (production)
 */
module.exports = {

  /**
   * App settings
   */
  app: {
    baseUrl: 'http://my-application.com'
  },

  /**
   * Server settings
   */
  server: {
    port: process.env.PORT || 80
  },

  /**
   * Database settings
   */
  db: {
    uri: 'mongodb://localhost/my-application',
    options: {
      user: '',
      pass: ''
    }
  },

  /**
   * Sendgrid settings
   */
  sendgrid: {
    auth: {
      api_key: ''
    }
  }
};
