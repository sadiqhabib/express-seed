'use strict';

/**
 * Data helper
 */
let Utils = module.exports = {

  /**
   * Check if value is one of a given set
   */
  isOneOf(value, values) {
    let set = new Set(values);
    set.add(value);
    return (values.length === set.size);
  },

  /**
   * Check if empty
   */
  isEmpty(value) {
    let type = typeof value;
    if (type === 'undefined') {
      return true;
    }
    if (value === null || value === '' || value === 0 || value === false) {
      return true;
    }
    if (type === 'string' && !value.match(/\S/)) {
      return true;
    }
    if (typeof value.length === 'number' && type !== 'function') {
      return !value.length;
    }
    if (typeof value.size === 'number') {
      return !value.size;
    }
    if (type === 'object' && Object.keys(value).length === 0) {
      return true;
    }
    return false;
  },

  /**
   * Opposite of isEmpty()
   */
  notEmpty(value) {
    return !Utils.isEmpty(value);
  },

  /**
   * Is boolean
   */
  isBoolean(value) {
    return (value === true || value === false);
  },

  /**
   * Is integer
   */
  isInteger(value) {
    return (typeof value === 'number' && (value % 1) === 0);
  },

  /**
   * Is a number
   */
  isNumber(value) {
    if (typeof value === 'string') {
      return false;
    }
    return (!isNaN(parseFloat(value)) && isFinite(value));
  },

  /**
   * Is positive
   */
  isPositive(value) {
    if (!Utils.isNumber(value)) {
      return false;
    }
    return (value > 0);
  },

  /**
   * Is negative
   */
  isNegative(value) {
    if (!Utils.isNumber(value)) {
      return false;
    }
    return (value < 0);
  }
};
