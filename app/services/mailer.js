'use strict';

/**
 * Dependencies
 */
let fs = require('fs');
let path = require('path');
let Promise = require('bluebird');
let sendgrid = require('sendgrid');
let types = require('meanie-express-error-types');
let readFile = Promise.promisify(fs.readFile);
let SendMailError = types.SendMailError;
let config = require('../config');

/**
 * Initialise sendgrid
 */
let sg = sendgrid.SendGrid(config.SENDGRID_API_KEY);

/**
 * Split name and email address
 */
function splitNameEmail(str) {

  //If no email bracket indicator present, return as is
  if (str.indexOf('<') === -1) {
    return ['', str];
  }

  //Split into name and email
  let [name, email] = str.split('<');

  //Fix up
  name = name.trim();
  email = email.replace('>', '').trim();

  //Return as array
  return [name, email];
}

/**
 * Convert plain data to sendgrid mail object
 */
function getMail(data) {

  //Extract email/name
  if (data.to && data.to.indexOf('<') !== -1) {
    let [name, email] = splitNameEmail(data.to);
    data.to = email;
    data.toname = name;
  }
  if (data.from && data.from.indexOf('<') !== -1) {
    let [name, email] = splitNameEmail(data.from);
    data.from = email;
    data.fromname = name;
  }

  //Get sendgrid classes
  let Mail = sendgrid.mail.Mail;
  let Email = sendgrid.mail.Email;
  let Content = sendgrid.mail.Content;
  let Personalization = sendgrid.mail.Personalization;

  //Create new mail object
  let mail = new Mail();

  //Create recipients
  let recipients = new Personalization();
  recipients.addTo(new Email(data.to, data.toname));

  //Set recipients
  mail.addPersonalization(recipients);

  //Set sender
  mail.setFrom(new Email(data.from, data.fromname));

  //Set subject
  mail.setSubject(data.subject);

  //Add content
  mail.addContent(new Content('text/plain', data.text));
  mail.addContent(new Content('text/html', data.html));

  //Return it
  return mail;
}

/**
 * Send email (wrapped in promise)
 */
function sendMail(mail) {
  return new Promise((resolve, reject) => {

    //Build request
    let request = sg.emptyRequest();
    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = mail.toJSON();

    //Send request
    sg.API(request, response => {
      if (response && response.statusCode &&
        response.statusCode >= 200 && response.statusCode <= 299) {
        resolve(response);
      }
      reject(new SendMailError(
        'Sendgrid response error ' + response.statusCode
      ));
    });
  });
}

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
   * Split name and email address
   */
  splitNameEmail(identity) {
    return splitNameEmail(identity);
  },

  /**
   * Load an email (both plain text and html)
   */
  load(email, data) {

    //Get filenames
    let text = path.resolve('./app/' + email + '.txt');
    let html = path.resolve('./app/' + email + '.html');

    //Return promise
    return Promise.all([
      readFile(text, 'utf8'),
      readFile(html, 'utf8')
    ]).then(result => result.map(contents => replaceData(contents, data)));
  },

  /**
   * Send mail
   */
  send(data) {

    //Array
    if (Array.isArray(data)) {

      //No emails
      if (data.length === 0) {
        return Promise.resolve();
      }

      //Multiple emails
      let promises = data
        .map(getMail)
        .map(sendMail);

      //Return all promises wrapped
      return Promise.all(promises);
    }

    //Get and send the mail
    let mail = getMail(data);
    return sendMail(mail);
  }
};

/**
 * Helper to replace data
 */
function replaceData(contents, data) {
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let regex = new RegExp('{{' + key + '}}', 'g');
      contents = contents.replace(regex, data[key]);
    }
  }
  return contents;
}
