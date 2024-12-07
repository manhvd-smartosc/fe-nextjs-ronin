import { formatLargeNumber, formatLargeNumberInt } from '@/utils/number';
import Big from 'big.js';

describe('formatLargeNumber', () => {
  it('should format numbers in billions with two decimal places', () => {
    const number = new Big(1_500_000_000); // 1.5 billion
    expect(formatLargeNumber(number)).toBe('1.50B');
  });

  it('should format numbers in millions with two decimal places', () => {
    const number = new Big(2_500_000); // 2.5 million
    expect(formatLargeNumber(number)).toBe('2.50M');
  });

  it('should format numbers in thousands with two decimal places', () => {
    const number = new Big(12_345); // 12.345 thousand
    expect(formatLargeNumber(number)).toBe('12.35k');
  });

  it('should format numbers less than 1,000 with four decimal places', () => {
    const number = new Big(123.4567); // 123.4567
    expect(formatLargeNumber(number)).toBe('123.4567');
  });

  it('should handle edge cases of exactly 1 billion, 1 million, and 1 thousand', () => {
    expect(formatLargeNumber(new Big(1_000_000_000))).toBe('1.00B');
    expect(formatLargeNumber(new Big(1_000_000))).toBe('1.00M');
    expect(formatLargeNumber(new Big(1_000))).toBe('1.00k');
  });
});

describe('formatLargeNumberInt', () => {
  it('should format numbers in billions as integers', () => {
    const number = new Big(1_500_000_000); // 1.5 billion
    expect(formatLargeNumberInt(number)).toBe('2B');
  });

  it('should format numbers in millions as integers', () => {
    const number = new Big(2_500_000); // 2.5 million
    expect(formatLargeNumberInt(number)).toBe('3M');
  });

  it('should format numbers in thousands as integers', () => {
    const number = new Big(12_345); // 12.345 thousand
    expect(formatLargeNumberInt(number)).toBe('12k');
  });

  it('should format numbers less than 1,000 as integers', () => {
    const number = new Big(123.4567); // 123.4567
    expect(formatLargeNumberInt(number)).toBe('123');
  });

  it('should handle edge cases of exactly 1 billion, 1 million, and 1 thousand', () => {
    expect(formatLargeNumberInt(new Big(1_000_000_000))).toBe('1B');
    expect(formatLargeNumberInt(new Big(1_000_000))).toBe('1M');
    expect(formatLargeNumberInt(new Big(1_000))).toBe('1k');
  });
});
