'use strict';

/**
 * Internal helper
 */
function strip(properties, obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  let stripped = {};
  properties.forEach(function(property) {
    stripped[property] = obj[property];
  });
  return stripped;
}

/**
 * Helper to strip an object to only certain properties
 */
module.exports = function stripObject() {
  let obj = arguments[0];
  let properties = [];
  for (let i = 1; i < arguments.length; i++) {
    properties.push(arguments[i]);
  }
  if (Array.isArray(obj)) {
    return obj.map(strip.bind(null, properties));
  }
  return strip(properties, obj);
};

//TODO use the bottom version once rest params are in node
// /**
//  * Helper to strip an object to only certain properties
//  */
// module.exports = function stripObject(obj, ...properties) {
//   if (Array.isArray(obj)) {
//     return obj.map(strip.bind(null, properties));
//   }
//   return strip(properties, obj);
// };
