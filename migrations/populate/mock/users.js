'use strict';

/**
 * Dependencies
 */
const ids = require('./ids');
const roles = require('../../../app/constants/roles');

/**
 * Users
 */
module.exports = [
  {
    _id: ids.USER_ADMIN,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@my-application.com',
    username: 'admin',
    password: 'test123',
    isEmailVerified: true,
    roles: [roles.USER, roles.ADMIN],
  },
  {
    _id: ids.USER_PLAIN,
    firstName: 'Plain',
    lastName: 'User',
    email: 'user@my-application.com',
    username: 'user',
    password: 'test123',
    isEmailVerified: true,
    roles: [roles.USER],
  },
];
