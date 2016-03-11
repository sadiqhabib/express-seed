'use strict';

/**
 * Dependencies
 */
let Locale = require('../../services/locale');
let tokens = require('../../services/tokens');
let mailer = require('../../services/mailer');
let config = require('../../config');

/**
 * Constants
 */
const EMAIL_IDENTITY_NOREPLY = config.EMAIL_IDENTITY_NOREPLY;
const APP_BASE_URL = config.APP_BASE_URL;
const TOKEN_EXPIRATION = tokens.getExpiration('resetPassword');

/**
 * Verification email helper
 */
module.exports = function resetPassword(user) {

  //Set locale for translation
  let locale = new Locale(user.locale);

  //Generate a password reset token
  let token = tokens.generate('resetPassword', {
    id: user.id
  });

  //Get link and number of hours link is valid
  let link = APP_BASE_URL + '/password/reset/' + token;
  let numHours = Math.floor(TOKEN_EXPIRATION / 3600);

  //Create data for emails
  let data = {
    link,
    instructions: locale.t('user.resetPassword.mail.instructions'),
    action: locale.t('user.resetPassword.mail.action'),
    validityNotice: locale.t('user.resetPassword.mail.validityNotice', {
      numHours
    }),
    ignoreNotice: locale.t('user.resetPassword.mail.ignoreNotice')
  };

  //Load
  return mailer.load('reset-password', data)
    .spread((text, html) => ({
      to: user.email,
      from: EMAIL_IDENTITY_NOREPLY,
      subject: locale.t('user.resetPassword.mail.subject'),
      text, html
    }));
};
