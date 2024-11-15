import { THEME_MODE } from '.';

const LIGHT_THEME_COLOR = {
  headerBg: '#3E494C',
  text: '#F0F6FF',
  bodyColor: '#1A1F21',
  primary: '#AC66F3',
  success: '#3EBE74',
  secondary: '#B7C1CC',
  info: '#05AAD6',
  cardBg: '#2F383B',
};

const DARK_THEME_COLOR = {
  headerBg: '#0A0A0A',
  text: '#F0F6FF',
  bodyColor: '#1A1F21',
  primary: '#AC66F3',
  success: '#3EBE74',
  secondary: '#B7C1CC',
  info: '#05AAD6',
  cardBg: '#2F383B',
};

// TODO: get theme mode
const themeMode = THEME_MODE.DARK;

export const THEME_COLOR =
  themeMode === THEME_MODE.LIGHT ? LIGHT_THEME_COLOR : DARK_THEME_COLOR;

export { LIGHT_THEME_COLOR, DARK_THEME_COLOR };
