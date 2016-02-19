'use strict';

/**
 * Default toJSON implementation for mongoose schema's
 */
module.exports = function toJsonPlugin(schema) {
  schema.options.toJSON = {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  };
};
