'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const User = mongoose.model('User');

/**
 * Migration
 */
module.exports = async function(argv) {

  //Determine data set to use
  const data = argv.data || 'mock';

  //Get data
  const users = require('./' + data + '/users');

  //Remove and then add users
  await User.remove({});
  await User.create(users);
};
