'use strict';

/**
 * Dependencies
 */
let mongoose = require('mongoose');
let User = mongoose.model('User');
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
