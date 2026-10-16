import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { useAppData } from './state/AppData';

const light = {
  mode: 'light' as 'light' | 'dark',
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
  mode: 'dark',
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
export type ThemeSetting = 'system' | 'light' | 'dark';

const ThemeContext = createContext<Theme | null>(null);

/**
 * 설정의 테마(시스템/라이트/다크)를 반영한다.
 * useAppData를 직접 쓰는 컴포넌트가 아니라 이 컨텍스트만 구독하게 해서, 루틴 같은 데이터가 바뀔 때 색상만 쓰는 컴포넌트까지 다시 그려지지 않게 한다.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useAppData();
  const system = useColorScheme();
  const setting: ThemeSetting = settings.theme ?? 'system';
  const mode = setting === 'system' ? (system === 'dark' ? 'dark' : 'light') : setting;

  // 네이티브의 키보드/기본 대화상자 색도 같이 맞춘다 (웹에는 없을 수 있다)
  useEffect(() => {
    try {
      Appearance.setColorScheme?.(setting === 'system' ? 'unspecified' : setting);
    } catch {
      // ignore
    }
  }, [setting]);

  return <ThemeContext.Provider value={mode === 'dark' ? dark : light}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const fromContext = useContext(ThemeContext);
  const system = useColorScheme();
  return fromContext ?? (system === 'dark' ? dark : light);
}
