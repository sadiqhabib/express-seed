'use strict';

/**
 * Dependencies
 */
const Schema = require('mongoose').Schema;
const config = require('../../config');

/**
 * Constants
 */
const BASE_URL = config.GCLOUD_STORAGE_BASE_URL;

/**
 * Schema generator
 */
function extendFileSchema(fields, _id = false) {

  //Define fields
  fields = Object.assign({
    bucket: String,
    path: String,
  }, fields || {});

  //Create schema
  const FileSchema = new Schema(fields, {_id});

  //Add transform
  FileSchema.options.toJSON = {
    transform(doc, ret) {
      if (ret.path && ret.bucket) {
        return BASE_URL + ret.bucket + '/' + ret.path;
      }
      return null;
    },
  };

  //Return
  return FileSchema;
}

/**
 * Create basic schema and expose creation method
 */
const FileSchema = extendFileSchema(null, false);
FileSchema.extend = extendFileSchema;

/**
 * Export schema
 */
module.exports = FileSchema;
