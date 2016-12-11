'use strict';

/**
 * Dependencies
 */
const jwt = require('meanie-express-jwt-service');

/**
 * Email generator
 */
module.exports = function(req, user) {

  //Generate a verify email token
  const token = jwt.generate('verifyEmail', {id: user._id.toString()});
  const route = '/email/verify/' + token;

  //Prepare data
  const to = user.email;
  const subject = 'Verify your email address';
  const data = {user, route};

  //Return
  return {to, subject, data};
};
