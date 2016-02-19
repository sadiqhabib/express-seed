'use strict';

/**
 * Define migration errors
 */
function MethodInvalidError() {}
MethodInvalidError.prototype = Object.create(Error.prototype);
function AlreadyRanError() {}
AlreadyRanError.prototype = Object.create(Error.prototype);

/**
 * Export
 */
module.exports = {
  MethodInvalidError: MethodInvalidError,
  AlreadyRanError: AlreadyRanError
};
