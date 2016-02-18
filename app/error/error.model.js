'use strict';

/**
 * External dependencies
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * Error schema
 */
let ErrorSchema = new Schema({
  name: {
    type: String
  },
  code: {
    type: String
  },
  message: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  data: {},
  stack: {},
  request: {},
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

/**
 * Define model
 */
mongoose.model('Error', ErrorSchema);
