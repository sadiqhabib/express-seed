'use strict';

/**
 * Dependencies
 */
let DataUtils = require('./data');

/**
 * Specifications
 */
describe('Data utilities', () => {

  /**
   * isOneOf()
   */
  describe('isOneOf()', () => {
    let isOneOf = DataUtils.isOneOf;
    it('should return true if a value is present', () => {
      expect(isOneOf(1, [1, 2, 3])).to.be.true();
      expect(isOneOf(1, [3, 2, 1])).to.be.true();
      expect(isOneOf('a', [1, 'a', 3])).to.be.true();
      expect(isOneOf(true, [true, false])).to.be.true();
      expect(isOneOf(null, ['a', null, 2])).to.be.true();
    });
    it('should return false if a value is not present', () => {
      expect(isOneOf(1, [4, 'a', true])).to.be.false();
      expect(isOneOf(null, [4, 'a', false])).to.be.false();
      expect(isOneOf('a', [1, 'b', 'c'])).to.be.false();
      expect(isOneOf(true, [null, false, 1])).to.be.false();
    });
  });

  /**
   * isEmpty()
   */
  describe('isEmpty()', () => {
    let isEmpty = DataUtils.isEmpty;
    it('should consider null and undefined empty', () => {
      expect(isEmpty(null)).to.be.true();
      expect(isEmpty(undefined)).to.be.true();
    });
    it('should consider empty strings as empty', () => {
      expect(isEmpty('')).to.be.true();
    });
    it('should consider strings with only spaces as empty', () => {
      expect(isEmpty('  ')).to.be.true();
    });
    it('should consider strings with only whitespace characters empty', () => {
      expect(isEmpty('\n\r')).to.be.true();
      expect(isEmpty('\n\r \n\n')).to.be.true();
    });
    it('should consider zero as empty', () => {
      expect(isEmpty(0)).to.be.true();
    });
    it('should consider false as empty', () => {
      expect(isEmpty(false)).to.be.true();
    });
    it('should consider empty arrays as empty', () => {
      expect(isEmpty([])).to.be.true();
    });
    it('should consider an empty object as empty', () => {
      expect(isEmpty({})).to.be.true();
    });
    it('should consider an empty set as empty', () => {
      expect(isEmpty(new Map())).to.be.true();
    });
    it('should consider an empty map as empty', () => {
      expect(isEmpty(new Set())).to.be.true();
    });
    it('should not consider strings with length as empty', () => {
      expect(isEmpty('test')).to.be.false();
    });
    it('should not consider true as empty', () => {
      expect(isEmpty(true)).to.be.false();
    });
    it('should not consider non zero numbers as empty', () => {
      expect(isEmpty(1)).to.be.false();
      expect(isEmpty(-1)).to.be.false();
      expect(isEmpty(1.1)).to.be.false();
    });
    it('should not consider non-empty arrays as empty', () => {
      expect(isEmpty(['test'])).to.be.false();
      expect(isEmpty([''])).to.be.false();
      expect(isEmpty([0])).to.be.false();
      expect(isEmpty([null])).to.be.false();
    });
    it('should not consider an object with properties as empty', () => {
      expect(isEmpty({test: null})).to.be.false();
    });
    it('should not consider a function as empty', () => {
      expect(isEmpty(isEmpty)).to.be.false();
    });
  });

  /**
   * notEmpty()
   */
  describe('notEmpty()', () => {
    let notEmpty = DataUtils.notEmpty;
    it('should consider null and undefined empty', () => {
      expect(notEmpty(null)).to.be.false();
      expect(notEmpty(undefined)).to.be.false();
    });
    it('should consider empty strings as empty', () => {
      expect(notEmpty('')).to.be.false();
    });
    it('should consider strings with only spaces as empty', () => {
      expect(notEmpty('  ')).to.be.false();
    });
    it('should consider strings with only whitespace characters empty', () => {
      expect(notEmpty('\n\r')).to.be.false();
      expect(notEmpty('\n\r \n\n')).to.be.false();
    });
    it('should consider zero as empty', () => {
      expect(notEmpty(0)).to.be.false();
    });
    it('should consider false as empty', () => {
      expect(notEmpty(false)).to.be.false();
    });
    it('should consider empty arrays as empty', () => {
      expect(notEmpty([])).to.be.false();
    });
    it('should consider an empty object as empty', () => {
      expect(notEmpty({})).to.be.false();
    });
    it('should consider an empty set as empty', () => {
      expect(notEmpty(new Map())).to.be.false();
    });
    it('should consider an empty map as empty', () => {
      expect(notEmpty(new Set())).to.be.false();
    });
    it('should not consider strings with length as empty', () => {
      expect(notEmpty('test')).to.be.true();
    });
    it('should not consider true as empty', () => {
      expect(notEmpty(true)).to.be.true();
    });
    it('should not consider non zero numbers as empty', () => {
      expect(notEmpty(1)).to.be.true();
      expect(notEmpty(-1)).to.be.true();
      expect(notEmpty(1.1)).to.be.true();
    });
    it('should not consider non-empty arrays as empty', () => {
      expect(notEmpty(['test'])).to.be.true();
      expect(notEmpty([''])).to.be.true();
      expect(notEmpty([0])).to.be.true();
      expect(notEmpty([null])).to.be.true();
    });
    it('should not consider an object with properties as empty', () => {
      expect(notEmpty({test: null})).to.be.true();
    });
    it('should not consider a function as empty', () => {
      expect(notEmpty(notEmpty)).to.be.true();
    });
  });

  /**
   * isBoolean()
   */
  describe('isBoolean()', () => {
    let isBoolean = DataUtils.isBoolean;
    it('should consider booleans a boolean', () => {
      expect(isBoolean(true)).to.be.true();
      expect(isBoolean(false)).to.be.true();
    });
    it('should not consider non-booleans a boolean', () => {
      expect(isBoolean(1)).to.be.false();
      expect(isBoolean(0)).to.be.false();
      expect(isBoolean(1.2)).to.be.false();
      expect(isBoolean(-2.4)).to.be.false();
      expect(isBoolean('a')).to.be.false();
      expect(isBoolean('0')).to.be.false();
      expect(isBoolean([])).to.be.false();
      expect(isBoolean({})).to.be.false();
      expect(isBoolean(null)).to.be.false();
      expect(isBoolean(undefined)).to.be.false();
      expect(isBoolean(NaN)).to.be.false();
    });
  });

  /**
   * isInteger()
   */
  describe('isInteger()', () => {
    let isInteger = DataUtils.isInteger;
    it('should consider integers an integer', () => {
      expect(isInteger(1)).to.be.true();
      expect(isInteger(500)).to.be.true();
      expect(isInteger(0)).to.be.true();
      expect(isInteger(-1)).to.be.true();
      expect(isInteger(-10000)).to.be.true();
    });
    it('should not consider non-integers an integer', () => {
      expect(isInteger(1.2)).to.be.false();
      expect(isInteger(-2.4)).to.be.false();
      expect(isInteger('a')).to.be.false();
      expect(isInteger('1')).to.be.false();
      expect(isInteger('0')).to.be.false();
      expect(isInteger('-1')).to.be.false();
      expect(isInteger(true)).to.be.false();
      expect(isInteger(false)).to.be.false();
      expect(isInteger([])).to.be.false();
      expect(isInteger({})).to.be.false();
      expect(isInteger(null)).to.be.false();
      expect(isInteger(undefined)).to.be.false();
      expect(isInteger(NaN)).to.be.false();
    });
  });

  /**
   * isNumber()
   */
  describe('isNumber()', () => {
    let isNumber = DataUtils.isNumber;
    it('should consider numbers a number', () => {
      expect(isNumber(1)).to.be.true();
      expect(isNumber(500)).to.be.true();
      expect(isNumber(0)).to.be.true();
      expect(isNumber(-1)).to.be.true();
      expect(isNumber(-10000)).to.be.true();
      expect(isNumber(1.2)).to.be.true();
      expect(isNumber(-2.4)).to.be.true();
    });
    it('should not consider non-numbers a number', () => {
      expect(isNumber(NaN)).to.be.false();
      expect(isNumber('a')).to.be.false();
      expect(isNumber('1')).to.be.false();
      expect(isNumber('0')).to.be.false();
      expect(isNumber('1.2')).to.be.false();
      expect(isNumber('-2.4')).to.be.false();
      expect(isNumber(true)).to.be.false();
      expect(isNumber(false)).to.be.false();
      expect(isNumber([])).to.be.false();
      expect(isNumber({})).to.be.false();
      expect(isNumber(null)).to.be.false();
      expect(isNumber(undefined)).to.be.false();
    });
  });

  /**
   * isPositive()
   */
  describe('isPositive()', () => {
    let isPositive = DataUtils.isPositive;
    it('should consider positive numbers positive', () => {
      expect(isPositive(1)).to.be.true();
      expect(isPositive(1.25)).to.be.true();
      expect(isPositive(1000)).to.be.true();
    });
    it('should not consider negative numbers positive', () => {
      expect(isPositive(-1)).to.be.false();
      expect(isPositive(-1.25)).to.be.false();
      expect(isPositive(-1000)).to.be.false();
    });
    it('should not consider zero positive', () => {
      expect(isPositive(0)).to.be.false();
    });
    it('should not consider non-numbers positive', () => {
      expect(isPositive(NaN)).to.be.false();
      expect(isPositive('a')).to.be.false();
      expect(isPositive('1')).to.be.false();
      expect(isPositive('0')).to.be.false();
      expect(isPositive('1.2')).to.be.false();
      expect(isPositive('-2.4')).to.be.false();
      expect(isPositive(true)).to.be.false();
      expect(isPositive(false)).to.be.false();
      expect(isPositive([])).to.be.false();
      expect(isPositive({})).to.be.false();
      expect(isPositive(null)).to.be.false();
      expect(isPositive(undefined)).to.be.false();
    });
  });

  /**
   * isNegative()
   */
  describe('isNegative()', () => {
    let isNegative = DataUtils.isNegative;
    it('should consider negative numbers negative', () => {
      expect(isNegative(-1)).to.be.true();
      expect(isNegative(-1.25)).to.be.true();
      expect(isNegative(-1000)).to.be.true();
    });
    it('should not consider positive numbers negative', () => {
      expect(isNegative(1)).to.be.false();
      expect(isNegative(1.25)).to.be.false();
      expect(isNegative(1000)).to.be.false();
    });
    it('should not consider zero negative', () => {
      expect(isNegative(0)).to.be.false();
    });
    it('should not consider non-numbers negative', () => {
      expect(isNegative(NaN)).to.be.false();
      expect(isNegative('a')).to.be.false();
      expect(isNegative('1')).to.be.false();
      expect(isNegative('0')).to.be.false();
      expect(isNegative('1.2')).to.be.false();
      expect(isNegative('-2.4')).to.be.false();
      expect(isNegative(true)).to.be.false();
      expect(isNegative(false)).to.be.false();
      expect(isNegative([])).to.be.false();
      expect(isNegative({})).to.be.false();
      expect(isNegative(null)).to.be.false();
      expect(isNegative(undefined)).to.be.false();
    });
  });
});
