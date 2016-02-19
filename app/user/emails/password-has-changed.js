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
 * Password changed helper
 */
module.exports = function passwordHasChangedEmail(user) {
  return {
    to: user.email,
    from: EMAIL_IDENTITY_NOREPLY,
    subject: i18n.t('user.passwordHasChanged.mail.subject'),
    text: i18n.t('user.passwordHasChanged.mail.text'),
    html: i18n.t('user.passwordHasChanged.mail.html')
  };
};
