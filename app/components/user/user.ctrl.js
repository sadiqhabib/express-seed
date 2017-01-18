'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const errors = require('meanie-express-error-handling');
const NotFoundError = errors.NotFoundError;
const ValidationError = errors.ValidationError;
const mailer = require('../../services/mailer');

/**
 * Models
 */
const User = mongoose.model('User');
const UsedToken = mongoose.model('UsedToken');

/**
 * User controller
 */
module.exports = {

  /**
   * List
   */
  list(req, res) {

    //Get users
    const users = req.users.map(user => user.toJSON());

    //Output
    res.json(users);
  },

  /**
   * Get
   */
  get(req, res) {

    //Get data and status
    const user = req.user.toJSON();
    const status = req.isCreate ? 201 : 200;

    //Output
    res.status(status).json(user);
  },

  /**
   * Create
   */
  create(req, res, next) {

    //Get user data
    const data = User.parseData(req.data);

    //Mark as a create
    req.isCreate = true;

    //Create user
    User.create(data)
      .then(user => {
        req.user = user;
      })
      .then(next)
      .catch(next);
  },

  /**
   * Update
   */
  update(req, res, next) {

    //Get user and data
    const user = req.user;
    const data = User.parseData(req.data);

    //Set data
    user.setProperties(data);

    //Check if certain data changed
    const emailChanged = user.isModified('email');

    //Mark as non email verified if email was changed
    if (emailChanged) {
      user.isEmailVerified = false;
    }

    //Save user
    user.save()
      .then(user => {

        //Send new verification email
        if (emailChanged) {
          mailer
            .create('user/verify-email-address', req, user)
            .then(email => email.send())
            .catch(error => errors.handler(error, req));
        }

        //Set in request
        req.user = user;
      })
      .then(next)
      .catch(next);
  },

  /**
   * Delete
   */
  delete(req, res, next) {

    //Get data
    const user = req.user;

    //Remove
    user.remove()
      .then(() => res.status(204).end())
      .catch(next);
  },

  /**
   * Update password only
   */
  updatePassword(req, res, next) {

    //Get user
    const user = req.user;
    const claims = req.claims;

    //Update password
    user.password = req.body.password;

    //Save user
    user.save()
      .then(user => {

        //Send out credentials changed email
        mailer
          .create('user/credentials-changed', req, user)
          .then(email => email.send())
          .catch(error => errors.handler(error, req));

        //Mark token as used
        UsedToken.markAsUsed(claims)
          .catch(error => errors.handler(error, req));

        //Rend request
        res.end();
      })
      .catch(next);
  },

  /**
   * Verify email address
   */
  verifyEmail(req, res, next) {

    //Get user
    const user = req.user;

    //Mark as email verified
    user.isEmailVerified = true;

    //Save user
    user.save()
      .then(() => res.end())
      .catch(next);
  },

  /**************************************************************************
   * Unauthenticated actions
   ***/

  /**
   * Exists check
   */
  exists(req, res, next) {

    //Initialize filter and allowed filter properties
    const filter = {};
    const allowed = ['username'];

    //Find properties to filter on
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key) && allowed.indexOf(key) >= 0) {
        filter[key] = req.query[key];
      }
    }

    //No filter properties?
    if (Object.keys(filter).length === 0) {
      return res.json({exists: false});
    }

    //Check if exists
    User.find(filter)
      .limit(1)
      .then(users => (users.length > 0))
      .then(exists => res.json({exists}))
      .catch(next);
  },

  /**
   * Send password reset mail
   */
  sendPasswordResetEmail(req, res, next) {

    //Get user
    const user = req.user;

    //Send password reset email
    mailer
      .create('user/reset-password', req, user)
      .then(email => email.send())
      .then(() => res.end())
      .catch(next);
  },

  /**
   * Send username recovery email
   */
  sendUsernameRecoveryEmail(req, res, next) {

    //Get email and users
    const email = req.body.email;
    const users = req.users;

    //Send email
    mailer
      .create('user/recover-username', req, email, users)
      .then(email => email.send())
      .then(() => res.end())
      .catch(next);
  },

  /**
   * Send verification email
   */
  sendVerificationEmail(req, res, next) {

    //Get user
    const user = req.user;

    //Send email
    mailer
      .create('user/verify-email-address', req, user)
      .then(email => email.send())
      .then(() => res.end())
      .catch(next);
  },

  /**************************************************************************
   * Middleware
   ***/

  /**
   * Set user ID as per claims
   */
  setClaimedId(req, res, next) {

    //Set user ID
    req.userId = req.claims.user;
    next();
  },

  /**
   * Find by query
   */
  findByQuery(req, res, next) {

    //Find by query
    User
      .find({})
      .then(users => {
        req.users = users;
      })
      .then(next)
      .catch(next);
  },

  /**
   * Find users by email (for recovering usernames)
   */
  findByEmail(req, res, next) {

    //Get data
    const email = req.body.email;

    //No email?
    if (!email) {
      return next();
    }

    //Find by email
    User.find({email})
      .select('username firstName lastName')
      .then(users => {
        if (users.length === 0) {
          throw new NotFoundError();
        }
        req.users = users;
      })
      .then(next)
      .catch(next);
  },

  /**
   * Find by ID
   */
  findById(req, res, next) {

    //Get ID
    const id = req.userId;

    //Find by ID
    User.findById(id)
      .then(user => {
        if (!user) {
          throw new NotFoundError();
        }
        req.user = user;
      })
      .then(next)
      .catch(next);
  },

  /**
   * Find by username
   */
  findByUsername(req, res, next) {

    //Get data
    const username = req.body.username;
    if (!username) {
      return next();
    }

    //Find by username
    User
      .findOne({username})
      .then(user => {
        if (!user) {
          throw new NotFoundError();
        }
        req.user = user;
      })
      .then(next)
      .catch(next);
  },

  /**
   * Ensure username not in use
   */
  ensureUsernameNotInUse(checkId) {
    return function(req, res, next) {

      //Get username
      const username = req.body.username;

      //Prepare filter
      const filter = {username};
      if (checkId) {
        filter._id = {
          $ne: req.userId,
        };
      }

      //Check if doesn't exist
      User
        .findOne(filter)
        .then(user => {
          if (user) {
            throw new ValidationError({
              fields: {
                username: {
                  type: 'exists',
                  message: 'Username already in use',
                },
              },
            });
          }
        })
        .then(next)
        .catch(next);
    };
  },

  /**
   * Update last active
   */
  updateLastActive(req, res, next) {

    //Get user
    const user = req.user;

    //Update last active (async)
    user.lastActive = new Date();
    user.save().catch(error => errors.handler(error, req));

    //Next middleware
    next();
  },

  /**
   * Data collection
   */
  collectData(req, res, next) {

    //Check if we're creating a user
    const isCreate = !req.userId;

    //Extract posted data
    const {
      firstName, lastName, email, phone, address, username, password,
    } = req.body;

    //Prepare data object
    req.data = {firstName, lastName, email, phone, address, username};

    //Password is only appended when creating a new user.
    //For changing password we use a separate route.
    if (isCreate) {
      req.data.password = password;
    }

    //Next middleware
    next();
  },
};
