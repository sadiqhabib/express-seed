'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const errors = require('meanie-express-error-handling');
const ObjectId = mongoose.Types.ObjectId;
const BadRequestError = errors.BadRequestError;

/**
 * Generic ID setter middleware
 */
module.exports = function setId(key) {
  return function(req, res, next, id) {

    //Validate ID
    if (!ObjectId.isValid(id)) {
      return next(new BadRequestError());
    }

    //Set in request
    req[key] = new ObjectId(id);
    next();
  };
};
