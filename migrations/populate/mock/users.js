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
    password: 'test123',
    isSuspended: false,
    isEmailVerified: true,
    roles: [roles.USER, roles.ADMIN],
  },
];
