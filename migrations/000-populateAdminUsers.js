'use strict';

/**
 * Application dependencies
 */
let User = require('app/user/user.model');

/**
 * Data
 */
let users = [
  {
    name: 'Admin',
    email: 'admin@my-application.com',
    password: 'test123',
    isSuspended: false,
    isEmailVerified: true,
    roles: ['admin']
  }
];

/**
 * Migration
 */
module.exports = {

  /**
   * Migrate up
   */
  up: function(cb) {
    User.create(users, cb);
  },

  /**
   * Migrate down
   */
  down: function(cb) {
    let emails = users.map((user) => user.email);
    User.remove({
      email: {
        $in: emails
      }
    }, cb);
  }
};
