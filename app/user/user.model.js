'use strict';

/**
 * Dependencies
 */
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;
let config = require('../config');

/**
 * Schemas
 */
let AddressSchema = require('../shared/address.schema');
let FileSchema = require('../shared/file.schema');

/**
 * Configuration
 */
const BCRYPT_ROUNDS = config.BCRYPT_ROUNDS;
const USER_PASSWORD_MIN_LENGTH = config.USER_PASSWORD_MIN_LENGTH;

/**
 * Helper to create full name
 */
function createFullName(firstName, lastName) {
  return String(firstName + ' ' + lastName).trim();
}

/**
 * User schema
 */
let UserSchema = new Schema({

  //Personal details
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    default: ''
  },
  avatar: FileSchema,

  //Contact details
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  address: AddressSchema,

  //Security
  password: {
    type: String,
    required: true,
    trim: true
  },
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user']
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  usedTokens: [String]
});

/**
 * Pre save hook to hash passwords
 */
UserSchema.pre('save', function(next) {

  //Create full name
  this.fullName = createFullName(this.firstName, this.lastName);

  //Check if email address modified
  if (this.isModified('email')) {
    this.isEmailVerified = false;
  }

  //Check if password modified and present
  if (!this.isModified('password')) {
    return next();
  }

  //Validate password
  if (!this.password || this.password.length < USER_PASSWORD_MIN_LENGTH) {
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
 * Email with name
 */
UserSchema.virtual('emailWithName').get(() => {
  if (!this.email) {
    return '';
  }
  if (!this.fullName) {
    return this.email;
  }
  return this.fullName + ' <' + this.email + '>';
});

/**
 * Password validation helper
 */
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
    if (error) {
      return cb(error);
    }
    cb(null, isMatch);
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
    roles: this.roles
  };
};

/**
 * Helper to populate users
 */
function populate(query) {
  return query;
}

/**
 * Find users by ID and populates data as needed
 */
UserSchema.statics.findByIdAndPopulate = function(id) {
  let query = this.findById(id);
  return populate(query);
};

/**
 * Find users by email and populates data as needed
 */
UserSchema.statics.findByEmailAndPopulate = function(email) {
  let query = this.findOne({
    email: email
  });
  return populate(query);
};

/**
 * Transformation to JSON
 */
UserSchema.options.toJSON = {
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;

    //Delete authentication related data
    delete ret.password;
    delete ret.roles;
    delete ret.usedTokens;

    //Delete unnecessary data
    delete ret.fullName;
  }
};

/**
 * Define model
 */
mongoose.model('User', UserSchema);
