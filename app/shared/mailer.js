'use strict';

/**
 * External dependencies
 */
let nodemailer = require('nodemailer');
let sendgrid = require('nodemailer-sendgrid-transport');

/**
 * Application dependencies
 */
let config = require('app/config');

/**
 * Constants
 */
const SENDGRID_API_KEY = config.SENDGRID_API_KEY;

/**
 * Create mailer
 */
let mailer = nodemailer.createTransport(sendgrid({
  auth: {
    api_key: SENDGRID_API_KEY
  }
}));

/**
 * Export mailer interface (wrapped in promise)
 */
module.exports = {

  /**
   * Helper to concatenate name and email address
   */
  concatNameEmail: function(name, email) {
    return name + ' <' + email + '>';
  },

  /**
   * Send mail
   */
  sendMail: function(email) {
    return new Promise(function(fulfill, reject) {
      mailer.sendMail(email, function(error) {
        if (error) {
          return reject(error);
        }
        fulfill();
      });
    });
  }
};
