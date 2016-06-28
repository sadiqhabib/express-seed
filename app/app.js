'use strict';

/**
 * Dependencies
 */
let path = require('path');
let i18n = require('i18n');
let cors = require('cors');
let morgan = require('morgan');
let express = require('express');
let bodyParser = require('body-parser');
let compression = require('compression');
let serveStatic = require('serve-static');
let cookieParser = require('cookie-parser');
let router = require('./services/router');
let tokens = require('./services/tokens');
let db = require('./services/db');
let auth = require('./services/auth');
let config = require('./config');

/**
 * Configuration
 */
const CORS_ORIGINS = config.CORS_ORIGINS;
const I18N_LOCALES = config.I18N_LOCALES;
const I18N_DEFAULT_LOCALE = config.I18N_DEFAULT_LOCALE;
const TOKEN_TYPES = config.TOKEN_TYPES;
const TOKEN_DEFAULT_ISSUER = config.TOKEN_DEFAULT_ISSUER;
const TOKEN_DEFAULT_AUDIENCE = config.TOKEN_DEFAULT_AUDIENCE;
const SERVER_LATENCY = config.SERVER_LATENCY;
const SERVER_LATENCY_MIN = config.SERVER_LATENCY_MIN;
const SERVER_LATENCY_MAX = config.SERVER_LATENCY_MAX;
const ERROR_MIDDLEWARE = config.ERROR_MIDDLEWARE;

//Configure i18n
i18n.configure({
  directory: 'app/locales',
  locales: I18N_LOCALES,
  defaultLocale: I18N_DEFAULT_LOCALE,
  objectNotation: true,
  api: {
    '__': 't'
  }
});

/**
 * Export module
 */
module.exports = function() {

  //Initialize express app
  let app = express();

  //Setup database
  db(app);

  //Setup tokens
  tokens.setDefaults({
    issuer: TOKEN_DEFAULT_ISSUER,
    audience: TOKEN_DEFAULT_AUDIENCE
  });
  tokens.register(TOKEN_TYPES);

  //Trust proxy (for Cloud hosted forwarding of requests)
  app.set('trust_proxy', 1);

  //CORS
  app.use(cors({
    origin: CORS_ORIGINS,
    credentials: true //NOTE: needed for cross domain cookies to work
  }));

  //Compression
  app.use(compression({
    level: 3,
    filter(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    }
  }));

  //Logger
  app.use(morgan('dev'));

  //Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  //Parse application/json
  app.use(bodyParser.json());
  app.use(bodyParser.json({
    type: 'application/vnd.api+json'
  }));

  //Add cookie parser middleware
  app.use(cookieParser());

  //Use i18n
  app.use(i18n.init);

  //Set static folders
  app.use(serveStatic(path.resolve('./public')));
  app.use(serveStatic(path.resolve('./data')));

  //Simulate latency
  if (SERVER_LATENCY) {
    let latency = require('express-simulate-latency')({
      min: SERVER_LATENCY_MIN,
      max: SERVER_LATENCY_MAX
    });
    app.use(latency);
  }

  //Load authentication
  auth(app);

  //Load router
  router(app);

  //Create error handling middleware stack with two permanent handlers
  ERROR_MIDDLEWARE
    .concat(['process', 'send'])
    .map(handler => require('./error/middleware/' + handler))
    .forEach(handler => app.use(handler));

  //Return express server instance
  return app;
};
