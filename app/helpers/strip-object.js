'use strict';

/**
 * Dependencies
 */
let chalk = require('chalk');
let ObjectId = require('mongoose').Types.ObjectId;

/**
 * Helper to strip an object to only certain properties
 */
module.exports = function stripObject(obj, ...properties) {
  if (Array.isArray(obj)) {
    return obj.map(obj => stripObject.apply(null, [obj].concat(properties)));
  }
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof ObjectId) {
    console.warn(chalk.yellow('ObjectID passed to stripObject helper'));
    return obj.toString();
  }
  let stripped = {};
  properties.forEach(property => {
    if (obj.hasOwnProperty(property)) {
      stripped[property] = obj[property];
    }
  });
  return stripped;
};
