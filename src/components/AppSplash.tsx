import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { createElement, useEffect, useRef, useState } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, useColorScheme, View } from 'react-native';

/** 앱 안 스플래시를 최소한 이만큼은 보여준다 (너무 빨리 지나가면 글자를 읽을 수 없다) */
const MIN_VISIBLE_MS = 1000;
const FADE_MS = 300;
/** 네이티브 스플래시(app.json의 imageWidth)와 같은 크기여야 로고 위치가 이어진다 */
const LOGO_SIZE = 200;

const LOGO = {
  light: require('../../assets/splash-logo-light.png'),
  dark: require('../../assets/splash-logo-dark.png'),
};
const COLORS = {
  light: { bg: '#F4F5F7', title: '#14171C', sub: '#6A7280' },
  dark: { bg: '#0E1013', title: '#F2F4F7', sub: '#9AA3B2' },
};

function Logo({ source }: { source: number }) {
  // 웹에서 react-native-web의 Image는 원본 크기를 강제하므로 <img>를 쓴다
  if (Platform.OS === 'web') {
    return createElement('img', {
      src: Asset.fromModule(source).uri,
      alt: '',
      draggable: false,
      style: { width: LOGO_SIZE, height: LOGO_SIZE },
    });
  }
  return <Image source={source} style={{ width: LOGO_SIZE, height: LOGO_SIZE }} resizeMode="contain" />;
}

/**
 * 앱 시작 화면. 네이티브 스플래시(로고)와 같은 자리에 로고를 두고 그 아래에 글자를 붙인다.
 * 데이터가 준비되고 최소 시간이 지나면 서서히 사라진다.
 */
export function AppSplash({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = COLORS[scheme];
  const opacity = useRef(new Animated.Value(1)).current;
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready || !minElapsed) return;
    Animated.timing(opacity, { toValue: 0, duration: FADE_MS, useNativeDriver: true }).start(() => onDone());
  }, [ready, minElapsed, opacity, onDone]);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.root, { backgroundColor: c.bg, opacity }]}
      pointerEvents="auto"
      // 우리 화면이 그려진 뒤에 네이티브 스플래시를 걷어서 흰 화면이 끼어들지 않게 한다
      onLayout={() => {
        void SplashScreen.hideAsync().catch(() => {});
      }}
    >
      <Logo source={LOGO[scheme]} />
      <View style={styles.texts}>
        <Text style={[styles.title, { color: c.title }]}>Plus one</Text>
        <Text style={[styles.sub, { color: c.sub }]}>for home fitness</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  // 로고는 화면 한가운데, 글자는 그 아래에 (iOS 네이티브 스플래시 이미지와 같은 배치)
  texts: { position: 'absolute', top: '50%', marginTop: 47, alignItems: 'center' },
  title: { fontSize: 20, lineHeight: 24, fontWeight: '700' },
  sub: { fontSize: 9, lineHeight: 11, marginTop: 2, letterSpacing: 0.6 },
});
