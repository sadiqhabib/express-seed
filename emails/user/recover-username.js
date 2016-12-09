'use strict';

/**
 * Email generator
 */
module.exports = function recoverUsernameEmail(req, email, users) {

  //Check if multiple
  const isMultiple = (users.length > 1);
  const link = req.locals.appUrl + '/login';

  //Prepare data
  const to = email;
  const subject = 'Your username' + (isMultiple ? 's' : '');
  const data = {users, link, isMultiple};

  //Return
  return {to, subject, data};
};
