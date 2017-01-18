'use strict';

/**
 * Dependencies
 */
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Some fixed ID's
 */
module.exports = {

  //Users
  USER_ADMIN: new ObjectId('111aee3e4527879d33c7b41a'),
  USER_PLAIN: new ObjectId('111aee3e4527879d33c7b41b'),
};
