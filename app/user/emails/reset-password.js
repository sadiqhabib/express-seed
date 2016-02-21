'use strict';

/**
 * Dependencies
 */
let Locale = require('../../services/locale');
let tokens = require('../../services/tokens');
let config = require('../../config');

/**
 * Constants
 */
const EMAIL_IDENTITY_NOREPLY = config.EMAIL_IDENTITY_NOREPLY;
const APP_BASE_URL = config.APP_BASE_URL;
const RESET_PASSWORD_TOKEN_EXPIRATION = tokens.getExpiration('resetPassword');

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

  //Create data for i18n
  let data = {
    link: APP_BASE_URL + '/password/reset/' + token,
    validity: Math.floor(RESET_PASSWORD_TOKEN_EXPIRATION / 3600)
  };

  //Create email (TODO: html email should be in a template)
  return {
    to: user.email,
    from: EMAIL_IDENTITY_NOREPLY,
    subject: locale.t('user.resetPassword.mail.subject'),
    text: locale.t('user.resetPassword.mail.text', data),
    html: locale.t('user.resetPassword.mail.html', data)
  };
};
