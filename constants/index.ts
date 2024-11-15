export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const API_URL = {
  VERIFY_CAPTCHA: '/api/verify-captcha',
  GENERATE_NONCE: '/api/auth/crypto/generateNonce',
  TOKEN: '/api/tokens',
  PROFILE: '/api/profile',
  COMMENT: '/api/comments',
};

export const CHANNEL = {
  DEFAULT: 'default/channel',
};

export const ROUTE = {
  HOME: '/',
  CREATE_COIN: '/create-coin',
};

export const DEFAULT_ITEMS_PER_PAGE = 12;
export const SORT_BY_OPTIONS = ['created_at', 'last_mcap', 'last_comment'];

export const SORT_OPTIONS = [
  { value: 'lastMcap', label: 'Market Cap', key: 'lastMcap' },
  { value: 'createdAt', label: 'Recently launched', key: 'createdAt' },
  { value: 'featured', label: 'Featured', key: 'featured' },
  { value: 'lastBuy', label: 'Last bumped', key: 'lastBuy' },
  { value: 'lastComment', label: 'Last replied', key: 'lastComment' },
];

export const SORT_TYPES = [
  { value: 'desc', label: 'desc', key: 'desc' },
  { value: 'asc', label: 'asc', key: 'asc' },
];
