'use strict';

/**
 * Local environment configuration
 */
module.exports = {

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
   * Sendgrid settings
   */
  sendgrid: {
    auth: {
      api_key: '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'
    }
  }
};
