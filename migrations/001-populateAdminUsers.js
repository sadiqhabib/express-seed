'use strict';

/**
 * Dependencies
 */
let User = require('app/user/user.model');
let users = require('./mock/users');

/**
 * Migration
 */
module.exports = {

  /**
   * Migrate up
   */
  up() {
    return User.create(users);
  },

  /**
   * Migrate down
   */
  down() {
    let emails = users.map((user) => user.email);
    return User.remove({
      email: {
        $in: emails
      }
    });
  }
};
