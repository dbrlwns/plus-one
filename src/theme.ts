import { useColorScheme } from 'react-native';

const light = {
  bg: '#F4F5F7',
  card: '#FFFFFF',
  text: '#14171C',
  subtext: '#6A7280',
  border: '#E0E3E8',
  primary: '#2F6BFF',
  onPrimary: '#FFFFFF',
  success: '#2DA44E',
  danger: '#D64545',
  rest: '#8B93A1',
  warn: '#E08A00',
  chip: '#E9ECF1',
};

const dark: typeof light = {
  bg: '#0E1013',
  card: '#1A1D23',
  text: '#F2F4F7',
  subtext: '#9AA3B2',
  border: '#2A2F38',
  primary: '#5B8CFF',
  onPrimary: '#0E1013',
  success: '#3FB863',
  danger: '#F06A6A',
  rest: '#6B7380',
  warn: '#F0A020',
  chip: '#262B33',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}
