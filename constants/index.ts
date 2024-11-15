export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const API_URL = {
  GENERATE_NONCE: '/api/auth/crypto/generateNonce',
  TOKEN: '/api/tokens',
  PROFILE: '/api/profile',
  COMMENT: '/api/comments',
  TRADE: '/api/trades',
  CANDLESTICKS: '/api/candlesticks',
  TOKEN_HOLDERS: '/api/tokenHolders',
};

export const CHANNEL = {
  DEFAULT: 'default/channel',
};

export const ROUTE = {
  HOME: '/',
  CREATE_COIN: '/create-token',
  PROFILE: '/profile',
  TOKEN: '/token',
};

export const DEFAULT_ITEMS_PER_PAGE = 12;

export const SORT_OPTIONS = [
  { value: 'lastMcap', label: 'Market Cap', key: 'lastMcap' },
  { value: 'createdAt', label: 'Recently launched', key: 'createdAt' },
  { value: 'lastFeatured', label: 'Featured', key: 'lastFeatured' },
  { value: 'lastBuy', label: 'Last bumped', key: 'lastBuy' },
  { value: 'lastComment', label: 'Last replied', key: 'lastComment' },
];

export const SORT_TYPES = [
  { value: 'desc', label: 'desc', key: 'desc' },
  { value: 'asc', label: 'asc', key: 'asc' },
];

export const DEFAULT_MAX_SLIPPAGE = '20';
