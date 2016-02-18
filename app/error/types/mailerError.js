'use strict';

/**
 * Dependencies
 */
let ServerError = require('./serverError');

/**
 * Constructor
 */
function MailerError(message) {
  ServerError.call(this, message);
}

/**
 * Extend prototype
 */
MailerError.prototype = Object.create(ServerError.prototype);
MailerError.prototype.constructor = MailerError;
MailerError.prototype.name = 'MailerError';

//Export
module.exports = MailerError;
