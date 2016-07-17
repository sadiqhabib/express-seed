'use strict';

/**
 * Dependencies
 */
let mongoose = require('mongoose');
let errors = require('meanie-express-error-handling');
let InvalidTokenError = errors.InvalidTokenError;

/**
 * Models
 */
let User = mongoose.model('User');

/**
 * User service
 */
let UserService = module.exports = {

  /**
   * Find user by token payload
   */
  findByTokenPayload(payload) {

    //Check payload
    if (!payload || !payload.id) {
      throw new InvalidTokenError('No payload or no ID in payload');
    }

    //Get ID
    let id = payload.id;

    //Find user by ID
    return UserService.findById(id);
  },

  /**
   * Find user by email and password
   */
  findByEmailAndPassword(req, email, password) {
    return UserService.findByEmail(email)
      .then(user => {

        //No user?
        if (!user) {
          return null;
        }

        //Compare password
        return user.comparePassword(password)
          .then(isMatch => isMatch ? user : null);
      });
  },

  /**
   * Find user by ID
   */
  findById(id) {
    return User.findById(id);
  },

  /**
   * Find user by email
   */
  findByEmail(email) {
    return User.findOne({email});
  },
};
