'use strict';

/**
 * Dependencies
 */
const path = require('path');
const moment = require('moment');
const errors = require('meanie-express-error-handling');
const sendgrid = require('sendgrid-mailer');
const SendMailError = errors.SendMailError;
const handlebars = require('./handlebars');
const loadPartial = require('../helpers/load-partial');
const config = require('../config');

/**
 * Config
 */
const SENDGRID_API_KEY = config.SENDGRID_API_KEY;
const EMAIL_IDENTITY_NOREPLY = config.EMAIL_IDENTITY_NOREPLY;
const EMAILS_PATH = path.resolve('./emails') + '/';

/**
 * Configure sendgrid mailer
 */
sendgrid.config(SENDGRID_API_KEY);
sendgrid.Promise = Promise;

/**
 * Helper to get globals
 */
function extractGlobals(req) {

  //If no request just return empty object
  if (!req) {
    return {};
  }

  //Return globals
  return {
    now: moment(),
    app: {
      title: req.app.locals.APP_TITLE,
      version: req.app.locals.APP_VERSION,
      url: req.locals.appUrl,
    },
    club: req.club,
  };
}

/**
 * Export mailer interface (wrapped in promise)
 */
const mailer = module.exports = {

  /**
   * Load an email composer
   */
  load(path, req) {

    //Load email generator
    const generator = require(EMAILS_PATH + path);

    //Load HTMl and text partials
    const html = loadPartial(EMAILS_PATH, path, 'hbs');
    const text = loadPartial(EMAILS_PATH, path, 'txt');

    //Extract globals from request
    const globals = extractGlobals(req);

    //Create email composer function
    const composer = function(...args) {

      //Generate email
      const email = generator(req, ...args);

      //Append globals to data
      Object.assign(email.data, globals);

      //Set default from identity
      if (!email.from) {
        email.from = EMAIL_IDENTITY_NOREPLY;
      }

      //Compile HTML and text
      email.html = handlebars.compile(html)(email.data);
      email.text = handlebars.compile(text)(email.data);

      //Append send handler
      email.send = function() {
        return mailer.send(email);
      };

      //Return email
      return email;
    };

    //Append helper method for promise chains
    composer.compose = function(...args) {
      return Promise.resolve(composer(...args));
    };

    //Return composer
    return composer;
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
