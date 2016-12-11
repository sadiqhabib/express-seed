'use strict';

/**
 * Load initializers
 */
require('./init/error-handling');
require('./init/jwt');
require('./init/i18n');
require('./init/handlebars');

/**
 * Dependencies
 */
const i18n = require('i18n');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const errors = require('meanie-express-error-handling');
const router = require('./services/router');
const db = require('./services/db');
const auth = require('./services/auth');
const config = require('./config');

/**
 * Configuration
 */
const APP_VERSION = config.APP_VERSION;
const CORS_ORIGINS = config.CORS_ORIGINS;
const SERVER_LATENCY = config.SERVER_LATENCY;
const SERVER_LATENCY_MIN = config.SERVER_LATENCY_MIN;
const SERVER_LATENCY_MAX = config.SERVER_LATENCY_MAX;
const ERROR_MIDDLEWARE = config.ERROR_MIDDLEWARE;

/**
 * Export module
 */
module.exports = function() {

  //Initialize express app
  let app = express();

  //Set locals
  app.locals = config;

  //Setup database
  db(app);

  //Trust proxy (for Cloud hosted forwarding of requests)
  app.set('trust_proxy', 1);

  //CORS
  app.use(cors({
    origin: CORS_ORIGINS,
    credentials: true, //NOTE: needed for cross domain cookies to work
  }));

  //Compression
  app.use(compression({
    level: 3,
    filter(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
  }));

  //Logger
  app.use(morgan('dev'));

  //Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({extended: true}));

  //Parse application/json
  app.use(bodyParser.json());
  app.use(bodyParser.json({type: 'application/vnd.api+json'}));

  //Add cookie parser middleware
  app.use(cookieParser());

  //Use i18n
  app.use(i18n.init);

  //Simulate latency
  if (SERVER_LATENCY) {
    let latency = require('express-simulate-latency')({
      min: SERVER_LATENCY_MIN,
      max: SERVER_LATENCY_MAX,
    });
    app.use(latency);
  }

  //Load authentication
  auth(app);

  //Set global headers
  app.all('/*', (req, res, next) => {
    res.header('X-Version', APP_VERSION);
    next();
  });

  //Load router
  router(app);

  //Create error handling middleware stack
  errors
    .middleware(ERROR_MIDDLEWARE.concat(['send']))
    .forEach(handler => app.use(handler));

  //Return express server instance
  return app;
};
