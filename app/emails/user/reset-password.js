'use strict';

/**
 * Dependencies
 */
const jwt = require('meanie-express-jwt-service');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const config = require('../../config');

/**
 * Email generator
 */
module.exports = function resetPasswordEmail(user) {

  //Generate unique token identifier
  const id = new ObjectId();
  const expiration = config.TOKEN_EXP_RESET_PASSWORD;
  const payload = Object.assign(user.getClaims(), {
    id: id.toString(),
    once: true,
    scope: 'user:password',
  });

  //Generate a password reset token
  const token = jwt.generate(payload, expiration);
  const route = '/reset/password/' + token;
  const numHours = Math.floor(expiration / 3600);

  //Prepare data
  const to = user.email;
  const subject = 'Reset your password';
  const data = {user, route, numHours};

  //Return
  return {to, subject, data};
};
