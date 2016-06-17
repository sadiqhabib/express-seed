'use strict';

/**
 * Dependencies
 */
let Github = require('github');
let Promise = require('bluebird');
let config = require('../config');

/**
 * Config
 */
const TOKEN = config.GITHUB_TOKEN;
const USER = config.GITHUB_USER;
const REPO = config.GITHUB_REPO;
const USER_AGENT = config.GITHUB_USER_AGENT;

/**
 * Setup github
 */
let github = new Github({
  protocol: 'https',
  host: 'api.github.com',
  pathPrefix: '',
  timeout: 5000,
  headers: {
    'user-agent': USER_AGENT
  }
});

/**
 * Authenticate
 */
github.authenticate({
  type: 'oauth',
  token: TOKEN
});

/**
 * Promisify
 */
Promise.promisifyAll(github.issues);

/**
 * Export interface
 */
module.exports = {

  /**
   * Issues handling
   */
  issues: {

    /**
     * Create new issues
     */
    create(data) {

      //Append user/repo
      if (!data.user) {
        data.user = USER;
      }
      if (!data.repo) {
        data.repo = REPO;
      }

      //Return promise
      return github.issues.createAsync(data);
    }
  }
};
