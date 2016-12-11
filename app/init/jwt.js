'use strict';

/**
 * Dependencies
 */
const jwt = require('meanie-express-jwt-service');
const config = require('../config');

//Setup tokens
jwt.setDefaults({
  issuer: config.TOKEN_DEFAULT_ISSUER,
  audience: config.TOKEN_DEFAULT_AUDIENCE,
});
jwt.register(config.TOKEN_TYPES);
