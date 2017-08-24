'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const errors = require('meanie-express-error-handling');
const InvalidTokenError = errors.InvalidTokenError;

/**
 * Models
 */
const User = mongoose.model('User');

/**
 * User service
 */
const UserService = module.exports = {

  /**
   * Find user by token payload
   */
  findByClaims(claims) {

    //Check claims
    if (!claims || !claims.user) {
      throw new InvalidTokenError('No payload or no user ID in payload');
    }

    //Get user ID
    const id = claims.user;

    //Find user by ID
    return UserService.findById(id);
  },

  /**
   * Find user by username and password
   */
  findByUsernameAndPassword(username, password) {

    //No username or no password given?
    if (!username || !password) {
      return Promise.resolve(null);
    }

    //Find by username
    return UserService
      .findByUsername(username)
      .then(user => {

        //No user or user has no password?
        if (!user || !user.password) {
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
    return User
      .findById(id)
      .select('_id roles');
  },

  /**
   * Find user by username
   */
  findByUsername(username) {
    return User
      .findOne({username})
      .select('_id roles password');
  },
};
