import { isValidNumber } from './validateNumber'

describe('isValidNumber', () => {
  test('should return true for values between 0 and 100', () => {
    expect(isValidNumber(0)).toBe(true);
    expect(isValidNumber(50)).toBe(true);
    expect(isValidNumber(100)).toBe(true);
  });

  test('should return false for values less than 0 or greater than 100', () => {
    expect(isValidNumber(-1)).toBe(false);
    expect(isValidNumber(101)).toBe(false);
  });
});