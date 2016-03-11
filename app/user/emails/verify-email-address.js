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

/**
 * Verify email address email
 */
module.exports = function verifyEmailAddress(user) {

  //Set locale for translation
  let locale = new Locale(user.locale);

  //Generate a verify email token
  let token = tokens.generate('verifyEmail', {
    id: user.id
  });

  //Create data for emails
  let data = {
    link: APP_BASE_URL + '/email/verify/' + token,
    instructions: locale.t('user.verifyEmailAddress.mail.instructions'),
    action: locale.t('user.verifyEmailAddress.mail.action')
  };

  //Load
  return mailer.load('verify-email-address', data)
    .spread((text, html) => ({
      to: user.email,
      from: EMAIL_IDENTITY_NOREPLY,
      subject: locale.t('user.verifyEmailAddress.mail.subject'),
      text, html
    }));
};
