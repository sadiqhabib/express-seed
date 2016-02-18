'use strict';

/**
 * Dependencies
 */
let moment = require('moment');
let DateUtils = require('./dateAndTime');

/**
 * Specifications
 */
describe('Date and Time utilities', () => {

  /**
   * getTime()
   */
  describe('getTime()', () => {
    let getTime = DateUtils.getTime;
    it('should return the number of minutes since midnight', () => {
      let today = moment().startOf('day');
      expect(getTime(today)).to.equal(0);
      expect(getTime(today.add(1, 'hour'))).to.equal(60);
      expect(getTime(today.add(3, 'hours'))).to.equal(240);
      expect(getTime(today.add(45, 'minutes'))).to.equal(285);
      expect(getTime(today.add(12, 'hours'))).to.equal(1005);
    });
    it('should not be affected by seconds', () => {
      let today = moment().startOf('day');
      expect(getTime(today.add(1, 'hour'))).to.equal(60);
      expect(getTime(today.add(1, 'minute'))).to.equal(61);
      expect(getTime(today.add(1, 'second'))).to.equal(61);
      expect(getTime(today.add(30, 'seconds'))).to.equal(61);
    });
  });

  /**
   * isDateInFuture()
   */
  describe('isDateInFuture()', () => {
    let check = DateUtils.isDateInFuture;
    it('should return true for future dates', () => {
      let now = moment();
      let results = [
        check(now.add(1, 'hour')),
        check(now.add(1, 'day')),
        check(now.add(1, 'month')),
        check(now.add(1, 'year'))
      ];
      results.forEach(result => {
        expect(result).to.be.true();
      });
    });
    it('should return false for past dates', () => {
      let now = moment();
      let results = [
        check(now.subtract(1, 'hour')),
        check(now.subtract(1, 'day')),
        check(now.subtract(1, 'month')),
        check(now.subtract(1, 'year'))
      ];
      results.forEach(result => {
        expect(result).to.be.false();
      });
    });
  });

  /**
   * isDayAndTimeInTimeRange()
   * NOTE: day is 0-6 with 0 being sunday, 1 monday, etc.
   */
  describe('isDayAndTimeInTimeRange()', () => {
    let check = DateUtils.isDayAndTimeInTimeRange;
    let timeRange = {
      days: [1, 2],
      startTime: 8 * 60,
      endTime: 10 * 60
    };
    it('should return true if both day/time are in the range', () => {
      let results = [
        check(timeRange, 1, 9 * 60),
        check(timeRange, 2, 9 * 60 + 30)
      ];
      results.forEach(result => {
        expect(result).to.be.true();
      });
    });
    it('should return true if the time is the start time', () => {
      let results = [
        check(timeRange, 1, 8 * 60),
        check(timeRange, 2, 8 * 60)
      ];
      results.forEach(result => {
        expect(result).to.be.true();
      });
    });
    it('should return false if the time is the end time', () => {
      let results = [
        check(timeRange, 1, 10 * 60),
        check(timeRange, 2, 10 * 60)
      ];
      results.forEach(result => {
        expect(result).to.be.false();
      });
    });
    it('should return false if the day is not in the range', () => {
      let results = [
        check(timeRange, 0, 9 * 60),
        check(timeRange, 3, 9 * 60)
      ];
      results.forEach(result => {
        expect(result).to.be.false();
      });
    });
    it('should return false if the time is before the start time', () => {
      let results = [
        check(timeRange, 1, 7 * 60),
        check(timeRange, 2, 0 * 60)
      ];
      results.forEach(result => {
        expect(result).to.be.false();
      });
    });
    it('should return false if the time is after the end time', () => {
      let results = [
        check(timeRange, 1, 11 * 60),
        check(timeRange, 2, 23 * 60)
      ];
      results.forEach(result => {
        expect(result).to.be.false();
      });
    });
    it('should return false if the day/time are not in the range', () => {
      let results = [
        check(timeRange, 0, 11 * 60),
        check(timeRange, 3, 5 * 60 + 30)
      ];
      results.forEach(result => {
        expect(result).to.be.false();
      });
    });
  });

  /**
   * isDateAndTimeInTimeRange()
   * NOTE: day is 0-6 with 0 being sunday, 1 monday, etc.
   */
  describe('isDateAndTimeInTimeRange()', () => {
    let check = DateUtils.isDateAndTimeInTimeRange;
    let sunday = moment('14-02-2016', 'DD-MM-YYYY');
    let monday = moment('15-02-2016', 'DD-MM-YYYY');
    let tuesday = moment('16-02-2016', 'DD-MM-YYYY');
    let thursday = moment('18-02-2016', 'DD-MM-YYYY');
    let timeRange = {
      days: [1, 2],
      startTime: 8 * 60,
      endTime: 10 * 60
    };
    it('should return true if both day/time are in the range', () => {
      let results = [
        check(timeRange, tuesday, 9 * 60),
        check(timeRange, monday, 9 * 60 + 30)
      ];
      results.forEach(result => {
        expect(result).to.be.true();
      });
    });
    it('should return true if the time is the start time', () => {
      let results = [
        check(timeRange, tuesday, 8 * 60),
        check(timeRange, monday, 8 * 60)
      ];
      results.forEach(result => {
        expect(result).to.be.true();
      });
    });
    it('should return false if the time is the end time', () => {
      let results = [
        check(timeRange, tuesday, 10 * 60),
        check(timeRange, monday, 10 * 60)
      ];
      results.forEach(result => {
        expect(result).to.be.false();
      });
    });
    it('should return false if the day is not in the range', () => {
      let results = [
        check(timeRange, sunday, 9 * 60),
        check(timeRange, thursday, 9 * 60)
      ];
      results.forEach(result => {
        expect(result).to.be.false();
      });
    });
    it('should return false if the time is before the start time', () => {
      let results = [
        check(timeRange, tuesday, 7 * 60),
        check(timeRange, monday, 0 * 60)
      ];
      results.forEach(result => {
        expect(result).to.be.false();
      });
    });
    it('should return false if the time is after the end time', () => {
      let results = [
        check(timeRange, tuesday, 11 * 60),
        check(timeRange, monday, 23 * 60)
      ];
      results.forEach(result => {
        expect(result).to.be.false();
      });
    });
    it('should return false if the day/time are not in the range', () => {
      let results = [
        check(timeRange, sunday, 11 * 60),
        check(timeRange, thursday, 5 * 60 + 30)
      ];
      results.forEach(result => {
        expect(result).to.be.false();
      });
    });
  });
});
