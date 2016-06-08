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
    name: 'Admin',
    email: 'admin@my-application.com',
    password: 'test123',
    isSuspended: false,
    isEmailVerified: true,
    roles: ['user', 'admin']
  }
];
