'use strict';

/**
 * Environment files contain environment specific configuration, like API keys, database
 * passwords, etc. You can create as many environment files as needed. If you want to
 * create a local environment file (for local keys/passwords that won't be included in
 * version control), please run `meanie env`. To create any other named environment, run
 * `meanie env environment-name`.
 */

/**
 * Get package info and project assets
 */
var pkg = require('../package.json');

/**
 * Constants
 */
var ACCESS_TOKEN_LIFE = 3600;
var REFRESH_TOKEN_LIFE = 30 * 24 * 3600;

/**
 * Environment configuration (shared/base configuration)
 */
module.exports = {

  /**
   * App settings
   */
  app: {
    name: pkg.name,
    version: pkg.version,
    baseUrl: '/'
  },

  /**
   * API settings
   */
  api: {
    version: 1,
    baseUrl: '/api/v1/'
  },

  /**
   * Authentication settings
   */
  auth: {
    refreshToken: {
      httpsOnly: true,
      maxAge: REFRESH_TOKEN_LIFE //seconds
    }
  },

  /**
   * Token settings
   */
  token: {
    audience: 'http://my-application.com/app',
    issuer: 'http://my-application.com/api',
    types: {
      access: {
        secret: '',
        expiration: ACCESS_TOKEN_LIFE //seconds
      },
      refresh: {
        secret: '',
        expiration: REFRESH_TOKEN_LIFE //seconds
      },
      verifyEmail: {
        secret: '',
        expiration: 48 * 3600 //seconds
      },
      resetPassword: {
        secret: '',
        expiration: 24 * 3600 //seconds
      }
    }
  },

  /**
   * Cryptography settings
   */
  bcrypt: {
    rounds: 10
  },

  /**
   * Internationalization settings
   */
  i18n: {
    directory: 'app/locales',
    locales: ['en'],
    defaultLocale: 'en',
    objectNotation: true
  },

  /**
   * Mailer settings
   */
  mailer: {
    from: {
      noreply: 'My Application <no-reply@my-application.com>'
    },
    to: {
      admin: 'Admin <admin@my-application.com>'
    }
  },

  /**
   * Storage settings
   */
  storage: {
    path: 'data'
  }
};
