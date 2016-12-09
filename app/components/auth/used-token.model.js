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
  jti: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

//Index for JTI
UsedTokenSchema.index({jti: 1});

/**
 * Define model
 */
mongoose.model('UsedToken', UsedTokenSchema);
