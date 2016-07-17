'use strict';

/**
 * Dependencies
 */
let config = require('../config');

/**
 * Constants
 */
const PROJECT_ID = config.GCLOUD_PROJECT_ID;

//Create and configure gcloud instance
let gcloud = require('gcloud')({
  projectId: PROJECT_ID,
  keyFilename: 'keys/gcloud-' + PROJECT_ID + '.json',
});

//Export
module.exports = gcloud;
