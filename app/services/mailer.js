'use strict';

/**
 * Dependencies
 */
let Promise = require('bluebird');
let nodemailer = require('nodemailer');
let sendgrid = require('nodemailer-sendgrid-transport');
let SendMailError = require('../error/type/server/send-mail');
let config = require('../config');

/**
 * Constants
 */
const SENDGRID_API_KEY = config.SENDGRID_API_KEY;

/**
 * Create mailer
 */
let mailer = Promise.promisifyAll(
  nodemailer.createTransport(
    sendgrid({
      auth: {
        api_key: SENDGRID_API_KEY
      }
    })
  )
);

/**
 * Export mailer interface (wrapped in promise)
 */
module.exports = {

  /**
   * Helper to concatenate name and email address
   */
  concatNameEmail(name, email) {
    return name + ' <' + email + '>';
  },

  /**
   * Send mail
   */
  send(email) {
    return mailer.sendMailAsync(email)
      .catch(error => {
        throw new SendMailError(error);
      });
  }
};
