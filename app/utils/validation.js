'use strict';

/**
 * Validation utilities
 */
module.exports = {

  /**
   * Create field error helper for use in data validation promise chains
   */
  fieldError(field, type) {
    return {field, type};
  },

  /**
   * Find field errors helper for use in promise chains
   */
  findFieldErrors(results) {
    let errors = {};
    results.forEach(result => {
      if (result && result.field && result.type) {
        let field = result[0];
        let type = result[1];
        errors[field] = {type};
      }
    });
    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  }
};
