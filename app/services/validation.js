'use strict';

/**
 * Dependencies
 */
const errors = require('meanie-express-error-handling');
const ValidationError = errors.ValidationError;
const validators = require('../validators');

/**
 * Validation service
 */
const validation = {

  /**
   * Check data according to rules
   */
  check(data, rules, isTrivial = false) {

    //Object given as rules? Convert to array
    if (!Array.isArray(rules) && typeof rules === 'object') {
      rules = Object
        .keys(rules)
        .map(field => {
          if (typeof rules[field] === 'string') {
            return {field, validator: rules[field]};
          }
          return Object.assign({field}, rules[field]);
        });
    }

    //No rules?
    if (rules.length === 0) {
      return Promise.resolve();
    }

    //Convert rules to promises
    const promises = rules
      .map(rule => validation.parseRule(rule))
      .map(rule => validation.checkRule(rule, data))
      .map(promise => promise.reflect());

    //Placeholder for errors
    const errors = [];

    //Resolve promises
    return Promise
      .all(promises)
      .each(inspection => {
        if (!inspection.isFulfilled()) {
          errors.push(inspection.reason());
        }
      })
      .then(() => {

        //Any errors?
        if (errors.length === 0) {
          return;
        }

        //Convert to fields object
        const fields = errors.reduce((fields, error) => {
          const {field, type, message} = error;
          fields[field] = {type, message};
          return fields;
        }, {});

        //Create error
        const error = new ValidationError({fields});
        error.isTrivial = isTrivial;

        //Throw validation error
        throw error;
      });
  },

  /**
   * Helper to parse a rule
   */
  parseRule(rule) {

    //Ensure object
    if (typeof rule !== 'object') {
      throw new Error(`Invalid rule: ${rule}`);
    }

    //Extract data
    let {field, validator, type, message, arg, args} = rule;

    //Must have field
    if (typeof field === 'undefined') {
      throw new Error('Missing field for validation rule');
    }

    //Must have validator
    if (typeof validator === 'undefined') {
      throw new Error(`Missing validator for ${field} validation`);
    }

    //String? Assume validation function with no options
    if (typeof validator === 'string') {
      if (typeof validators[validator] === 'undefined') {
        throw new Error(`Unknown validator: ${validator}`);
      }
      validator = validators[validator];
    }

    //Invalid validator?
    if (typeof validator !== 'function') {
      throw new Error(`Invalid validator for '${field}' validation`);
    }

    //No type? Use validator function name
    if (!type) {
      type = validator.name;
    }

    //Single argument? Convert to array
    if (typeof arg !== 'undefined') {
      args = [arg];
    }

    //Ensure array
    if (!Array.isArray(args)) {
      args = [];
    }

    //Return parsed
    return {field, validator, args, type, message};
  },

  /**
   * Helper to check a rule
   */
  checkRule(rule, data) {

    //Get data
    const {field, args, validator, type} = rule;
    const value = data[field];

    //Run validator
    return Promise
      .try(() => validator(value, ...args))
      .catch(error => {
        const message = rule.message || error.message;
        throw {field, type, message};
      });
  },
};

/**
 * Export
 */
module.exports = validation;
