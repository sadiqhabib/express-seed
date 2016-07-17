'use strict';

/**
 * Dependencies
 */
let Schema = require('mongoose').Schema;
let config = require('../../config');

/**
 * Constants
 */
const BASE_URL = config.GCLOUD_STORAGE_BASE_URL;

/**
 * Google Cloud Storage file schema
 */
let FileSchema = new Schema({
  bucket: String,
  path: String,
}, {
  _id: false,
});

/**
 * Transformation to JSON
 */
FileSchema.options.toJSON = {
  transform(doc, ret) {
    if (ret.path && ret.bucket) {
      return BASE_URL + ret.bucket + '/' + ret.path;
    }
    return null;
  },
};

/**
 * Export schema
 */
module.exports = FileSchema;
