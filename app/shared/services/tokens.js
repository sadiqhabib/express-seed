'use strict';

/**
 * Dependencies
 */
let Promise = require('bluebird');
let jwt = Promise.promisifyAll(require('jsonwebtoken'));

/**
 * Check if token config is valid
 */
function isValidConfig(config) {
  if (!config.secret || !config.audience || !config.issuer) {
    return false;
  }
  return true;
}

/**
 * Defaults and registered token types
 */
let defaults = {};
let TypesMap = new Map();

/**
 * Module export
 */
module.exports = {

  /**
   * Set defaults
   */
  setDefaults(config) {
    Object.assign(defaults, config);
  },

  /**
   * Register token types
   */
  register(type, config) {

    //Invalid input
    if (!type) {
      return;
    }

    //Handle object maps
    if (typeof type === 'object') {
      for (let key in type) {
        if (type.hasOwnProperty(key)) {
          this.register(key, type[key]);
        }
      }
      return;
    }

    //Extend with default configuration and validate
    config = Object.assign({}, defaults, config);
    if (!isValidConfig(config)) {
      throw new Error('Invalid token configuration for type `' + type + '`');
    }

    //Store in map
    TypesMap.set(type, config);
  },

  /**
   * Generate a token
   */
  generate(type, claims) {

    //Check if type exists
    if (!TypesMap.has(type)) {
      throw new Error('Unknown token type `' + type + '`');
    }

    //Get config
    let config = TypesMap.get(type);

    //Return signed token
    return jwt.sign(claims || {}, config.secret, {
      audience: config.audience,
      issuer: config.issuer,
      expiresIn: config.expiration
    });
  },

  /**
   * Validate a token
   */
  validate(type, token) {

    //Check if type exists
    if (!TypesMap.has(type)) {
      return Promise.reject(
        new Error('Unknown token type `' + type + '`')
      );
    }

    //Get config
    let config = TypesMap.get(type);

    //Return as promise
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, {
        audience: config.audience,
        issuer: config.issuer
      }, (error, payload) => {
        return error ? reject(error) : resolve(payload);
      });
    });
  },

  /**
   * Get the expiration of a certain token type
   */
  getExpiration(type) {

    //Check if type exists
    if (!TypesMap.has(type)) {
      throw new Error('Unknown token type `' + type + '`');
    }

    //Get config and return expiration
    let config = TypesMap.get(type);
    return config.expiration || 0;
  }
};
