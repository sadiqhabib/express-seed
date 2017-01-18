'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * Generic ID setter middleware
 */
module.exports = function setId(key) {
  return function(req, res, next, id) {

    //If ID is invalid, try the next route
    if (!ObjectId.isValid(id)) {
      return next('route');
    }

    //Set in request
    req[key] = new ObjectId(id);
    next();
  };
};
