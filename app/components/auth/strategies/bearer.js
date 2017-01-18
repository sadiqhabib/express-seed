'use strict';

/**
 * Dependencies
 */
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const validateToken = require('../helpers/validate-token');
const findUserByClaims = require('../helpers/find-user-by-claims');

/**
 * Bearer strategy
 */
module.exports = function() {
  passport.use(new BearerStrategy((accessToken, cb) => {
    validateToken(accessToken)
      .then(findUserByClaims)
      .then(([user, claims]) => cb(null, user, claims))
      .catch(cb);
  }));
};
