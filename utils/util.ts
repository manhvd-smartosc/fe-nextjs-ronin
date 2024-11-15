export const uniqueString = (length: number) => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const isBrowser = () => typeof window !== 'undefined';

/**
 * min, max included
 */
export const getRandomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isUrl = (str: string) => {
  return /^https?:\/\//gi.test(str);
};

/**
 * in seconds
 */
export const sleep = (seconds: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000));
};

// this is not perfect, should be called in all jest.config.js
// jest imports with node, not ts-node
export const isGithubActionsAppEnv = (): boolean => {
  return process.env.APP_ENV === 'ci';
};

/**
 * Note: this might give wrong path in tests
 */
export const rootDirAbsolutePath = process.cwd();

/**
 * filter special chars and replace spaces with '_'
 */
export const filterSearchTerm = (
  searchTerm: string | undefined,
  operator: 'space' | 'or' = 'space',
): string | undefined => {
  // 'cat_dog' matches 'cat dog'
  const joinBy = operator === 'space' ? '_' : ' | ';

  return (
    searchTerm &&
    searchTerm
      .trim()
      .replace(/[^a-z0-9\s]+/gi, '') // remove special chars
      .split(/\s+/)
      .join(joinBy)
  );
};

export function getDifferenceTime(timestamp: number): string {
  const now = Date.now();
  const differenceInMilliseconds = now - timestamp;

  // Calculate the difference in seconds, minutes, hours, and days
  const seconds = Math.floor(differenceInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours >= 1) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
}

export const formatTimestring = (timeString: string): string => {
  const date = new Date(timeString);
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const DD = String(date.getDate()).padStart(2, '0');
  const YYYY = date.getFullYear();
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const SS = String(date.getSeconds()).padStart(2, '0');

  return `${MM}/${DD}/${YYYY} ${HH}:${mm}:${SS}`;
};


export function removeEmptyValues<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => !!value)
  ) as Partial<T>;
}