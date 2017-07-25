'use strict';

/**
 * Dependencies
 */
const path = require('path');
const crypto = require('crypto');
const moment = require('moment');
const errors = require('meanie-express-error-handling');
const composer = require('meanie-mail-composer');
const sgMail = require('@sendgrid/mail');
const SendMailError = errors.SendMailError;
const config = require('../config');

/**
 * Emails path
 */
const EMAILS_PATH = path.resolve('./app/emails/');

/**
 * Configure sendgrid mailer and mail composer
 */
sgMail.setApiKey(config.SENDGRID_API_KEY);
composer.config({
  templateHtml: path.join(EMAILS_PATH, 'template.hbs'),
  templateText: path.join(EMAILS_PATH, 'template.txt'),
});

/**
 * Create locals for email templates from given data
 */
function createLocals(context) {

  //Extract data from context
  const {S3_BUCKET, APP_TITLE, APP_VERSION, APP_BASE_URL} = context.app.locals;

  //Return locals
  return {
    now: moment(),
    s3: {
      bucket: S3_BUCKET,
      base: 'https://' + S3_BUCKET,
    },
    app: {
      title: APP_TITLE,
      version: APP_VERSION,
      url: APP_BASE_URL,
    },
  };
}

/**
 * Export mailer interface (wrapped in promise)
 */
const mailer = module.exports = {

  /**
   * Create an email
   */
  create(type, context, ...args) {

    //Load mail generator and create locals from data
    const generator = require('../emails/' + type);
    const locals = createLocals(context);

    //Create mail data and append locals
    const mail = generator(...args);
    const data = Object.assign(mail.data || {}, locals);

    //Set default from if none set
    if (!mail.from) {
      mail.from = config.EMAIL_IDENTITY_NOREPLY;
    }

    //Add reply to address
    if (locals.club && locals.club.email) {
      if (typeof mail.replyTo === 'undefined') {
        mail.replyTo = locals.club.email;
      }
    }

    //Add custom args
    mail.uniqueArgs = mail.uniqueArgs || {};
    if (locals.club && locals.club.subdomain) {
      mail.uniqueArgs.club = locals.club.subdomain;
    }

    //Use composer to generate email instance
    return composer.compose(mail, data);
  },

  /**
   * Send one or more emails
   */
  send(emails) {

    //Ensure array given
    if (!Array.isArray(emails)) {
      emails = [emails];
    }

    //Ensure all emails have a recipient and check if anything to do
    emails = emails.filter(email => !!email.to);
    if (!emails.length) {
      return Promise.resolve();
    }

    //Send now
    return sgMail
      .sendMultiple(emails)
      .catch(error => {
        throw new SendMailError(error, error.response.body);
      });
  },
};

/**
 * Append send shortcut method to email prototype
 */
composer.Email.prototype.send = function() {
  return mailer.send(this);
};
