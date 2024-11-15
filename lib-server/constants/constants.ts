export const momentFormats = {
  dateTimeForFiles: 'MMM-YYYY-DD__HH-mm-ss', // Dec-2021-22__17-14-41
  dateForUsersAndPosts: 'MMMM D, YYYY', // December 22, 2021
} as const;

// defined const time 24h in milliseconds
export const A_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000; // 24h in milliseconds
