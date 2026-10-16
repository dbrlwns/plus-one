import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppSplash } from '../src/components/AppSplash';
import { AppDataProvider, useAppData } from '../src/state/AppData';
import { ThemeProvider, useTheme } from '../src/theme';

// 데이터를 불러오는 동안 네이티브 스플래시를 붙잡아 둔다 (AppSplash가 그려지면 걷는다)
SplashScreen.preventAutoHideAsync().catch(() => {});

function Root() {
  const { ready } = useAppData();
  const t = useTheme();
  const [splashDone, setSplashDone] = useState(false);
  const onSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {ready ? (
        <>
          <StatusBar style={t.mode === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg } }} />
        </>
      ) : null}
      {splashDone ? null : <AppSplash ready={ready} onDone={onSplashDone} />}
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <ThemeProvider>
          <Root />
        </ThemeProvider>
      </AppDataProvider>
    </SafeAreaProvider>
  );
}
