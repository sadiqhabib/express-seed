'use strict';

/**
 * Email generator
 */
module.exports = function credentialsChangedEmail(req, user) {

  //Prepare data
  const to = user.email;
  const subject = 'Your login details have changed';
  const data = {user};

  //Return
  return {to, subject, data};
};
