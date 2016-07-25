'use strict';

/**
 * Dependencies
 */
let ids = require('./ids');

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
    roles: ['user', 'admin'],
  },
];
