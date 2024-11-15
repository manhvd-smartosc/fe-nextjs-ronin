export function truncateString(str: string, numOfChars: number = 100): string {
  if (str.length > numOfChars) {
    return str.substring(0, numOfChars) + '...';
  }
  return str;
}

export function sanitizeString(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  const reg = /[&<>"'/]/gi;

  return str.replace(reg, (match) => map[match]);
}
