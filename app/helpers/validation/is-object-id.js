'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * Object ID validator
 */
module.exports = function isObjectId(data) {

  //Handle arrays
  if (Array.isArray(data)) {
    return data.every(id => ObjectId.isValid(id));
  }

  //Single ID
  return ObjectId.isValid(data);
};
