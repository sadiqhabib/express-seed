'use strict';

/**
 * Validation utilities
 */
module.exports = {

  /**
   * Create field error helper for use in data validation promise chains
   */
  fieldError(field, type, message) {
    return {field, type, message};
  },

  /**
   * Find field errors helper for use in promise chains
   */
  getErroredFields(results) {
    let fields = {};
    results.forEach(result => {
      if (result && result.field && result.type) {
        let {field, type, message} = result;
        fields[field] = {type, message};
      }
    });
    if (Object.keys(fields).length > 0) {
      return fields;
    }
    return null;
  }
};
