'use strict';

/**
 * Dependencies
 */
const chalk = require('chalk');
const config = require('../config');

/**
 * Constants
 */
const PROJECT_ID = config.GCLOUD_PROJECT_ID;

//Initialize
let gcloud;

//Validate we have an ID
if (!PROJECT_ID) {
  console.warn(chalk.yellow(
    'No GCLOUD_PROJECT_ID present in configuration. You need to set this up',
    'before you can use Google Cloud services.'
  ));
  gcloud = require('google-cloud')();
}

//Create and configure gcloud instance
else {
  gcloud = require('google-cloud')({
    projectId: PROJECT_ID,
    keyFilename: 'keys/gcloud-' + PROJECT_ID + '.json',
  });
}

//Export
module.exports = gcloud;
