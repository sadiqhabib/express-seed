'use strict';

/**
 * Dependencies
 */
const jwt = require('meanie-express-jwt-service');

/**
 * Email generator
 */
module.exports = function verifyEmailAddressEmail(req, user) {

  //Generate a verify email token
  const token = jwt.generate('verifyEmail', {id: user._id.toString()});
  const link = req.locals.appUrl + '/email/verify/' + token;

  //Prepare data
  const to = user.email;
  const subject = 'Verify your email address';
  const data = {user, link};

  //Return
  return {to, subject, data};
};
