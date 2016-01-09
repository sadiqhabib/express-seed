'use strict';

/**
 * Helper to return only an ID if model given
 */
module.exports = function onlyId(obj) {
  if (Array.isArray(obj)) {
    return obj.map(onlyId);
  }
  if (!obj || typeof obj !== 'object' || !obj._id) {
    return obj;
  }
  return obj._id;
};
