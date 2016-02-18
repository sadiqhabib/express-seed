'use strict';

/**
 * External dependencies
 */
let moment = require('moment');

/**
 * Date and Time helper
 */
let Utils = module.exports = {

  /**
   * Get minutes passed (time) for a given moment
   */
  getTime(date) {
    return date.diff(date.clone().startOf('day'), 'minutes');
  },

  /**
   * Check if date is in the future
   */
  isDateInFuture(date) {
    return date.isAfter(moment());
  },

  /**
   * Check if a given date and time are in a time range
   */
  isDateAndTimeInTimeRange(timeRange, date, time) {
    return Utils.isDayAndTimeInTimeRange(timeRange, date.day(), time);
  },

  /**
   * Check if a given weekday and time are in a time range
   */
  isDayAndTimeInTimeRange(timeRange, day, time) {
    for (let i = 0; i < timeRange.days.length ; i++) {
      if (timeRange.days[i] === day) {
        if (timeRange.startTime <= time && timeRange.endTime > time) {
          return true;
        }
      }
    }
    return false;
  }
};
