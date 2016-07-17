'use strict';

/**
 * Dependencies
 */
let mongoose = require('mongoose');
let Promise = require('bluebird');
let bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;
let config = require('../../config');

/**
 * Schemas
 */
let AddressSchema = require('./address.schema');
let FileSchema = require('../file/file.schema');

/**
 * Configuration
 */
const DEFAULT_LOCALE = config.I18N_DEFAULT_LOCALE;
const BCRYPT_ROUNDS = config.BCRYPT_ROUNDS;
const PASSWORD_MIN_LENGTH = config.USER_PASSWORD_MIN_LENGTH;

/**
 * User schema
 */
let UserSchema = new Schema({

  //Personal details
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: FileSchema,
  locale: {
    type: String,
    default: DEFAULT_LOCALE,
  },

  //Contact details
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  address: AddressSchema,

  //Security
  password: {
    type: String,
    required: true,
    trim: true,
  },
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin'],
    }],
    default: ['user'],
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  isPending: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  usedTokens: [String],
});

/**
 * Pre save hook to hash passwords
 */
UserSchema.pre('save', function(next) {

  //Check if email address modified
  if (this.isModified('email')) {
    this.isEmailVerified = false;
  }

  //Check if password modified and present
  if (!this.isModified('password')) {
    return next();
  }

  //Validate password
  if (!this.password || this.password.length < PASSWORD_MIN_LENGTH) {
    return next('Invalid password');
    //TODO use proper error format for validation errors
  }

  //Get self
  let self = this;

  //Generate salt
  bcrypt.genSalt(BCRYPT_ROUNDS, function(error, salt) {
    if (error) {
      return next(error);
    }

    //Hash password
    bcrypt.hash(self.password, salt, function(error, hash) {
      if (error) {
        return next(error);
      }

      //Set hashed password
      self.password = hash;
      next();
    });
  });
});

/**
 * Password validation helper
 */
UserSchema.methods.comparePassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
      if (error) {
        return reject(error);
      }
      resolve(isMatch);
    });
  });
};

/**
 * Has role checker
 */
UserSchema.methods.hasRole = function(role) {
  return this.roles.includes(role);
};

/**
 * Add a user role
 */
UserSchema.methods.addRole = function(role) {
  if (!this.roles.includes(role)) {
    this.roles.push(role);
  }
};

/**
 * Get claims
 */
UserSchema.methods.getClaims = function() {
  return {
    id: this._id.toString(),
    roles: this.roles,
  };
};

/**
 * Transformation to JSON
 */
UserSchema.options.toJSON = {
  transform(doc, ret) {

    //Delete sensitive data
    delete ret.password;
    delete ret.usedTokens;
  },
};

/**
 * Define model
 */
mongoose.model('User', UserSchema);
