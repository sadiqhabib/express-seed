'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const User = mongoose.model('User');

/**
 * Task
 */
module.exports = function() {
  return User
    .find({})
    .then(users => {
      //Do something with users
      console.log(users);
    });
};
