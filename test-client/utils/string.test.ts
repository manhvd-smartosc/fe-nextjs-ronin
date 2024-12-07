import { sanitizeString, truncateString } from "@/utils/string";

describe('truncateString', () => {
  it('should truncate the string and append "..." when it exceeds the specified length', () => {
    const result = truncateString('Hello, World!', 5);
    expect(result).toBe('Hello...');
  });

  it('should return the original string if it does not exceed the specified length', () => {
    const result = truncateString('Hello', 10);
    expect(result).toBe('Hello');
  });

  it('should use the default length of 100 when no length is specified', () => {
    const longString = 'A'.repeat(101);
    const result = truncateString(longString);
    expect(result).toBe('A'.repeat(100) + '...');
  });

  it('should handle empty strings correctly', () => {
    const result = truncateString('', 5);
    expect(result).toBe('');
  });

  it('should handle edge cases when length is 0', () => {
    const result = truncateString('Hello', 0);
    expect(result).toBe('...');
  });
});

describe('sanitizeString', () => {
  it('should escape special HTML characters', () => {
    const result = sanitizeString('<div>"Hello & welcome!"</div>');
    expect(result).toBe(
      '&lt;div&gt;&quot;Hello &amp; welcome!&quot;&lt;&#x2F;div&gt;',
    );
  });

  it('should return the same string if no special characters are present', () => {
    const result = sanitizeString('Hello, World!');
    expect(result).toBe('Hello, World!');
  });

  it('should handle an empty string', () => {
    const result = sanitizeString('');
    expect(result).toBe('');
  });

  it('should escape single quotes and forward slashes', () => {
    const result = sanitizeString("It's a test / example.");
    expect(result).toBe('It&#x27;s a test &#x2F; example.');
  });

  it('should handle strings with repeated special characters', () => {
    const result = sanitizeString('&&&&<><><>');
    expect(result).toBe('&amp;&amp;&amp;&amp;&lt;&gt;&lt;&gt;&lt;&gt;');
  });
});
