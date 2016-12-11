'use strict';

/**
 * Email generator
 */
module.exports = function(email, users) {

  //Check if multiple
  const isMultiple = (users.length > 1);
  const route = '/login';

  //Prepare data
  const to = email;
  const subject = 'Your username' + (isMultiple ? 's' : '');
  const data = {users, route, isMultiple};

  //Return
  return {to, subject, data};
};
