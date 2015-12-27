'use strict';

/**
 * Extend object helper
 */
function extendObject(destination, objects, deep) {

  //Loop the objects that need to extend destination
  for (var i = 0; i < objects.length; ++i) {
    var obj = objects[i];

    //Skip non objects
    if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
      continue;
    }

    //Get enumerable keys
    var keys = Object.keys(obj);
    for (var j = 0; j < keys.length; j++) {
      var key = keys[j];
      var src = obj[key];

      //Deep extend objects
      if (deep && typeof src === 'object') {
        if (typeof destination[key] !== 'object') {
          destination[key] = Array.isArray(src) ? [] : {};
        }
        extendObject(destination[key], [src], true);
      }
      else {
        destination[key] = src;
      }
    }
  }

  //Return
  return destination;
}

/**
 * Module export
 */
var object = module.exports = {

  /**
   * Is object check
   */
  isObject: function(target) {
    return (target !== null && typeof target === 'object');
  },

  /**
   * Deep merge two objects
   */
  merge: function(destination) {
    return extendObject(destination, [].slice.call(arguments, 1), true);
  },

  /**
   * Shallow extend two objects
   */
  extend: function(destination) {
    return extendObject(destination, [].slice.call(arguments, 1), false);
  },

  /**
   * Copy object
   */
  copy: function(source, destination) {

    //Copy primitives as they are
    if (source === null || typeof source !== 'object') {
      return source;
    }

    //If no destination given, create new object
    if (!destination) {
      if (Array.isArray(source)) {
        destination = [];
      }
      else {
        destination = Object.create(Object.getPrototypeOf(source));
      }
    }

    //Can't copy if source and destination are the same
    if (source === destination) {
      throw new Error('Source and destination are the same!');
    }

    //Handle arrays
    if (Array.isArray(source)) {
      destination.length = 0;
      for (var i = 0; i < source.length; i++) {
        destination.push(object.copy(source[i]));
      }
    }
    else {
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          destination[key] = object.copy(source[key]);
        }
      }
    }

    //Return the copy
    return destination;
  }
};
