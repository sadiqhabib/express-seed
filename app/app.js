'use strict';

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
const raven = require('meanie-express-raven-service');
const jwt = require('meanie-express-jwt-service');
const router = require('./services/router');
const db = require('./services/db');
const auth = require('./services/auth');
const config = require('./config');

/**
 * Configuration
 */
const ENV = config.ENV;
const APP_VERSION = config.APP_VERSION;
const CORS_ORIGINS = config.CORS_ORIGINS;
const I18N_LOCALES = config.I18N_LOCALES;
const I18N_DEFAULT_LOCALE = config.I18N_DEFAULT_LOCALE;
const TOKEN_TYPES = config.TOKEN_TYPES;
const TOKEN_DEFAULT_ISSUER = config.TOKEN_DEFAULT_ISSUER;
const TOKEN_DEFAULT_AUDIENCE = config.TOKEN_DEFAULT_AUDIENCE;
const SERVER_LATENCY = config.SERVER_LATENCY;
const SERVER_LATENCY_MIN = config.SERVER_LATENCY_MIN;
const SERVER_LATENCY_MAX = config.SERVER_LATENCY_MAX;
const SENTRY_DSN = config.SENTRY_DSN;
const SENTRY_CONFIG = config.SENTRY_CONFIG;
const ERROR_MIDDLEWARE = config.ERROR_MIDDLEWARE;

//Increase stack trace limit for non production environments
if (ENV !== 'production') {
  Error.stackTraceLimit = Infinity;
}

//Use sentry
if (SENTRY_DSN) {
  raven(SENTRY_DSN, SENTRY_CONFIG);
}

//Configure i18n
i18n.configure({
  directory: 'app/locales',
  locales: I18N_LOCALES,
  defaultLocale: I18N_DEFAULT_LOCALE,
  objectNotation: true,
  api: {'__': 't'},
});

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

  //Setup JSON web tokens service
  jwt.setDefaults({
    issuer: TOKEN_DEFAULT_ISSUER,
    audience: TOKEN_DEFAULT_AUDIENCE,
  });
  jwt.register(TOKEN_TYPES);

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
