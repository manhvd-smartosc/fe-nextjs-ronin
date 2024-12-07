import {
  uniqueString,
  isBrowser,
  getRandomInteger,
  isUrl,
  sleep,
  isGithubActionsAppEnv,
  filterSearchTerm,
  getDifferenceTime,
  formatTimestring,
  removeEmptyValues,
} from '@/utils/util';

describe('uniqueString', () => {
  it('should return a string of the specified length', () => {
    const result = uniqueString(10);
    expect(result).toHaveLength(10);
  });

  it('should contain only alphanumeric characters', () => {
    const result = uniqueString(10);
    expect(result).toMatch(/^[a-z0-9]+$/);
  });
});

describe('isBrowser', () => {
  it('should return true in a browser-like environment', () => {
    expect(isBrowser()).toBe(typeof window !== 'undefined');
  });
});

describe('getRandomInteger', () => {
  it('should return a random integer between min and max (inclusive)', () => {
    const result = getRandomInteger(1, 10);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
  });

  it('should handle equal min and max correctly', () => {
    const result = getRandomInteger(5, 5);
    expect(result).toBe(5);
  });
});

describe('isUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isUrl('https://example.com')).toBe(true);
    expect(isUrl('http://example.com')).toBe(true);
  });

  it('should return false for invalid URLs', () => {
    expect(isUrl('ftp://example.com')).toBe(false);
    expect(isUrl('example.com')).toBe(false);
  });
});

describe('sleep', () => {
  it('should resolve after the specified time', async () => {
    const start = Date.now();
    await sleep(1);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(1000);
  });
});

describe('isGithubActionsAppEnv', () => {
  it('should return true if APP_ENV is ci', () => {
    process.env.APP_ENV = 'ci';
    expect(isGithubActionsAppEnv()).toBe(true);
  });

  it('should return false if APP_ENV is not ci', () => {
    process.env.APP_ENV = 'production';
    expect(isGithubActionsAppEnv()).toBe(false);
  });
});

describe('filterSearchTerm', () => {
  it('should filter special characters and replace spaces with "_" by default', () => {
    expect(filterSearchTerm('hello world! @example')).toBe(
      'hello_world_example',
    );
  });

  it('should replace spaces with " | " when operator is "or"', () => {
    expect(filterSearchTerm('hello world! @example', 'or')).toBe(
      'hello | world | example',
    );
  });

  it('should return undefined for undefined input', () => {
    expect(filterSearchTerm(undefined)).toBeUndefined();
  });
});

describe('getDifferenceTime', () => {
  it('should return the correct time difference', () => {
    const now = Date.now();
    expect(getDifferenceTime(now - 2 * 365.25 * 24 * 60 * 60 * 1000)).toBe(
      '2 years ago',
    );
    expect(getDifferenceTime(now - 1 * 365.25 * 24 * 60 * 60 * 1000)).toBe(
      '1 year ago',
    );
    expect(getDifferenceTime(now - 3 * 30 * 24 * 60 * 60 * 1000)).toBe(
      '3 months ago',
    );
    expect(getDifferenceTime(now - 1 * 30 * 24 * 60 * 60 * 1000)).toBe(
      '1 month ago',
    );
    expect(getDifferenceTime(now - 5 * 24 * 60 * 60 * 1000)).toBe('5 days ago');
    expect(getDifferenceTime(now - 1 * 24 * 60 * 60 * 1000)).toBe('1 day ago');
    expect(getDifferenceTime(now - 7 * 60 * 60 * 1000)).toBe('7 hours ago');
    expect(getDifferenceTime(now - 1 * 60 * 60 * 1000)).toBe('1 hour ago');
    expect(getDifferenceTime(now - 30 * 60 * 1000)).toBe('30 minutes ago');
    expect(getDifferenceTime(now - 1 * 60 * 1000)).toBe('1 minute ago');
  });
});

describe('formatTimestring', () => {
  it('should return the formatted time string', () => {
    const result = formatTimestring('2024-12-07T09:08:35.277Z');
    expect(result).toBe('12/07/2024 16:08:35');
  });
});

describe('removeEmptyValues', () => {
  it('should remove keys with empty values from the object', () => {
    const input = {
      a: 'hello',
      b: null,
      c: undefined,
      d: 0,
      e: false,
      f: 'world',
    };
    const result = removeEmptyValues(input);
    expect(result).toEqual({ a: 'hello', f: 'world' });
  });

  it('should return an empty object for an object with all empty values', () => {
    const input = { a: null, b: undefined, c: false };
    const result = removeEmptyValues(input);
    expect(result).toEqual({});
  });
});
