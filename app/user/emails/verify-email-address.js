'use strict';

/**
 * Dependencies
 */
let Locale = require('../../services/locale');
let config = require('../../config');

/**
 * Constants
 */
const EMAIL_IDENTITY_NOREPLY = config.EMAIL_IDENTITY_NOREPLY;

/**
 * Verify email address email
 */
module.exports = function verifyEmailAddress(user) {

  //Set locale for translation
  let locale = new Locale(user.locale);

  //Return email
  return {
    to: user.email,
    from: EMAIL_IDENTITY_NOREPLY,
    subject: locale.t('user.verifyEmailAddress.mail.subject'),
    text: locale.t('user.verifyEmailAddress.mail.text'),
    html: locale.t('user.verifyEmailAddress.mail.html')
  };
};
