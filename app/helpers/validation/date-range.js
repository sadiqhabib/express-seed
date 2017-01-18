'use strict';

/**
 * Dependencies
 */
const moment = require('moment');

/**
 * Validate a date range
 */
module.exports = function dateRange(fromDate, toDate) {

  //If neither given, create for today
  if (!fromDate && !toDate) {
    return [moment().startOf('day'), moment().endOf('day')];
  }

  //If given, convert to moment
  fromDate = fromDate ? moment(fromDate).startOf('day') : null;
  toDate = toDate ? moment(toDate).endOf('day') : null;

  //If still not given, clone from counterpart
  fromDate = fromDate || toDate.clone().startOf('day');
  toDate = toDate || fromDate.clone().endOf('day');

  //Validate to date is not before from date
  if (toDate.isBefore(fromDate)) {
    toDate = fromDate.clone().endOf('day');
  }

  //Return
  return [fromDate, toDate];
};
