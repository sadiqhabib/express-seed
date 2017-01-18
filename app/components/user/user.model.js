'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const errors = require('meanie-express-error-handling');
const Schema = mongoose.Schema;
const ValidationError = errors.ValidationError;
const config = require('../../config');
const roles = require('../../constants/roles');
const combineScopes = require('../auth/helpers/combine-scopes');

/**
 * Schemas
 */
const AddressSchema = require('./address.schema');
const FileSchema = require('../file/file.schema');

/**
 * Configuration
 */
const DEFAULT_LOCALE = config.I18N_DEFAULT_LOCALE;
const BCRYPT_ROUNDS = config.BCRYPT_ROUNDS;

/**
 * User schema
 */
const UserSchema = new Schema({

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
  },
  phone: {
    type: String,
    trim: true,
  },
  address: AddressSchema,

  //Security
  username: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  roles: {
    type: [{
      type: String,
      enum: Object.values(roles),
    }],
    default: [roles.USER],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  lastActive: {
    type: Date,
  },
});

//Index for logging in, looking up users and finding existing usernames
UserSchema.index({username: 1}, {unique: true});

/**
 * Data pre-parser
 */
UserSchema.statics.parseData = function(data) {
  return data;
};

/**
 * Hash password
 */
UserSchema.pre('save', function(next) {

  //Check if password modified
  if (!this.isModified('password')) {
    return next();
  }

  //Validate password
  if (!this.password) {
    return next(new ValidationError({
      fields: {
        password: {
          type: 'required',
        },
      },
    }));
  }

  //Generate salt
  bcrypt
    .genSalt(BCRYPT_ROUNDS)
    .then(salt => bcrypt.hash(this.password, salt))
    .then(hash => {
      this.password = hash;
    })
    .then(next)
    .catch(next);
});

/**
 * Email with name
 */
UserSchema.virtual('emailWithName').get(function() {
  if (!this.email) {
    return '';
  }
  if (this.firstName || this.lastName) {
    return String(this.firstName + ' ' + this.lastName).trim() +
      ' <' + this.email + '>';
  }
  return this.email;
});

/**
 * Password validation helper
 */
UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Has role checker
 */
UserSchema.methods.hasRole = function(role) {
  return this.roles.includes(role);
};

/**
 * Get claims for an access token
 */
UserSchema.methods.getClaims = function() {
  return {
    user: this._id.toString(),
    roles: this.roles,
    scope: combineScopes(this.roles).join(' '),
  };
};

/**
 * Transformation to JSON
 */
UserSchema.options.toJSON = {
  transform(doc, ret) {
    delete ret.password;
  },
};

/**
 * Define model
 */
mongoose.model('User', UserSchema);
