'use strict';

/**
 * Dependencies
 */
const roles = require('./roles');

/**
 * Scopes map
 */
module.exports = {

  //User scopes
  [roles.USER]: [
    'user:own',
    'user:password',
  ],

  //Admin scopes
  [roles.ADMIN]: [
    'user:own',
    'user:password',
    'user:read',
    'user:write',
  ],
};
