'use strict';

/**
 * Dependencies
 */
const jwt = require('meanie-express-jwt-service');
const config = require('../../config');

/**
 * Email generator
 */
module.exports = function(req, user) {

  //Generate a verify email token
  const expiration = config.TOKEN_EXP_VERIFY_EMAIL;
  const payload = {id: user._id.toString()};
  const token = jwt.generate(payload, expiration);
  const route = '/email/verify/' + token;

  //Prepare data
  const to = user.email;
  const subject = 'Verify your email address';
  const data = {user, route};

  //Return
  return {to, subject, data};
};
