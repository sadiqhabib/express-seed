'use strict';

/**
 * Dependencies
 */
const AWS = require('aws-sdk');
const config = require('../config');

/**
 * Config
 */
const S3_REGION = config.S3_REGION;
const S3_ACCESS_KEY = config.S3_ACCESS_KEY;
const S3_SECRET_KEY = config.S3_SECRET_KEY;

/**
 * Configure AWS service
 */
AWS.config.update({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET_KEY,
  region: S3_REGION,
});

/**
 * Export
 */
module.exports = new AWS.S3();
