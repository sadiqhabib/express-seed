'use strict';

/**
 * Dependencies
 */
const jwt = require('meanie-express-jwt-service');
const config = require('../config');

//Setup token defaults
jwt.setDefaults({
  secret: config.TOKEN_SECRET,
});
