'use strict';

/**
 * Dependencies
 */
let i18n = require('i18n');
let config = require('../../config');

/**
 * Constants
 */
const EMAIL_IDENTITY_NOREPLY = config.EMAIL_IDENTITY_NOREPLY;

/**
 * Verify email address email
 */
module.exports = function verifyEmailAddress(user) {
  return {
    to: user.email,
    from: EMAIL_IDENTITY_NOREPLY,
    subject: i18n.t('user.verifyEmailAddress.mail.subject'),
    text: i18n.t('user.verifyEmailAddress.mail.text'),
    html: i18n.t('user.verifyEmailAddress.mail.html')
  };
};
