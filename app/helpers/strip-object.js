'use strict';

/**
 * Internal helper
 */
function strip(properties, obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  let stripped = {};
  properties.forEach(property => {
    if (obj.hasOwnProperty(property)) {
      stripped[property] = obj[property];
    }
  });
  return stripped;
}

/**
 * Helper to strip an object to only certain properties
 */
module.exports = function stripObject(obj, ...properties) {
  if (Array.isArray(obj)) {
    return obj.map(strip.bind(null, properties));
  }
  return strip(properties, obj);
};
