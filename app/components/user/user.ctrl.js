'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const jwt = require('meanie-express-jwt-service');
const errors = require('meanie-express-error-handling');
const BadRequestError = errors.BadRequestError;
const NotFoundError = errors.NotFoundError;
const InvalidTokenError = errors.InvalidTokenError;
const ExpiredTokenError = errors.ExpiredTokenError;
const ValidationError = errors.ValidationError;
const UserSuspendedError = errors.UserSuspendedError;
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
   * Get data of authenticated user
   */
  me(req, res, next) {

    //Initialize user JSON
    const user = req.me;

    //Update last active
    user.lastActive = new Date();
    user.save().catch(error => errors.handler(error, req));

    //Next middleware
    next();
  },

  /**
   * Get user data
   */
  get(req, res) {

    //Get data and status
    const user = req.me.toJSON();
    const status = req.isCreate ? 201 : 200;

    //Output
    res.status(status).json(user);
  },

  /**
   * Create user
   */
  create(req, res, next) {

    //Get user data
    const data = User.parseData(req.data);
    data.isEmailVerified = false;

    //Mark as a create
    req.isCreate = true;

    //Create user
    User.create(data)
      .then(user => {
        req.me = user;
        mailer
          .create('user/verify-email-address', req, user)
          .then(email => email.send())
          .catch(error => errors.handler(error, req));
      })
      .then(next)
      .catch(next);
  },

  /**
   * Update user
   */
  update(req, res, next) {

    //Get user and data
    const user = req.me;
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
        req.me = user;
      })
      .then(next)
      .catch(next);
  },

  /**
   * Patch
   */
  patch(req, res, next) {

    //Get user
    const user = req.me;

    //Determine what to patch
    const property = req.property;
    const value = req.data[property];
    const patch = User.parseData({[property]: value});

    //Set the property
    user[property] = patch[property];

    //Save the user
    user.save()
      .then(() => res.json(patch))
      .catch(next);
  },

  /**
   * Change credentials
   */
  changeCredentials(req, res, next) {

    //Get user and new username/password
    const user = req.me;
    const {username, password} = req.body;

    //Set username
    user.username = username;

    //Set new password if not empty
    if (password) {
      user.password = password;
    }

    //Save user
    user.save()
      .then(user => {
        mailer
          .create('user/credentials-changed', req, user)
          .then(email => email.send())
          .catch(error => errors.handler(error, req));
      })
      .then(() => res.end())
      .catch(next);
  },

  /**
   * Exists check
   */
  exists(req, res, next) {

    //Initialize filter and allowed filter properties
    let filter = {};
    let allowed = ['username'];

    //Find properties to filter on
    for (let key in req.query) {
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

    //If no user was found, send response anyway to prevent hackers from
    //figuring out which email addresses are valid and which aren't.
    if (!req.me) {
      return res.end();
    }

    //Get user
    const user = req.me;

    //Send password reset email
    mailer
      .create('user/reset-password', req, user)
      .then(email => email.send())
      .catch(next);
  },

  /**
   * Reset password
   */
  resetPassword(req, res, next) {

    //Get user
    const user = req.me;
    const jti = req.jti;

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
        if (jti) {
          UsedToken
            .create({jti})
            .catch(error => errors.handler(error, req));
        }

        //Rend request
        res.end();
      })
      .catch(next);
  },

  /**
   * Send usernames email
   */
  sendUsernamesEmail(req, res, next) {

    //Get email and users
    const email = req.body.email;
    const users = req.users;

    //Send email
    mailer
      .create('user/recover-username', req, email, users)
      .then(email => email.send())
      .catch(next);
  },

  /**
   * Send verification email
   */
  sendVerificationEmail(req, res, next) {

    //Get user
    const user = req.me;

    //Send email
    mailer
      .create('user/verify-email-address', req, user)
      .then(email => email.send())
      .catch(next);
  },

  /**
   * Verify sent email verification token
   */
  verifyEmail(req, res, next) {

    //Get user
    const user = req.me;

    //Mark as email verified
    user.isEmailVerified = true;

    //Save user
    user.save()
      .then(() => res.json({isValid: true}))
      .catch(next);
  },

  /**************************************************************************
   * Middleware
   ***/

  /**
   * Set user for avatar controller
   */
  setUser(req, res, next) {
    req.user = req.me;
    next();
  },

  /**
   * Set patch property
   */
  setProperty(req, res, next, property) {

    //Valid properties
    const properties = [
      'name',
    ];

    //Invalid?
    if (properties.indexOf(property) === -1) {
      return next(new BadRequestError());
    }

    //Set in request
    req.property = property;
    next();
  },

  /**
   * Find by username (doesn't trigger 404's)
   */
  findByUsername(req, res, next) {

    //Get data
    const username = req.body.username;
    if (!username) {
      return next();
    }

    //Find by username
    User.findOne({username})
      .then(user => {

        //Found?
        if (user) {

          //Check if suspended
          if (user.isSuspended) {
            throw new UserSuspendedError();
          }
        }

        //Set in request
        req.me = user;
      })
      .then(next)
      .catch(next);
  },

  /**
   * Find users by email
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

        //Nothing found?
        if (users.length === 0) {
          throw new NotFoundError();
        }

        //Set in request
        req.users = users;
      })
      .then(next)
      .catch(next);
  },

  /**
   * Find user by token
   */
  findByToken(req, res, next) {

    //Get token and validate
    const token = req.query.token || req.body.token;
    if (!token) {
      return next(new BadRequestError());
    }

    //Validate token
    jwt.validate(token)
      .then(payload => {
        if (payload.jti) {
          return UsedToken
            .findOne({jti: payload.jti})
            .then(used => {
              if (used) {
                throw new ExpiredTokenError('Already used');
              }
              req.jti = payload.jti;
              return payload.id;
            });
        }
        return payload.id;
      })
      .then(id => User.findById(id))
      .then(user => {
        if (!user) {
          throw new InvalidTokenError('No matching user found');
        }
        req.me = user;
      })
      .then(next)
      .catch(next);
  },

  /**
   * Ensure username not in use
   */
  ensureUsernameNotInUse(req, res, next) {

    //Get data
    const userId = req.me._id;
    const username = req.body.username;

    //Prepare filter
    const filter = {username};
    if (userId) {
      filter._id = {
        $ne: userId,
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
  },

  /**
   * Data collection
   */
  collectData(req, res, next) {

    //Extract posted data and collect other data from request
    const user = req.me;
    const {
      firstName, lastName, username, password, email, phone, address,
    } = req.body;

    //Prepare data object
    req.data = {firstName, lastName, email, phone, address};

    //Username and password are only appended when creating a new user
    //For editing, we use a separate route with higher security.
    if (!user || !user.password) {
      req.data.username = username;
      req.data.password = password;
    }

    //Next middleware
    next();
  },
};
