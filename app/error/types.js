'use strict';

/**
 * Expose all error types known to mankind
 */
module.exports = {

  //Basic error types
  BaseError: require('./types/baseError'),
  InternalError: require('./types/internalError'),
  ServerError: require('./types/serverError'),
  ClientError: require('./types/clientError'),

  //Specific error types
  BadRequestError: require('./types/badRequestError'),
  NotFoundError: require('./types/notFoundError'),
  UnauthenticatedError: require('./types/unauthenticatedError'),
  UnauthorizedError: require('./types/unauthorizedError'),
  InvalidDataError: require('./types/invalidDataError'),
  InvalidTokenError: require('./types/invalidTokenError'),
  ValidationError: require('./types/validationError'),
  MailerError: require('./types/mailerError'),

  //3rd party error types
  MongooseValidationError: require('mongoose').Error.ValidationError
};
