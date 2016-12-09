'use strict';

/**
 * Avatar controller
 */
module.exports = {

  /**
   * Save avatar
   */
  save(req, res, next) {

    //Get user and uploaded file
    const user = req.user;
    const file = req.file;

    //Save file data
    user.avatar = file;

    //Save user
    user.save()
      .then(user => user.avatar)
      .then(avatar => avatar.toJSON())
      .then(avatar => res.json({avatar}))
      .catch(next);
  },

  /**
   * Delete avatar
   */
  delete(req, res, next) {

    //Get user and remove file data
    const user = req.user;
    user.avatar = null;

    //Save
    user.save()
      .then(() => res.status(200).send())
      .catch(next);
  },

  /**************************************************************************
   * Middleware
   ***/

  /**
   * Configure file handler
   */
  configure(req, res, next) {

    //Get user
    let user = req.user;

    //Get configuration
    const BUCKET = req.app.locals.GCLOUD_BUCKET_CONTENT;
    const MAX_FILE_SIZE = req.app.locals.USER_AVATAR_MAX_FILE_SIZE;
    const MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    //Configure file handling
    req.fileConfig = {
      existing: user.avatar,
      bucket: BUCKET,
      field: 'avatar',
      folder: 'avatars',
      name: user._id.toString(),
      timestamp: true,
      maxFileSize: MAX_FILE_SIZE,
      mimeTypes: MIME_TYPES,
    };

    //Continue with next middleware
    next();
  },
};
