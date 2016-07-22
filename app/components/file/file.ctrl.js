'use strict';

/**
 * Dependencies
 */
let multer = require('multer');
let mimeTypesFilter = require('meanie-multer-mime-types-filter');
let errors = require('meanie-express-error-handling');
let BadRequestError = errors.BadRequestError;
let FileTooLargeError = errors.FileTooLargeError;
let gcloud = require('../../services/gcloud');
let gcs = gcloud.storage();

/**
 * Helper to generate a path for a GCS file
 */
function gcsPath(folder, name, mimeType, timestamp) {
  let extension = mimeType.split('/')[1].toLowerCase().replace('jpeg', 'jpg');
  if (timestamp) {
    name += '_' + String(Math.floor(Date.now() / 1000));
  }
  return folder + '/' + name + '.' + extension;
}

/**
 * File controller
 */
module.exports = {

  /**
   * Upload using multer
   */
  upload(req, res, next) {

    //Get GCS config
    let config = req.fileConfig;
    if (!config) {
      return next();
    }

    //Create upload middleware
    let upload = multer({
      storage: multer.memoryStorage(),
      fileFilter: mimeTypesFilter(config.mimeTypes),
      limits: {
        fileSize: config.maxFileSize,
      },
    }).single(config.field);

    //Use middleware
    upload(req, res, function(error) {
      if (error) {
        if (error.message === 'File too large') {
          error = new FileTooLargeError(config.maxFileSize);
        }
        else {
          error = new BadRequestError(error.message);
        }
      }
      next(error);
    });
  },

  /**
   * Stream to cloud
   */
  streamToCloud(req, res, next) {

    //Get GCS config
    let config = req.fileConfig;
    if (!config) {
      return next();
    }

    //Get config params
    let {bucket, folder, name, timestamp} = config;

    //Get uploaded file and path for bucket
    let file = req.file;
    if (!file) {
      return next(new BadRequestError('No file'));
    }

    //Get data
    let contentType = file.mimetype;
    let path = gcsPath(folder, name, contentType, timestamp);

    //Prepare file and stream
    let gcsBucket = gcs.bucket(bucket);
    let gcsFile = gcsBucket.file(path);
    let stream = gcsFile.createWriteStream({
      metadata: {
        contentType,
      },
    });

    //Handle errors
    stream.on('error', error => {
      next(error);
    });

    //When done, overwrite file object
    stream.on('finish', () => {
      req.file = {
        bucket, path,
      };
      next();
    });

    //Upload now
    stream.end(file.buffer);
  },

  /**
   * Delete an existing file from cloud
   */
  deleteFromCloud(req, res, next) {

    //Get GCS config
    let config = req.fileConfig;
    if (!config) {
      return next();
    }

    //Get data
    let data = config.existing;
    if (!data || !data.bucket || !data.path) {
      return next();
    }

    //Get test files
    const TEST_FILES = req.app.locals.GCLOUD_TEST_FILES;

    //Don't delete test files
    if (TEST_FILES && TEST_FILES.indexOf(data.path) !== -1) {
      console.warn('Not deleting test file ', data.path, 'from cloud storage');
      return next();
    }

    //Get GCS bucket and file
    let gcsBucket = gcs.bucket(data.bucket);
    let gcsFile = gcsBucket.file(data.path);

    //Delete the file (allow failures but log errors)
    gcsFile.delete(error => {
      if (error) {
        errors.handler(error, req);
      }
      next();
    });
  },
};
