'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Used token schema
 */
const UsedTokenSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

/**
 * Mark a token as used (if it was a one time use token)
 */
UsedTokenSchema.statics.markAsUsed = function(claims) {

  //Not one time use or no token ID?
  if (!claims || !claims.once || !claims.id) {
    return Promise.resolve();
  }

  //Mark as used
  return this.create({_id: claims.id});
};

/**
 * Check if a token has been used before
 */
UsedTokenSchema.statics.checkIfUsed = function(claims) {

  //Not a one time use token or no token ID
  if (!claims || !claims.once || !claims.id) {
    return Promise.resolve(false);
  }

  //Check if used
  return this
    .findById(claims.id)
    .select('_id')
    .then(used => !!used);
};

/**
 * Define model
 */
mongoose.model('UsedToken', UsedTokenSchema);
