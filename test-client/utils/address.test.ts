const { getFirstSixChars, shortenAddress } = require('@/utils/address');

describe('shortenAddress', () => {
  test('should return an empty string if address is undefined', () => {
    expect(shortenAddress()).toBe('');
  });

  test('should return the address if numChars is not a number', () => {
    expect(shortenAddress('0x123456789abcdef', 'notANumber')).toBe(
      '0x123456789abcdef',
    );
  });

  test('should return the address if its length is less than or equal to numChars', () => {
    const address = '0x1234';
    expect(shortenAddress(address, 10)).toBe(address);
  });

  test('should return the shortened address if its length exceeds numChars', () => {
    const address = '0x123456789abcdef';
    expect(shortenAddress(address, 4)).toBe('0x12...cdef');
  });

  test('should use default numChars value if not provided', () => {
    const address = '0x123456789abcdef123456789abcdef';
    expect(shortenAddress(address)).toBe('0x123456789a...456789abcdef');
  });
});

describe('getFirstSixChars', () => {
  test('should return an empty string if address is undefined', () => {
    expect(getFirstSixChars()).toBe('');
  });

  test('should return the first six characters after the "0x" prefix', () => {
    const address = '0x123456789abcdef';
    expect(getFirstSixChars(address)).toBe('123456');
  });

  test('should return an empty string if address is shorter than 8 characters', () => {
    const address = '0x12';
    expect(getFirstSixChars(address)).toBe('12');
  });
});
