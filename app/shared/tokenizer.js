'use strict';

/**
 * External dependencies
 */
let jwt = require('jsonwebtoken');
let chalk = require('chalk');

/**
 * Application dependenices
 */
let config = require('app/config');

/**
 * Configuration
 */
const TOKEN_AUDIENCE = config.TOKEN_AUDIENCE;
const TOKEN_ISSUER = config.TOKEN_ISSUER;
const TOKEN_SECRETS = config.TOKEN_SECRETS;
const TOKEN_EXPIRATIONS = config.TOKEN_EXPIRATIONS;

/**
 * Parse token config for a certain type
 */
function parseConfig(type, cfg) {
  return Object.assign({
    audience: TOKEN_AUDIENCE,
    issuer: TOKEN_ISSUER,
    secret: TOKEN_SECRETS[type] || '',
    expiration: TOKEN_EXPIRATIONS[type] || 0
  }, cfg || {});
}

/**
 * Ensure token config is valid
 */
function ensureValidConfig(cfg) {
  if (!cfg.secret || !cfg.audience || !cfg.issuer) {
    return false;
  }
  return true;
}

/**
 * Module export
 */
module.exports = {

  /**
   * Generate a token
   */
  generate: function(type, claims, cfg) {

    //Parse and validate config
    cfg = parseConfig(type, cfg);
    if (!ensureValidConfig(cfg)) {
      console.warn(chalk.yellow(
        'Missing secret, audience or issuer for token configuration of type', type));
      return '';
    }

    //Return signed token
    return jwt.sign(cfg.claims || {}, cfg.secret, {
      audience: cfg.audience,
      issuer: cfg.issuer,
      expiresIn: cfg.expiration
    });
  },

  /**
   * Validate a token
   */
  validate: function(type, token, cfg) {
    return new Promise(function(resolve, reject) {

      //Parse and validate configuration
      cfg = parseConfig(type, cfg);
      if (!ensureValidConfig(cfg)) {
        return reject(new Error('Missing secret for token configuration of type ' + type));
      }

      //Verify token with secret
      jwt.verify(token, cfg.secret, {
        audience: cfg.audience,
        issuer: cfg.issuer
      }, function(error, payload) {
        if (error) {
          return reject(error);
        }
        resolve(payload);
      });
    });
  }
};
