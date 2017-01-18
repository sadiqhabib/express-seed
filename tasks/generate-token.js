'use strict';

/**
 * Dependencies
 */
const chalk = require('chalk');
const jwt = require('meanie-express-jwt-service');
const scopes = require('../app/constants/scopes');

/**
 * Init
 */
require('../app/init/jwt');

/**
 * Generate a token for a given role/id and with given expiration
 */
module.exports = function(argv) {

  //Get data
  const {user, role, exp} = argv;

  //Validate
  if (!user || !role) {
    return Promise.reject(new Error('Must specify role and user ID'));
  }
  if (!scopes[role]) {
    return Promise.reject(new Error('Invalid role'));
  }

  //Generate payload
  const scope = scopes[role].join(' ');
  const payload = {user, role, scope};
  const expiration = exp || 3600;
  const accessToken = jwt.generate(payload, expiration);

  //Log
  console.log(
    '\n\nYour', chalk.cyan(role), 'access token for user ID', chalk.cyan(user),
    '(exp ' + chalk.cyan(expiration) + ') is:' +
    '\n' + chalk.green(accessToken) + '\n'
  );

  //Indicate task done
  return Promise.resolve();
};
