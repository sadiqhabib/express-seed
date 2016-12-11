'use strict';

/**
 * Dependencies
 */
const path = require('path');
const moment = require('moment');
const errors = require('meanie-express-error-handling');
const composer = require('meanie-mail-composer');
const sendgrid = require('sendgrid-mailer');
const SendMailError = errors.SendMailError;
const config = require('../config');

/**
 * Emails path
 */
const EMAILS_PATH = path.resolve('./app/emails/');

/**
 * Configure sendgrid mailer and mail composer
 */
sendgrid.config(config.SENDGRID_API_KEY);
composer.config({
  templateHtml: path.join(EMAILS_PATH, 'template.hbs'),
  templateText: path.join(EMAILS_PATH, 'template.txt'),
});

/**
 * Create locals for email templates from given context
 */
function createLocals(context) {
  return {
    now: moment(),
    app: {
      title: context.app.locals.APP_TITLE,
      version: context.app.locals.APP_VERSION,
      url: context.app.locals.APP_BASE_URL,
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

    //Use composer to generate email instance
    return composer.compose(mail, data);
  },

  /**
   * Send one or more emails
   */
  send(emails) {
    return sendgrid
      .send(emails)
      .catch(error => {
        throw new SendMailError(error);
      });
  },
};

/**
 * Append send shortcut method to email prototype
 */
composer.Email.prototype.send = function() {
  return mailer.send(this);
};
