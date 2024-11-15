export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const API_URL = {
  VERIFY_CAPTCHA: '/api/verify-captcha',
  GENERATE_NONCE: '/api/auth/crypto/generateNonce',
};

export const CHANNEL = {
  DEFAULT: 'default/channel',
};

export const ROUTE = {
  HOME: '/',
  CREATE_COIN: '/create-coin',
};

export const DEFAULT_ITEMS_PER_PAGE = 10;
export const SORT_BY_OPTIONS = ['created_at', 'last_mcap', 'last_comment'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'lastTrade', label: 'Last Trade' },
  { value: 'creationTime', label: 'Creation Time' },
  { value: 'lastReply', label: 'Last Reply' },
  { value: 'currentlyLive', label: 'Currently Live' },
  { value: 'marketCap', label: 'Market Cap' },
];
