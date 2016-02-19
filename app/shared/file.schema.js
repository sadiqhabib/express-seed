'use strict';

/**
 * Dependencies
 */
let Schema = require('mongoose').Schema;

/**
 * File schema
 */
let FileSchema = new Schema({
  url: String,
  mimeType: String,
  data: Buffer
}, {
  _id: false
});

/**
 * Transformation to JSON
 */
FileSchema.options.toJSON = {
  transform(doc, ret) {
    return ret.url || '';
  }
};

/**
 * Export schema
 */
module.exports = FileSchema;
