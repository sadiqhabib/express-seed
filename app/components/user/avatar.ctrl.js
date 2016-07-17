'use strict';

/**
 * Swatch controller
 */
module.exports = {

  /**
   * Upload image
   */
  save(req, res, next) {

    //Get user
    let user = req.user;
    let file = req.file;

    //Save file data
    user.avatar = file;

    //Save
    user.save()
      .then(user => res.json({avatar: user.avatar.toJSON()}))
      .catch(next);
  },

  /**
   * Delete image
   */
  delete(req, res, next) {

    //Get user and clear avatar data
    let user = req.user;
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

    //Get config
    const BUCKET = req.app.locals.GCLOUD_BUCKET_CONTENT;
    const MAX_FILE_SIZE = req.app.locals.USER_AVATAR_MAX_FILE_SIZE;
    const MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

    //Get user
    let user = req.user;

    //Configure file handling
    req.fileConfig = {
      existing: user.avatar,
      bucket: BUCKET,
      field: 'avatar',
      folder: 'avatars',
      name: user.id,
      timestamp: true,
      maxFileSize: MAX_FILE_SIZE,
      mimeTypes: MIME_TYPES,
    };

    //Continue with next middleware
    next();
  },
};
