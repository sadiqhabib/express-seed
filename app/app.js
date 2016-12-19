'use strict';

/**
 * Dependencies
 */
const i18n = require('i18n');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const errors = require('meanie-express-error-handling');
const router = require('./services/router');
const findMe = require('./middleware/find-me');
const initLocals = require('./middleware/init-locals');
const ensureValidOrigin = require('./middleware/ensure-valid-origin');
const config = require('./config');

/**
 * Configuration
 */
const APP_VERSION = config.APP_VERSION;
const APP_ORIGINS = config.APP_ORIGINS;
const SERVER_LATENCY = config.SERVER_LATENCY;
const SERVER_LATENCY_MIN = config.SERVER_LATENCY_MIN;
const SERVER_LATENCY_MAX = config.SERVER_LATENCY_MAX;
const ERROR_MIDDLEWARE = config.ERROR_MIDDLEWARE;

/**
 * Initialization
 */
require('./init/error-handling');
require('./init/db')();
require('./init/jwt');
require('./init/auth');
require('./init/i18n');
require('./init/handlebars');

/**
 * Export module
 */
module.exports = function() {

  //Initialize express app
  const app = express();

  //Set locals
  app.locals = config;

  //Trust proxy (for Cloud hosted forwarding of requests)
  app.set('trust_proxy', 1);

  //CORS
  app.use(cors({
    origin: APP_ORIGINS,
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

  //Ensure valid origin, initialize locals and find logged in user
  app.use(ensureValidOrigin);
  app.use(initLocals);
  app.use(findMe);

  //Initialize passport
  app.use(passport.initialize());

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
