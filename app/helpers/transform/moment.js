'use strict';

/**
 * Dependencies
 */
const moment = require('moment');

/**
 * Helper to format a moment into a date
 */
module.exports = function(date, format, relative) {
  if (typeof format !== 'string') {
    format = '';
  }
  if (typeof relative !== 'boolean') {
    relative = false;
  }
  if (!moment.isMoment(date)) {
    date = moment(date);
  }
  if (relative) {
    let now = moment();
    if (now.isSame(date, 'day')) {
      return 'Today';
    }
    if (now.add(1, 'day').isSame(date, 'day')) {
      return 'Tomorrow';
    }
  }
  return date.format(format || 'DD-MM-YYYY');
};
