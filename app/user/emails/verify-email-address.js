'use strict';

/**
 * Dependencies
 */
let tokens = require('../../services/tokens');
let Locale = require('../../services/locale');
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
    instructions: locale.t('mail.verifyEmailAddress.instructions'),
    action: locale.t('mail.verifyEmailAddress.action')
  };

  //Load
  return mailer.load('user/emails/verify-email-address', data)
    .spread((text, html) => ({
      to: user.email,
      from: EMAIL_IDENTITY_NOREPLY,
      subject: locale.t('mail.verifyEmailAddress.subject'),
      text, html
    }));
};
