'use strict';

/**
 * Dependencies
 */
const jwt = require('meanie-express-jwt-service');
const config = require('../config');

//Setup token defaults
jwt.setDefaults({
  issuer: config.TOKEN_ISSUER,
  audience: config.TOKEN_AUDIENCE,
  secret: config.TOKEN_SECRET,
});
