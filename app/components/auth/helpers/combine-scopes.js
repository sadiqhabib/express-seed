'use strict';

/**
 * Load scopes map
 */
const scopes = require('../../../constants/scopes');

/**
 * Helper to combine scopes
 */
module.exports = function combineScopes(roles) {

  //Combined scopes
  const combined = new Set();

  //Add roles to set
  roles.forEach(role => scopes[role].forEach(role => combined.add(role)));

  //Return as array with unique entries
  return Array.from(combined.values());
};
