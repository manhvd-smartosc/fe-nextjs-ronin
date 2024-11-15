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

export const DEFAULT_ITEMS_PER_PAGE = 9;
export const SORT_BY_OPTIONS = ['created_at', 'last_mcap', 'last_comment'];

export const SORT_OPTIONS = [
  { value: 'lastBuy', label: 'Last Buy' },
  { value: 'createdAt', label: 'Creation Time' },
  { value: 'lastComment', label: 'Last Reply' },
  { value: 'lastMcap', label: 'Market Cap' },
];

export const SORT_TYPES = [
  { value: 'asc', label: 'asc' },
  { value: 'desc', label: 'desc' },
];
