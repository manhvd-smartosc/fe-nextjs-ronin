export function truncateString(str: string, numOfChars: number = 100): string {
  if (str.length > numOfChars) {
    return str.substring(0, numOfChars) + '...';
  }
  return str;
}
