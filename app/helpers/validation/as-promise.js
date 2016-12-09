'use strict';

/**
 * Run a boolean validator as a promise
 */
module.exports = function asPromise(value) {
  if (value) {
    return Promise.resolve();
  }
  return Promise.reject();
};
