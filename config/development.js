'use strict';

/**
 * Environment configuration (development)
 */
module.exports = {

  /**
   * App settings
   */
  app: {
    baseUrl: 'http://localhost:8080'
  },

  /**
   * API settings
   */
  api: {
    baseUrl: 'http://localhost:' + (process.env.PORT || 8081) + '/api/v1/'
  },

  /**
   * Server settings
   */
  server: {
    port: process.env.PORT || 8081
  },

  /**
   * Database settings
   */
  db: {
    uri: 'mongodb://localhost/my-application',
    debug: true,
    options: {
      user: '',
      pass: ''
    }
  },

  /**
   * Authentication settings
   */
  auth: {
    refreshToken: {
      httpsOnly: false
    }
  }
};
