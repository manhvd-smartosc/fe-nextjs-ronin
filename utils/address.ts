export const shortenAddress = (
  address?: string,
  numChars: number = 12,
): string => {
  if (!address) return '';

  if (typeof numChars !== 'number') return address;

  if (address.length <= numChars) {
    return address;
  }

  const start = address.slice(0, numChars);
  const end = address.slice(-numChars);

  return `${start}...${end}`;
};

export const getFirstSixChars = (address?: string): string => {
  if (!address) return '';
  return address.slice(2, 8);
};
